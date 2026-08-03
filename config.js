// Use the Supabase Project URL and browser-safe Publishable key (sb_publishable_...).
// A legacy anon key also works. Never place a Secret or service_role key here.
window.RCE_CONFIG = Object.freeze({
  supabaseUrl: "https://ezerkcduxgjvaugxsfel.supabase.co",
  supabaseAnonKey: "sb_publishable_2jEJbyi9Xmnc3yoLmS5qHQ_1VcWFdsR",
  productName: "Report Card Enterprise",
  productVersion: "7.4.0",
  productShortName: "RCE",
  productTagline: "School Report Card and Academic Records System",
  productLogoPath: "assets/rce-master-logo.png",
  masterEdition: true,
  appName: "Report Card Enterprise",
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
  logoPath: "assets/rce-master-logo.png",
  defaultReportTemplatePath: "assets/approved-terminal-report-template.png"
});
// Temporary compatibility alias for installations generated before v7.2.6.
window.NIS_CONFIG = window.RCE_CONFIG;
