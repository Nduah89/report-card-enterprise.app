import { createClient } from "npm:@supabase/supabase-js@2.110.5";

const PACKAGE_BUCKET = "platform-generated-packages";
const TEMPLATE_BUCKET = "platform-package-templates";
const RETENTION_DAYS = 7;

function envOptional(...names: string[]) {
  for (const name of names) {
    const value = (Deno.env.get(name) || "").trim();
    if (value) return value;
  }
  return "";
}
function getServiceKey() {
  const current = Deno.env.get("SUPABASE_SECRET_KEYS") ?? "";
  if (current) {
    try {
      const keys = JSON.parse(current) as Record<string,string>;
      if (keys.default) return keys.default;
      const first = Object.values(keys).find(Boolean);
      if (first) return first;
    } catch { /* legacy fallback */ }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}
function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0;i<a.length;i+=1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok:false, error:"method_not_allowed" },405);
  const cronSecret = envOptional("RCE_CRON_SECRET","NIS_CRON_SECRET");
  const supplied = req.headers.get("x-cron-secret") ?? "";
  if (!cronSecret || !constantTimeEqual(supplied, cronSecret)) return json({ ok:false, error:"unauthorised" },401);
  const url = envOptional("SUPABASE_URL"), key = getServiceKey();
  if (!url || !key) return json({ ok:false, error:"service_configuration_unavailable" },500);

  const db = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const cutoff = new Date(Date.now()-RETENTION_DAYS*86400000);
  const cutoffIso = cutoff.toISOString();
  const result = { finalized_interrupted:0, packages_pruned:0, package_failures:0, template_objects_pruned:0, staging_objects_pruned:0, staging_active_conflicts:0 };
  try {
    const interrupted = await db.from("platform_package_artifacts").select("id,storage_path").eq("deletion_state","storage_removed").limit(100);
    if (interrupted.error) throw interrupted.error;
    for (const row of interrupted.data ?? []) {
      const now = new Date().toISOString();
      const fin = await db.from("platform_package_artifacts").update({status:"deleted",deletion_state:"completed",deleted_at:now,deletion_reason:"r37 superseded package retention cleanup",storage_path:`deleted/${row.id}`}).eq("id",row.id).eq("deletion_state","storage_removed");
      if (fin.error) throw fin.error;
      await db.from("platform_package_reconciliation").update({status:"completed",completed_at:now,attempts:1,last_error:""}).eq("artifact_id",row.id).eq("operation","delete_storage").eq("status","pending");
      result.finalized_interrupted++;
    }

    const candidates = await db.from("platform_package_artifacts").select("id,tenant_code,storage_path,superseded_by_artifact_id,revoked_at,deletion_state").eq("status","revoked").in("deletion_state",["none","failed"]).not("superseded_by_artifact_id","is",null).lt("revoked_at",cutoffIso).order("revoked_at",{ascending:true}).limit(50);
    if (candidates.error) throw candidates.error;
    for (const artifact of candidates.data ?? []) {
      const replacement = await db.from("platform_package_artifacts").select("id,tenant_code,status,deletion_state").eq("id",artifact.superseded_by_artifact_id).maybeSingle();
      if (replacement.error) throw replacement.error;
      if (!replacement.data || replacement.data.tenant_code!==artifact.tenant_code || replacement.data.status!=="ready" || replacement.data.deletion_state!=="none") continue;
      const recon = await db.from("platform_package_reconciliation").insert({artifact_id:artifact.id,storage_path:artifact.storage_path,operation:"delete_storage",status:"pending",attempts:0,last_error:""}).select("id").single();
      if (recon.error) throw recon.error;
      await db.from("platform_package_artifacts").update({deletion_state:"pending"}).eq("id",artifact.id);
      const removed = await db.storage.from(PACKAGE_BUCKET).remove([artifact.storage_path]);
      if (removed.error) {
        const message=removed.error.message||String(removed.error);
        await db.from("platform_package_artifacts").update({deletion_state:"failed",deletion_reason:message}).eq("id",artifact.id);
        await db.from("platform_package_reconciliation").update({status:"failed",attempts:1,last_error:message}).eq("id",recon.data.id);
        result.package_failures++;
        continue;
      }
      await db.from("platform_package_artifacts").update({deletion_state:"storage_removed"}).eq("id",artifact.id);
      const now=new Date().toISOString();
      const fin=await db.from("platform_package_artifacts").update({status:"deleted",deletion_state:"completed",deleted_at:now,deletion_reason:"r37 superseded package retention cleanup",storage_path:`deleted/${artifact.id}`}).eq("id",artifact.id).eq("deletion_state","storage_removed");
      if(fin.error)throw fin.error;
      await db.from("platform_package_reconciliation").update({status:"completed",completed_at:now,attempts:1,last_error:""}).eq("id",recon.data.id);
      await db.from("platform_package_events").insert({event_type:"package_deleted",artifact_id:artifact.id,event_reason:"Superseded generated package pruned after retention window",event_data:{release:"r37-product-ready",previous_storage_path:artifact.storage_path,replacement_artifact_id:artifact.superseded_by_artifact_id,policy:"superseded-package-retention"}});
      result.packages_pruned++;
    }

    const templates = await db.from("platform_package_templates").select("id,storage_path,active,updated_at").order("updated_at",{ascending:false});
    if (templates.error) throw templates.error;
    const allTemplates = templates.data ?? [];
    const inactive=allTemplates.filter(t=>!t.active);
    const keepRollbackId=inactive[0]?.id??null;
    for(const t of inactive){
      if(t.id===keepRollbackId)continue;
      if(!t.storage_path||String(t.storage_path).startsWith("staging/"))continue;
      if(new Date(t.updated_at).getTime()>=cutoff.getTime())continue;
      const rm=await db.storage.from(TEMPLATE_BUCKET).remove([t.storage_path]);
      if(rm.error)throw rm.error;
      await db.from("platform_package_events").insert({event_type:"template_storage_pruned",template_id:t.id,event_reason:"Inactive template archive pruned; immediate rollback template retained",event_data:{release:"r37-product-ready",storage_path:t.storage_path,policy:"one-template-rollback-retention"}});
      result.template_objects_pruned++;
    }

    const stagingFolders = await db.storage.from(TEMPLATE_BUCKET).list("staging",{limit:500,sortBy:{column:"name",order:"asc"}});
    if(stagingFolders.error && !/not found/i.test(stagingFolders.error.message||"")) throw stagingFolders.error;
    for(const folder of stagingFolders.data ?? []){
      const folderName=String(folder.name||""); if(!folderName)continue;
      const files=await db.storage.from(TEMPLATE_BUCKET).list(`staging/${folderName}`,{limit:1000,sortBy:{column:"name",order:"asc"}});
      if(files.error)throw files.error;
      for(const file of files.data ?? []){
        const name=String(file.name||""); if(!name)continue;
        const path=`staging/${folderName}/${name}`;
        const updatedAt=new Date(String(file.updated_at||file.created_at||0));
        if(Number.isNaN(updatedAt.getTime())||updatedAt.getTime()>=cutoff.getTime())continue;
        const ref=allTemplates.find(t=>String(t.storage_path||"")===path);
        if(ref?.active){result.staging_active_conflicts++;continue;}
        const rm=await db.storage.from(TEMPLATE_BUCKET).remove([path]);
        if(rm.error)throw rm.error;
        await db.from("platform_package_events").insert({event_type:"template_staging_pruned",template_id:ref?.id??null,event_reason:"Stale protected-template staging object pruned after retention window",event_data:{release:"r37-product-ready",storage_path:path,policy:"stale-template-staging-retention"}});
        result.staging_objects_pruned++;
      }
    }
    return json({ok:true,release:"r37-product-ready",retention_days:RETENTION_DAYS,...result});
  }catch(error){return json({ok:false,error:error instanceof Error?error.message:String(error),...result},500);}
});
