// Edusentia Enterprise v7.4.0 r37 Product Ready.
// Internal RCE configuration identifiers remain for backward compatibility.
// Use only the browser-safe Supabase Publishable key here. Never place a secret/service-role key in this file.
window.RCE_CONFIG = Object.freeze({
  supabaseUrl: "https://ezerkcduxgjvaugxsfel.supabase.co",
  supabaseAnonKey: "sb_publishable_2jEJbyi9Xmnc3yoLmS5qHQ_1VcWFdsR",
  productName: "Edusentia",
  productVersion: "7.4.0",
  productShortName: "EDS",
  productTagline: "The Academic Operations Platform",
  productLogoPath: "assets/edusentia-mark.svg",
  masterEdition: true,
  appName: "Edusentia Enterprise",
  schoolName: "",
  schoolShortName: "",
  userEmailDomain: "school.invalid",
  reportNumberPrefix: "RCE",
  generatedSchoolPackage: false,
  tenantCode: "",
  packageId: "",
  installationId: "",
  projectRef: "",
  authorizedDomain: "",
  licenseKeyId: "",
  logoPath: "assets/edusentia-mark.svg",
  defaultReportTemplatePath: "assets/approved-terminal-report-template.png"
});
window.NIS_CONFIG = window.RCE_CONFIG;

// r37 transport hardening: platform-package-manager v43 is intentionally kept
// integrity-protected. Browser calls are routed through the JWT-protected
// platform-package-gateway so CORS preflight never has to boot the large v43
// package engine. All other Supabase Edge Function routes are unchanged.
(() => {
  "use strict";
  const sdk = window.supabase;
  if (!sdk || typeof sdk.createClient !== "function" || sdk.__edusentiaPackageGatewayInstalled) return;
  const originalCreateClient = sdk.createClient.bind(sdk);
  sdk.createClient = (...args) => {
    const client = originalCreateClient(...args);
    try {
      const functionsClient = client.functions;
      if (functionsClient && typeof functionsClient.invoke === "function") {
        const originalInvoke = functionsClient.invoke.bind(functionsClient);
        functionsClient.invoke = (functionName, options) => originalInvoke(
          functionName === "platform-package-manager" ? "platform-package-gateway" : functionName,
          options
        );
        // Supabase exposes functions through a getter. Pin this wrapped instance
        // to the created client so later client.functions.invoke calls use the
        // same transport-safe FunctionsClient.
        Object.defineProperty(client, "functions", {
          value: functionsClient,
          enumerable: false,
          configurable: false,
          writable: false
        });
      }
    } catch (error) {
      console.error("Edusentia package transport bootstrap failed", error);
    }
    return client;
  };
  try {
    Object.defineProperty(sdk, "__edusentiaPackageGatewayInstalled", {
      value: true,
      enumerable: false,
      configurable: false
    });
  } catch {
    sdk.__edusentiaPackageGatewayInstalled = true;
  }
})();
