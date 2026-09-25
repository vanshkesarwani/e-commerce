import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

// ==========================================
// FLOATING "SCROLL UP TO NAVBAR" BUTTON
// Visible when user scrolls down beyond 300px
// ==========================================
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Scroll to top (Navbar)"
      aria-label="Scroll to top"
      className="fixed bottom-20 sm:bottom-8 right-5 z-40 p-3 rounded-full bg-slate-900/90 hover:bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-400/40 shadow-xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      <FaChevronUp className="text-sm transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
};

export default BackToTopButton;
