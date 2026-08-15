# Edusentia v7.4.0 r37 Final Product-Ready Acceptance

## Release status

`r37-product-ready` is the final product-ready release candidate built on the accepted r36 brand baseline.

## Visual identity

- Master identity: **Edusentia Enterprise**
- Product mark assets added in PNG and SVG forms.
- PWA manifest, browser shell, icons and cache generation use the Edusentia identity.
- School deployments retain their own school logo as the primary institutional identity and show Edusentia as the technology provider.

## Production hardening

- `notification-dispatcher` upgraded to constant-time cron-secret comparison and Edusentia-safe default subjects.
- `platform-storage-maintenance` upgraded to modern Supabase secret-key loading, constant-time cron authentication and stale protected-template staging cleanup.
- Master and Nipe recurring HTTP cron jobs were rewritten so `rce_project_url` and `rce_cron_secret` are read dynamically from Supabase Vault at execution time instead of persisting decrypted secret values in `cron.job.command`.
- Old release probes/promoters/diagnostics were replaced with JWT-protected `410 Gone` stubs.

## Package generation

The active protected server archive remains the independently verified r36 base:

- Template ID: `4b7d0552-81e8-41e8-bf24-7ba9b6f5ab16`
- SHA-256: `004f9ea90cf040254297cddeab6a51cf6c2d326e5ca7f92737ab5bccd4d5c685`
- Size: 37,442,162 bytes

A full r37 archive repack was attempted twice but Supabase Free Plan Edge compute limits stopped both attempts **before any r37 object or template row was written**. The accepted safe design therefore keeps the exact verified r36 archive immutable and applies r37 as a deterministic package-generator overlay.

Production `platform-package-manager` is **v40**. Its r37 transformed generator source is locked to SHA-256:

`ecc2eb1b2d828cc0d52566e38da562a59d5ecc8694529d13bd5a4019c9154d37`

The v40 overlay adds to generated school packages:

- Edusentia visual assets
- `productLogoPath: assets/edusentia-logo.png`
- r37 PWA/cache identity
- hardened notification dispatcher
- `UPGRADE_v7_4_0_r37_PRODUCT_READY.sql`
- `00_READ_FIRST_R37_PRODUCT_READY.txt`
- r37 acceptance record

The mandatory r37 SQL finalizer rewrites generated-school cron jobs to dynamic Vault resolution immediately after the ten schema files.

## Compatibility

No licence key, entitlement hash, package ID, installation ID, signing identity, backup format, report prefix, API contract or internal `RCE` namespace was changed for branding.

## Rollback

- Immediate application/source rollback: r36 Edusentia Brand Identity
- Protected-template rollback/base: accepted r36 archive above
- Earlier recovery: r35 and older accepted baselines
