# Report Card Enterprise v7.4.0 r35 Final Acceptance Record

Date: 14 August 2026
Status: PRODUCTION FINAL

## Final decision

The immediate r35 production audit is accepted. All concrete correctness, integrity, security-boundary, backup/restore, Storage-lifecycle and source/template reproducibility defects discovered by the audit were corrected and re-verified before this record was sealed.

## Authoritative protected template

- ID: `9efd08ba-5b31-4eaa-b453-cc3315305d79`
- Path: `releases/r35/platform-package-template-v7-4-0-r35-final-product-stability-final.zip`
- SHA-256: `06e4b7ce0745aff3683730c3990ae1b70fe381a66494b3d324095b40bb0b6d4b`
- Size: 37,542,357 bytes
- Payload files: 367
- Internal checksum-manifest SHA-256: `a79d808e2f886a9277787e2e9729e2ed0ddf12bbd1ce4dfe29338b019aef4978`
- Scheduled-backup source SHA-256: `fd56a61a330e323083427467b9ff17f8e055d747a33d8da539718c74c99e062a`
- Future generated-school backup defaults: 7 days / minimum 2 copies

Storage metadata, registration metadata, `template_installed` and `template_validated` evidence agree on the final template identity. The one-time promoter is retired and JWT-protected.

## Final live recovery points

Master backup `097622ca-187f-40a6-ad43-a2dc61f77544`:
- completed
- verification passed
- upgrade authorization ledger rows: 1

Nipe backup `59791cbc-26a9-4401-9e76-d3b369f99937`:
- completed
- verification passed
- protected Storage: 17 objects / 29,615,473 bytes
- local upgrade authorization rows: 0

## Final live Storage snapshot

Master raw object bytes: 154,507,584
- protected templates: 112,623,098 bytes (active final + short-term rollback candidates)
- current generated school package: 41,698,987 bytes
- system backups: 185,499 bytes

Nipe raw object bytes: 218,673,823

Combined raw object bytes: 373,181,407 (approximately 0.373 GB), well below the 1 GB File Storage ceiling that triggered the earlier incident. Retention/lifecycle jobs prevent normal backup/package/template accumulation from growing indefinitely under the current workload.

## Automated lifecycle schedules

Master:
- 02:15 daily full backup
- 03:45 daily school-storage maintenance
- 04:00 daily platform package/template lifecycle maintenance
- 03:15 Sundays backup verification

Nipe:
- 02:15 daily full backup
- 03:45 daily school-storage maintenance
- 03:15 Sundays backup verification

Backup policy on both live projects: 7 days / minimum 2 copies.

## Structural invariants

At acceptance:
- 0 unvalidated public constraints on Master and Nipe
- 0 invalid/not-ready public indexes on Master and Nipe
- 0 disabled user triggers on Master and Nipe
- 0 active restore jobs
- 0 processing backups
- 0 open package reconciliations
- exactly one active Master protected template
- no superseded generated-package Storage candidate remains
- `can_manage_headteachers()` is not anonymously executable

## Nipe licence invariant

Nipe remains active Enterprise School, signed revision 5, licence reference `RCE-N-001-D9D2FFB5EA47-R1`, entitlement hash `8d19b12f743e397c095c9025a3430823968f4c2068655d005604e0c04c066b82`, package ID `0445423a-34d5-421b-9f84-3d255d0c2fdd`, installation ID `4ad797c0-5b99-484f-ba93-30581945f838`, tenant `N-001`, project `gmbchwvvdwulolgtsnfs`, signature verified, authority active, and exactly one legitimate activation-code plan-upgrade event. No licence field was changed by r35.

## Residual non-blocking advisories

- Supabase Auth advisor reports leaked-password protection disabled. The connected management integration does not expose an Auth-configuration write action, so this remains a documented platform-setting hardening item rather than an application defect.
- Mature `citext` and `btree_gist` extensions remain in the public schema. Relocation is deferred because it is an invasive maintenance operation with no current correctness gain.
- Intentional public verification RPCs and authenticated SECURITY DEFINER application RPCs continue to appear in Supabase advisor output by design; their execution boundaries/search paths were audited rather than blindly revoked.
- Performance advisor optimization backlog remains for some FK indexes, RLS init-plan expressions and permissive-policy consolidation. The exact duplicate index defect was fixed; broad production rewrites were intentionally excluded from the final stability release.
- GitHub release branches are not protected by branch-protection rules because the connected GitHub interface does not expose that mutation. Exact branch-head commit SHAs are the authoritative source freeze references.

## Scheduled confirmation

A post-cycle audit is scheduled for 15 August 2026 at 04:15 Ghana time after the real scheduled backup and maintenance workload. This is an operational confirmation of the already accepted r35 build, not a substitute for the immediate acceptance tests recorded here.
