# Report Card Enterprise v7.4.0 r33 Final Acceptance Record

**Release:** Backup Upgrade Authorization Ledger Continuity  
**Acceptance date:** 14 August 2026  
**Status:** ACCEPTED / PRODUCTION

## Scope

r33 adds `public.license_upgrade_authorizations` to encrypted scheduled full-backup database snapshots. It remains excluded from automatic `RESTORABLE_TABLES`, so restoring ordinary school data cannot silently rewrite central upgrade authority state.

No database migration, frontend change, licence-verifier change, entitlement change, or backup-format change is required.

## Live scheduled-backup acceptance

### Enterprise master
- Edge Function: `scheduled-backup`
- Accepted version: 14
- Runtime bundle SHA-256: `cda67f7b438e4751475e020441c047a177e6bcb250891f1d58dfa32c7926056c`
- Fresh live backup: `df99d6f3-9b93-41b3-b602-d038b13123e9`
- Status: completed
- Verification: passed
- `row_counts.license_upgrade_authorizations`: 1
- Completed: `2026-08-14T16:50:56.286Z`
- Verified: `2026-08-14T16:51:00.327Z`

### Nipe
- Edge Function: `scheduled-backup`
- Accepted version: 10
- Runtime bundle SHA-256: `cda67f7b438e4751475e020441c047a177e6bcb250891f1d58dfa32c7926056c`
- Fresh live backup: `590d15a6-7f86-49f5-a004-99e4e81b8aba`
- Status: completed
- Verification: passed
- `row_counts.license_upgrade_authorizations`: 0
- Protected Storage verification: 17 objects, 29,615,473 bytes
- Completed: `2026-08-14T16:52:01.984Z`
- Verified: `2026-08-14T16:52:27.570Z`

A prior probe verification encountered one transient Storage gateway read and subsequently passed against the same immutable backup. The live acceptance cycle passed normally.

## Future-school protected template

Exactly one protected template is active on the Enterprise master.

- Storage path: `releases/r33/platform-package-template-v7-4-0-r33-backup-upgrade-ledger-continuity.zip`
- SHA-256: `353635184ea9efe3a078acb0a6512d44008776cdae1299091cccc99bd4446246`
- Size: 37,538,430 bytes
- Server-validated payload files: 363
- Embedded scheduled-backup source SHA-256: `92df4a3c5a03cccb02bcdaf06f82482a24ed3833b6197eae6f1014296e301b75`
- Audit events: `template_installed` and `template_validated`

The previous r32 template was automatically deactivated and remains available as the immediate rollback baseline.

## Licence regression check

Nipe remains:
- Enterprise School
- signed revision 5
- active
- signature verified
- authority active
- entitlement hash `8d19b12f743e397c095c9025a3430823968f4c2068655d005604e0c04c066b82`
- exactly one completed `activation_code_plan_upgrade` event

Licence reference, tenant, project, package, installation, expiry and grace binding are unchanged.

## Security / recovery boundary

`license_upgrade_authorizations` is backed up and integrity-verified, but is intentionally not part of automatic restore tables. Any authority-ledger recovery must remain an explicit platform recovery operation.

## Final decision

**r33 Backup Upgrade Authorization Ledger Continuity is accepted for production.**
