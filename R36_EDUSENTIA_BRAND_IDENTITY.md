# Edusentia v7.4.0 r36 Brand Identity

**Status:** Production brand release candidate after protected-template and runtime verification  
**Date:** 15 August 2026

## Brand architecture

- Global product brand: **Edusentia**
- Company identity: **Edusentia Technologies**
- Master platform: **Edusentia Enterprise**
- School platform: **Edusentia School**
- Reporting family: **Edusentia Reports**
- Backup and recovery family: **Edusentia Vault**
- Licensing and deployment family: **Edusentia Control**
- Positioning: **The Academic Operations Platform**

## Compatibility policy

r36 is a customer-facing brand release, not a technical namespace migration. Existing `RCE` database objects, environment variables, JavaScript configuration keys, report prefixes, licence references, signing key IDs, package IDs, installation IDs, API contracts, backup formats and cryptographic entitlement payloads remain unchanged unless a future separately tested migration explicitly replaces them.

This preserves compatibility with existing schools and avoids invalidating signed licences or recovery artifacts.

## Pre-change recovery gate

Immediately before r36 work:

- Master full backup `e933ba6c-2ae6-4206-a425-6a589ba0c6db` completed and passed full integrity verification.
- Nipe full backup `03cb58fe-489c-4b8f-8094-157b7bb16982` completed and passed full integrity verification, including 17 protected Storage objects / 29,615,473 bytes.

## Protected template

- Template ID: `4b7d0552-81e8-41e8-bf24-7ba9b6f5ab16`
- Storage path: `releases/r36/platform-package-template-v7-4-0-r36-edusentia-brand-identity.zip`
- SHA-256: `004f9ea90cf040254297cddeab6a51cf6c2d326e5ca7f92737ab5bccd4d5c685`
- Size: 37,442,162 bytes
- Payload files: 368
- Source template SHA-256: `06e4b7ce0745aff3683730c3990ae1b70fe381a66494b3d324095b40bb0b6d4b`
- Independent post-promotion verification: 368/368 payload hashes passed, CRC passed, checksum mirrors matched, brand identity passed.
- Exactly one protected template is active.

## Package generator

Production `platform-package-manager` is v39 with Edge bundle SHA-256 `4ae0dbabc31484c50aeed66706ed5409d000705aeb9269c500f8e5c1a3fe486d`.

Its execution path reconstructs the accepted v38 functional source, verifies SHA-256 `f759aa3d52f609b24a59531351dc79101b9ccfe9b8c836ab6108de44eecc99ba`, applies deterministic Edusentia brand transformations, and verifies the resulting source SHA-256 `9e5180c8e493f7c13d8e2621af545808d728c681ea624e6d5b91375a7b492ec2` before execution.

The r36 generator has zero remaining occurrences of the former customer-facing product name in its generated-package logic. Internal `RCE` identifiers remain intentionally preserved.

## Licence invariant

The Nipe school licence is not reissued or altered by this brand release. It remains the same signed Enterprise School revision 5 entitlement and retains its existing package, installation, tenant, project and authority bindings.

## Rollback

- Immediate brand/software rollback: r35 Final Product Stability.
- r35 protected template remains inactive as a rollback artifact subject to the existing retention policy.
- Pre-r36 verified backups listed above are the preferred data recovery points for a brand-release rollback.

## Release rule

No future feature work should be added to r36 after acceptance. Further functional development begins on a new release line.
