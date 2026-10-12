// "2026-10-10T20:05:00Z" becomes "Oct 10, 2026"
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });