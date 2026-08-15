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
  productLogoPath: "assets/edusentia-logo.png",
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
  logoPath: "assets/edusentia-logo.png",
  defaultReportTemplatePath: "assets/approved-terminal-report-template.png"
});
// Legacy aliases are intentionally preserved so existing installations and signed packages remain compatible.
window.NIS_CONFIG = window.RCE_CONFIG;
