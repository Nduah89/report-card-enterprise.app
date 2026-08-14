# r32 Dedicated Plan Upgrade Navigation Acceptance Checklist

- [x] r31 production branch remains frozen and unchanged.
- [x] Nipe pre-r32 rollback branch created before deployment.
- [x] Nipe `config.js` preserved unchanged.
- [x] Nipe database and signed licence preserved unchanged during frontend rollout.
- [x] Nipe GitHub Pages deployment completed successfully on the r32 commit.
- [x] Nipe r32 service-worker cache revision deployed.
- [x] Nipe dedicated `Plan Upgrade` navigation compatibility runtime deployed.
- [x] Master r32 protected template generated from the accepted r31 archive.
- [x] Master r32 template checksum file set verified server-side.
- [x] Master r32 protected template registered as the only active template.
- [x] Previous r31 template automatically deactivated, not deleted.
- [x] Temporary r32 promotion/upload helpers retired and JWT protected.
- [x] Nipe still reports Professional, active, signed revision 2, signature verified, authority active, original entitlement hash, and zero activation upgrade events before user activation.
- [ ] System Administrator visually confirms `Plan Upgrade` appears in the deployed Nipe navigation.
- [ ] System Administrator opens Plan Upgrade and verifies the generated one-time code under MFA/AAL2.
- [ ] Upgrade preview shows Professional -> Enterprise and preserves licence identity/binding/dates.
- [ ] System Administrator activates Enterprise using the authorized code.
- [ ] Post-activation verification confirms Enterprise entitlement, signature/authority status, immutable binding continuity, and single-use/replay protection.

r32 must not be declared fully accepted until the remaining authenticated school-side checks pass.
