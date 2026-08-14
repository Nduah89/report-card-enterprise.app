# Report Card Enterprise v7.4.0 r33
## Backup Upgrade Authorization Ledger Continuity

Status: development candidate

Purpose: include `public.license_upgrade_authorizations` in every encrypted full database backup so central one-time licence-upgrade authority state no longer requires a separate continuity supplement after each authorization change.

Implementation contract:
- Add `license_upgrade_authorizations` to the scheduled-backup `TABLES` inventory immediately after `license_binding_sessions`.
- Keep it out of `RESTORABLE_TABLES`. Authority-ledger recovery remains an explicit platform recovery operation and must not be implicitly rewritten by a school-data restore.
- Keep BACKUP_FORMAT_VERSION at 2 because the existing manifest is self-describing through `database.row_counts` and remains backward compatible.
- Keep the existing AES-256-GCM NISB2 encryption, gzip database payload, checksum verification, retention, MFA/manual controls, cron authentication and `EdgeRuntime.waitUntil()` background execution unchanged.
- A full backup must fail closed if the ledger table is expected but unavailable.

Acceptance gates:
1. TypeScript source parses successfully.
2. Master and Nipe both contain the r31+ ledger table.
3. Candidate scheduled-backup source differs from r32 only by the documented inventory addition/comment.
4. Fresh Master full backup completes and verification passes with `row_counts.license_upgrade_authorizations = 1`.
5. Fresh Nipe full backup completes and verification passes with `row_counts.license_upgrade_authorizations = 0`.
6. Existing Enterprise licence and the single completed upgrade activation remain unchanged.
7. Future-school protected template contains the same candidate scheduled-backup source and valid checksum manifest.

Candidate scheduled-backup source SHA-256:
`fe46c1ea7534ea2dfb7a59dfb0c7212cdfad12b70a59f22817b4577d2c31b89b`

No database migration is required for r32 installations because the ledger table already exists from r31.