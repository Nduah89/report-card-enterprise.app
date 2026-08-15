# Edusentia r37 Unified Login Hero Acceptance

Date: 2026-08-15

Purpose: production deployment marker for the final unified login hero release.

Accepted implementation:
- one WebP hero asset: assets/edusentia-login-hero-r37.webp
- active stylesheet generation: r37-final-ui-4
- active service-worker cache generation: v7-4-0-r37-edusentia-final-ui-4
- legacy four-slice background assets are no longer referenced by the active login CSS or service-worker precache list
- authentication IDs, form semantics, MFA flow and licence bindings remain unchanged

This marker contains no runtime logic and exists only to record and retrigger the final Pages deployment after a transient zero-duration Pages build failure.
