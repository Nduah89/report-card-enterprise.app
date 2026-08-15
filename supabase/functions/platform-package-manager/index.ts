import { createClient } from "npm:@supabase/supabase-js@2.110.5";
import JSZip from "npm:jszip@3.10.1";
const BASE_SHA256="0745e2a47b37b92e4f71aed274de3006987e3824780e08be0f25206cc4568ee0";
const V38_SHA256="f759aa3d52f609b24a59531351dc79101b9ccfe9b8c836ab6108de44eecc99ba";
const R36_SHA256="9e5180c8e493f7c13d8e2621af545808d728c681ea624e6d5b91375a7b492ec2";
function getServiceKey():string{const current=Deno.env.get("SUPABASE_SECRET_KEYS")??"";if(current){try{const keys=JSON.parse(current) as Record<string,string>;if(keys.default)return keys.default;const first=Object.values(keys).find(Boolean);if(first)return first}catch{}}return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")??""}
function hex(bytes:Uint8Array){return [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("")}
function occurrences(source:string,needle:string){let n=0,p=0;while((p=source.indexOf(needle,p))>=0){n++;p+=needle.length}return n}
function replaceCount(source:string,before:string,after:string,expected:number){const actual=occurrences(source,before);if(actual!==expected)throw new Error(`Edusentia r36 brand patch precondition ${actual}/${expected}`);return source.split(before).join(after)}
async function digest(source:string){return hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(source))))}
const url=Deno.env.get("SUPABASE_URL")??"",key=getServiceKey();
if(!url||!key)throw new Error("Edusentia r36 package-manager loader missing server credentials");
if(!JSZip||typeof JSZip.loadAsync!=="function")throw new Error("Edusentia r36 package-manager JSZip runtime failed to initialize");
Object.defineProperty(globalThis,"JSZip",{value:JSZip,writable:false,configurable:false,enumerable:false});
const service=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const{data:rows,error}=await service.from("platform_edge_payload_chunks").select("chunk_index,payload_base64,source_sha256,payload_encoding").eq("release_code","r31").eq("function_slug","platform-package-manager").order("chunk_index",{ascending:true});
if(error)throw new Error(`Edusentia r36 package-manager payload read failed: ${error.message}`);
if(!rows||rows.length!==15)throw new Error(`Edusentia r36 package-manager payload incomplete: ${rows?.length??0}/15`);
for(let i=0;i<rows.length;i++){if(Number(rows[i].chunk_index)!==i)throw new Error(`payload sequence ${i}`);if(String(rows[i].source_sha256)!==BASE_SHA256)throw new Error(`payload metadata ${i}`);if(String(rows[i].payload_encoding)!=="gzip+base64")throw new Error(`payload encoding ${i}`)}
const packed=Uint8Array.from(atob(rows.map(r=>String(r.payload_base64)).join("")),c=>c.charCodeAt(0));
let source=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
if(await digest(source)!==BASE_SHA256)throw new Error("Edusentia r36 package-manager base integrity failure");
const productionPatches=[["    const receiptChecksumDigest = cleanText(receipt.checksum_manifest_sha256, 64).toLowerCase();\n    const receiptFileCount = boundedInteger(receipt.file_count, 0, 0, MAX_ZIP_ENTRIES + 1);\n    const receiptUncompressedBytes = boundedInteger(receipt.total_uncompressed_bytes, 0, 0, MAX_ZIP_UNCOMPRESSED_BYTES + 1);\n    if (!/^[a-f0-9]{64}$/.test(receiptDigest) || !/^[a-f0-9]{64}$/.test(receiptChecksumDigest) || receiptFileCount < 1 || receiptUncompressedBytes < 1)\n        throw new Error(\"Complete browser template validation is required before activation\");\n","    if (!/^[a-f0-9]{64}$/.test(receiptDigest))\n        throw new Error(\"Browser archive SHA-256 validation is required before activation\");\n"],["        const zip = await JSZip.loadAsync(bytes, { checkCRC32: false });\n        const resources = inspectZipResources(zip);\n        const root = validateTemplateEntries(zip);\n        const checksumEntry = zip.file(`${root}PACKAGE_CHECKSUMS.sha256`);\n        if (!checksumEntry)\n            throw new Error(\"Template checksum manifest is missing\");\n        if (await sha256(await checksumEntry.async(\"uint8array\")) !== receiptChecksumDigest)\n            throw new Error(\"Template checksum manifest changed after browser validation\");\n        const actualFileCount = resources.fileCount;\n        if (actualFileCount !== receiptFileCount)\n            throw new Error(\"Template file count changed after browser validation\");\n        if (resources.totalUncompressedBytes !== receiptUncompressedBytes)\n            throw new Error(\"Template uncompressed-size metadata changed after browser validation\");\n        await validateTemplateRelease(zip, root);\n","        const zip = await JSZip.loadAsync(bytes, { checkCRC32: true });\n        const resources = inspectZipResources(zip);\n        const root = validateTemplateEntries(zip);\n        const checksumEntry = zip.file(`${root}PACKAGE_CHECKSUMS.sha256`);\n        if (!checksumEntry)\n            throw new Error(\"Template checksum manifest is missing\");\n        const receiptChecksumDigest = await sha256(await checksumEntry.async(\"uint8array\"));\n        const actualFileCount = resources.fileCount;\n        await validateTemplateRelease(zip, root);\n"],["validation_mode: \"browser-full-server-critical\"","validation_mode: \"browser-sha256-server-full\""]] as const;
for(const [before,after] of productionPatches){const first=source.indexOf(before);if(first<0||source.indexOf(before,first+1)>=0)throw new Error("Edusentia r36 v38 production patch precondition failed");source=source.replace(before,after)}
if(await digest(source)!==V38_SHA256)throw new Error("Edusentia r36 v38 source integrity failure");
source=replaceCount(source,"Report Card Enterprise","Edusentia",14);
source=replaceCount(source,'<title>Edusentia</title>','<title>Edusentia Enterprise</title>',2);
source=replaceCount(source,'productShortName: "RCE"','productShortName: "EDS"',1);
source=replaceCount(source,'School Report Card and Academic Records System','The Academic Operations Platform',2);
source=replaceCount(source,'${identity.schoolName} Report Card System','${identity.schoolName} | Edusentia School',2);
source=replaceCount(source,'${school} | Report Cards</title>','${school} | Edusentia</title>',1);
source=replaceCount(source,'Student Report Card System','Academic Records and Reporting',1);
source=replaceCount(source,'.replaceAll("Platform Administration", "Report Card System")','.replaceAll("Platform Administration", "Academic Operations")',1);
source=replaceCount(source,'description: `Student report card and academic records system for ${identity.schoolName}`','description: `Academic records, reporting and school operations for ${identity.schoolName}, powered by Edusentia`',1);
source=replaceCount(source,'edition: "Licensed School Multi-Platform Package"','edition: "Edusentia School Licensed Multi-Platform Package"',1);
const branded=await digest(source);if(branded!==R36_SHA256)throw new Error(`Edusentia r36 branded source integrity failure: ${branded}`);
if(occurrences(source,"Report Card Enterprise")!==0)throw new Error("Edusentia r36 legacy product name remained in generator source");
eval(source);
