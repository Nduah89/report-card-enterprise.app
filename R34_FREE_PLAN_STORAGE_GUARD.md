# Report Card Enterprise v7.4.0 r34
## Free Plan Storage Guard

**Date:** 14 August 2026  
**Status:** Production operational hardening

## Incident

The Supabase organization reported approximately 1.354 GB of File Storage usage, exceeding the Free Plan quota. Direct bucket inspection showed 1,352,234,836 raw Storage-object bytes across the Enterprise Master and Nipe projects before cleanup.

The dominant cause was `system-backups`, including redundant historic full backups and stale restore-upload ZIPs. Live school content was not the cause.

## Safe cleanup

Storage objects were removed through the Supabase Storage API, not by deleting `storage.objects` rows directly.

The cleanup preserved:
- the two newest completed full backups,
- the two newest verified full backups,
- all backups referenced by recovery tests or restore jobs,
- the active Enterprise protected package template,
- both generated Nipe package artifacts,
- all Nipe school-content buckets,
- Nipe's signed Enterprise licence and activation audit history.

Redundant unreferenced backup payloads and terminal/orphan restore-upload ZIPs were removed. The redundant r33 recovery staging ZIP was also removed after the accepted private r33 release object was confirmed available.

## Retention policy

Both projects now use the schema-supported minimum:
- `backup_retention_days = 7`
- `backup_minimum_copies = 2`

The r34 scheduled-backup source adds reference-safe retention: a backup referenced by `recovery_test_runs` or `school_restore_jobs` is not removed by retention.

The r34 restore path also removes terminal failed restore-upload ZIPs, and storage maintenance cleans terminal restore imports.

Canonical r34 TypeScript source SHA-256:
`fd56a61a330e323083427467b9ff17f8e055d747a33d8da539718c74c99e062a`

Pre-transpiled runtime JavaScript SHA-256:
`e75b0da8182a7bc813673b680c1b8d05ca7bf41b2930102a8c76d868821a5e95`

Accepted packed Edge bundle SHA-256:
`2eeaa759f849446d2494fd0c155118caa6c2424c60025f87925c7a91e755158a`

Live versions:
- Master `scheduled-backup`: v16
- Nipe `scheduled-backup`: v12

Both live functions passed `storage_maintenance` with HTTP 200 and subsequently re-verified their latest accepted full backup successfully.

## Permanent prevention

A new daily cron job runs `storage_maintenance` at 03:45 on both projects. The cron command resolves the project URL and cron credential from Supabase Vault at execution time; no secret value is embedded in the cron definition.

Normal scheduled full backup remains at 02:15 daily. Backup verification remains scheduled separately.

## Template repair discovered during final sweep

A recovery ZIP staged at 17:34 UTC had been registered as active after r33 acceptance. During quota cleanup that redundant staging object was removed. The final invariant sweep detected the resulting metadata drift before closure.

The previously accepted server-validated private r33 template was transactionally restored as the single active template:
- template id: `eceaaf62-4fba-4b30-a97f-5709e1e81fae`
- path: `releases/r33/platform-package-template-v7-4-0-r33-backup-upgrade-ledger-continuity.zip`
- SHA-256: `353635184ea9efe3a078acb0a6512d44008776cdae1299091cccc99bd4446246`
- size: 37,538,430 bytes

A `template_validated` repair audit event was recorded. The staging folder is now empty.

## Final measured live Storage

### Enterprise Master
- `platform-generated-packages`: 83,361,556 bytes
- `platform-package-templates`: 37,538,430 bytes
- `system-backups`: 146,304 bytes
- Master total: 121,046,290 bytes

### Nipe
- `system-backups`: 159,202,227 bytes
- `report-pdfs`: 22,108,057 bytes
- `school-branding`: 6,231,502 bytes
- `report-card-templates`: 1,107,998 bytes
- `headteacher-signatures`: 101,150 bytes
- `staff-photos`: 66,766 bytes
- Nipe total: 188,817,700 bytes

### Organization total after cleanup
`309,863,990` bytes, approximately 0.310 GB raw object storage.

Reclaimed:
`1,042,370,846` bytes, approximately 77.1% of the pre-cleanup raw object footprint.

## Licence invariant

Nipe remains:
- Enterprise School
- active
- signed revision 5
- signature verified
- authority active
- same licence reference, entitlement hash, package id, installation id, project ref, tenant and dates
- exactly one legitimate activation-code plan-upgrade event

## Rollback

r33 remains the immediate software rollback baseline. r34 changes storage/backup operational policy and does not alter the school entitlement, database schema, frontend, or protected-template payload.
