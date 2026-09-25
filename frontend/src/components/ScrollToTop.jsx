import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ==========================================
// AUTOMATIC ROUTE SCROLL-TO-TOP HANDLER
// Ensures every page navigation starts at top (navbar)
// instead of retaining bottom/footer scroll position.
// ==========================================
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration to prevent landing at bottom
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      // If there's an anchor hash, scroll to that specific element
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Immediately reset scroll position to top (navbar side)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
