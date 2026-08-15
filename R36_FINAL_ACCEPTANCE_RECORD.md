# Edusentia v7.4.0 r36 Final Acceptance Record

**Status:** PRODUCTION ACCEPTED  
**Accepted:** 15 August 2026

## Product identity

- Global brand: **Edusentia**
- Company identity: **Edusentia Technologies**
- Master platform: **Edusentia Enterprise**
- School platform: **Edusentia School**
- Positioning: **The Academic Operations Platform**

The former product name has been replaced in the current customer-facing Master identity and in the future-school package generator. Internal `RCE` compatibility identifiers remain intentionally preserved.

## Live protected template

- ID: `4b7d0552-81e8-41e8-bf24-7ba9b6f5ab16`
- Path: `releases/r36/platform-package-template-v7-4-0-r36-edusentia-brand-identity.zip`
- SHA-256: `004f9ea90cf040254297cddeab6a51cf6c2d326e5ca7f92737ab5bccd4d5c685`
- Size: 37,442,162 bytes
- Payload files: 368
- Active template count: exactly 1
- Independent archive verification: CRC PASS; 368/368 manifest hashes PASS; checksum mirrors PASS; Edusentia brand identity PASS.

## Package generation runtime

- `platform-package-manager`: v39 ACTIVE, JWT protected
- Edge bundle SHA-256: `4ae0dbabc31484c50aeed66706ed5409d000705aeb9269c500f8e5c1a3fe486d`
- Reconstructed accepted v38 functional source SHA-256: `f759aa3d52f609b24a59531351dc79101b9ccfe9b8c836ab6108de44eecc99ba`
- Deterministic r36 Edusentia generator source SHA-256: `9e5180c8e493f7c13d8e2621af545808d728c681ea624e6d5b91375a7b492ec2`
- Legacy customer-facing product-name occurrences in the resulting generator source: 0

## Post-release recovery points

### Enterprise Master

- Backup: `b6836ec7-26f8-4aea-8e22-96bdf1ce3bde`
- Status: completed
- Verification: passed
- Verification method: database JSON decrypt/decompress, identity binding and row-count integrity rehearsal.

### Nipe International School

- Backup: `f65ac215-f7fe-48f6-b9b0-9d561923cf2a`
- Status: completed
- Verification: passed
- Protected Storage: 17 objects / 29,615,473 bytes checksum/decrypt verified.

## Nipe licence invariant

The Nipe signed licence remains unchanged:

- Reference: `RCE-N-001-D9D2FFB5EA47-R1`
- Plan: Enterprise School
- Signed revision: 5
- Entitlement hash: `8d19b12f743e397c095c9025a3430823968f4c2068655d005604e0c04c066b82`
- Package ID: `0445423a-34d5-421b-9f84-3d255d0c2fdd`
- Installation ID: `4ad797c0-5b99-484f-ba93-30581945f838`
- Project ref: `gmbchwvvdwulolgtsnfs`
- Tenant: `N-001`
- Signature: verified
- Authority: active
- Legitimate activation-code plan-upgrade events: exactly 1

No cryptographic licence field was renamed or regenerated for the brand release.

## Public deployment

Both GitHub Pages deployments rebuilt successfully from their fast-forwarded `main` branches with HTTPS enforced. Master now exposes Edusentia / Edusentia Enterprise configuration. Nipe exposes Nipe International School as an Edusentia School installation with a visible "Powered by Edusentia" attribution.

## Storage and structural gate

At acceptance:

- Master raw Storage: 192,070,549 bytes
- Nipe raw Storage: 278,399,767 bytes
- Combined raw Storage: 470,470,316 bytes (~0.470 GB decimal)
- Both remain on 7-day retention / minimum 2 backup copies.
- Master: 0 unvalidated public constraints, 0 invalid/not-ready public indexes, 0 disabled user triggers, 0 active restore jobs, 0 pending/failed package reconciliation.
- Nipe: 0 unvalidated public constraints, 0 invalid/not-ready public indexes, 0 disabled user triggers, 0 active restore jobs, 0 restore-import residue.

## Historical signed package policy

The existing Nipe signed installation package artifact predates r36 and remains immutable as historical/recovery evidence. It is not rewritten in place because doing so would create two binary artifacts for the same signed package identity. The deployed Nipe school is branded Edusentia, and newly generated or future legitimately renewed/upgraded school packages use the r36 Edusentia generator.

## Rollback

r35 Final Product Stability remains the immediate pre-brand software/template rollback baseline. The fully verified pre-r36 backups and the fully verified post-r36 backups provide data recovery points around the release boundary.
