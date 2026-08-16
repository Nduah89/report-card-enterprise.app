# Edusentia v7.4.0 r37 — Final Product-Ready Visual Release

**Release disposition:** Production Accepted, Final Security Seal Pending

## Production changes

- Added the final Edusentia academic-operations login background asset.
- Added an isolated `r37-final-ui.css` presentation layer; authentication JavaScript and form semantics were not changed.
- Activated the new login visual layer in `index.html`.
- Advanced the installation-scoped service-worker cache generation and included the new visual assets in the static cache.
- Hardened `notification-dispatcher` so email transport configuration is validated before notification jobs are claimed, preventing configuration outages from consuming retry budgets.

## Verification completed

- Master Supabase project status: ACTIVE_HEALTHY.
- Latest full backup remains completed, encrypted and verification-passed.
- Exactly one active protected template remains present and points to the r36 protected baseline.
- No r37 protected-template row or r37 protected-template Storage object was introduced.
- No RPAT generated-package Storage residue is present.
- Client error events in the preceding 24 hours: 0.
- Notification outbox pending/error count on Master: 0.
- Package reconciliation failed/pending count: 0/0.
- Scheduled notification cron runs reviewed with no failures.
- Critical authenticated SECURITY DEFINER mutators reviewed; internal role/authorization gates remain present.
- Platform package manager remains the accepted r37 production generator path; protected-template and licence bindings were not modified by this visual release.

## Rollback point

Pre-visual-release Master baseline commit: `60263c649bc831e6407b6e652fda34a4f3ab6a84`.

## Known governance items

The release remains **Final Security Seal Pending** because GitHub `main` branch protection is not enabled through the currently available repository administration tooling and Supabase leaked-password protection is unavailable on the current Free plan. These are governance/platform controls, not application runtime failures.

No secret values are recorded in this document.
