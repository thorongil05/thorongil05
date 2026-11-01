/**
 * Opens a link from a menu or card: absolute URLs (other apps) leave the
 * SPA, relative paths go through react-router.
 */
export function openLink(navigate, href) {
  if (/^https?:\/\//.test(href)) {
    window.location.assign(href);
    return;
  }
  navigate(href);
}
