# Report Card Enterprise v7.4.0 r35 Final Product Stability Audit

Acceptance date: 14 August 2026

## Scope

The production audit covered database constraints/indexes/triggers, SECURITY DEFINER execution boundaries and search paths, RLS exposure, Edge Function runtime/authentication, cron jobs, encrypted backup/restore integrity, Storage quota/lifecycle, licence/authority invariants, package reconciliation, protected-template identity, future-school template reproducibility, and GitHub release-source reproducibility.

## Proven defects found and corrected

1. The r34 live scheduled-backup runtime was newer than the frozen GitHub/package-template source. r35 stores the exact accepted source payload and synchronizes it into the protected future-school template.
2. `terms.term_reopening_after_end_chk` existed NOT VALID. Zero violating rows were found; the constraint is now validated on Master and Nipe.
3. `can_manage_headteachers()` inherited anonymous EXECUTE through PostgreSQL PUBLIC. PUBLIC/anon execution is revoked; authenticated and service_role are explicitly granted.
4. `report_card_templates` had a duplicate manual unique index on `storage_path`; the redundant index was removed while the unique-constraint-backed index remains.
5. Backup retention did not protect recovery-test/restore referenced backups and terminal restore uploads could remain in Storage. The accepted r35 backup source is reference-safe and cleans terminal restore uploads through the Storage API.
6. Superseded generated packages and old template archives could accumulate indefinitely. Master `platform-storage-maintenance` now removes only verified superseded/revoked packages after the retention window using reconciliation state, and retains the active protected template plus one immediate rollback archive.
7. The first r35 future-school template still inherited 30-day / 7-copy backup defaults. The final protected template now initializes new generated schools at the schema-supported Free Plan baseline of 7 days / 2 copies.

## Final protected-template invariant

- Path: `releases/r35/platform-package-template-v7-4-0-r35-final-product-stability-final.zip`
- SHA-256: `06e4b7ce0745aff3683730c3990ae1b70fe381a66494b3d324095b40bb0b6d4b`
- Size: `37,542,357` bytes
- Payload files: 367
- Internal checksum-manifest SHA-256: `a79d808e2f886a9277787e2e9729e2ed0ddf12bbd1ce4dfe29338b019aef4978`
- Embedded scheduled-backup source SHA-256: `fd56a61a330e323083427467b9ff17f8e055d747a33d8da539718c74c99e062a`
- Default retention: 7 days / minimum 2 copies

The prior r35 candidate and r33 template are inactive. The one-time final promoter is retired and JWT-protected.

## Live backup/runtime acceptance

- Master scheduled-backup: v16, accepted packed bundle SHA-256 `2eeaa759f849446d2494fd0c155118caa6c2424c60025f87925c7a91e755158a`
- Nipe scheduled-backup: v12, same accepted packed bundle
- Master final backup: `097622ca-187f-40a6-ad43-a2dc61f77544`, completed and verification passed, central upgrade ledger rows = 1
- Nipe final backup: `59791cbc-26a9-4401-9e76-d3b369f99937`, completed and verification passed, 17 protected Storage objects / 29,615,473 bytes verified, local upgrade ledger rows = 0

## Database structural acceptance

Master and Nipe both have:
- 0 unvalidated public constraints
- 0 invalid/not-ready public indexes
- 0 disabled user triggers
- 0 active restore jobs
- 0 processing backups at the acceptance gate
- `can_manage_headteachers()` anonymous EXECUTE = false

Master additionally had 0 open package reconciliations and exactly one active protected template at the acceptance gate.

## RLS and privileged RPC review

RLS-enabled internal/service tables without policies were checked for table privileges. No unintended anon/authenticated DML exposure was found. Public verification RPCs for certificate/report/student ID/staff ID/transcript verification remain intentionally public. Authenticated SECURITY DEFINER RPCs remain part of the application's server-authorized API architecture and were not mass-rewritten.

## Storage/lifecycle

The original Free Plan incident was reduced from approximately 1.352 GB raw object bytes to well below 1 GB. r35 additionally pruned the verified superseded Nipe generated package and created a Master-only lifecycle guard. The 7-day / 2-copy backup policy and daily Storage maintenance prevent normal backup accumulation from returning to the previous level under the current workload.

## Residual non-blocking platform advisories

The following are documented rather than force-modified because changing them indiscriminately would create more production risk than benefit:
- Supabase Auth leaked-password protection is currently reported disabled by the advisor; the connected management interface does not expose an Auth-config write action.
- `citext` and `btree_gist` remain installed in the public schema; relocating mature extensions is a separately planned database-maintenance operation, not a correctness fix.
- Performance advisors still report inherited missing-FK-index, RLS init-plan, permissive-policy and unused-index optimization opportunities. No broad rewrite was performed in the final stability release.
- GitHub release branches are not branch-protected because the connected GitHub interface does not expose branch-protection mutation. Exact commit SHAs are the authoritative freeze references.

## Post-cycle confirmation

A real scheduled-workload confirmation is scheduled for 15 August 2026 at 04:15 Ghana time, after the 02:15 backup, 03:45 school Storage maintenance and 04:00 Master platform lifecycle maintenance.
