import { useEffect } from "react";
import { useLocation } from "react-router";
import { FOOTBALL_ARCHIVE_URL } from "../../constants/externalLinks";

/**
 * Football Archive moved to its own app: keep old /football-archive/* links
 * and bookmarks working by redirecting to the same path on the new site.
 */
export default function FootballArchiveRedirect() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const rest = pathname.replace(/^\/football-archive/, "") || "/";
    window.location.replace(`${FOOTBALL_ARCHIVE_URL}${rest}${search}`);
  }, [pathname, search]);

  return null;
}
