# r32 Native Frontend Patch

Base: frozen `release/v7.4.0-r31-production`.

The protected r32 template applies these native frontend changes to the root, GitHub Pages mirror, and Android embedded web mirror:

1. Runtime marker changes to `7.4.0-r32-plan-upgrade-navigation`.
2. `NAV` adds `plan_upgrade` after `license_capacity`, labelled **Plan Upgrade**, restricted to `system_admin`.
3. `ROLE_NAV_IDS.system_admin` includes `plan_upgrade` between `license_capacity` and `settings`.
4. Navigation filtering suppresses `plan_upgrade` unless `CONFIG.generatedSchoolPackage === true`.
5. The renderer map routes `plan_upgrade` to `renderPlanUpgrade`.
6. `renderPlanUpgrade` displays the current signed plan, supported upgrade path, licence expiry, installation binding, protected-field invariants, and an **Enter upgrade code** control.
7. The control reuses the r31 `openLicenceUpgradeActivation` modal, which calls `license-verifier` `preview_upgrade` and `activate_upgrade` and therefore retains the existing MFA/AAL2 and central-authority security boundary.
8. Successful activation refreshes licence/bootstrap state and returns to `Plan Upgrade` when that is the active view.
9. Enterprise renders **Highest plan active** with no higher code-based upgrade action.
10. `index.html` cache-busting URLs and `service-worker.js` cache revision are advanced to r32.

No r32 database migration, licence rewrite, service-role key exposure, authority-token exposure, or signing-private-key change is introduced by this patch.

Existing r30 school frontends may use the isolated compatibility runtime deployed to Nipe until they are replaced by a native r32 generated-school frontend. Future generated packages use the protected r32 template directly.
