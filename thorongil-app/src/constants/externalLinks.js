/**
 * Apps that moved out of thorongil into their own deployment.
 * Override with VITE_FOOTBALL_ARCHIVE_URL (no trailing slash).
 */
export const FOOTBALL_ARCHIVE_URL =
  import.meta.env.VITE_FOOTBALL_ARCHIVE_URL ?? "https://football-archive-web-production.up.railway.app";
