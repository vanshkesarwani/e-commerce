import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import apiClient from "../api/apiClient";

// ==========================================
// LUXURY HERO BANNER SLIDER WITH FALLBACKS
// ==========================================
const DEFAULT_HERO_SLIDES = [
  {
    title: "Elevate Your Style",
    subtitle: "New Season Arrivals",
    description: "Discover the latest trends in luxury fashion, premium footwear, and contemporary accessories.",
    cta: "Shop The Collection",
    link: "/women",
    bgGradient: "from-slate-900 via-indigo-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Sophisticated Footwear",
    subtitle: "Engineered for Comfort",
    description: "Handcrafted sneakers and formal footwear designed with timeless aesthetics and durability.",
    cta: "Explore Footwear",
    link: "/footwear",
    bgGradient: "from-zinc-950 via-stone-900 to-black",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Modern Living & Decor",
    subtitle: "Curated Home Essentials",
    description: "Transform your living space with minimal aesthetic decor and kitchen craftsmanship.",
    cta: "View Home Collection",
    link: "/homeandkitchen",
    bgGradient: "from-slate-950 via-slate-900 to-zinc-950",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
  },
];

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await apiClient.get("/banner/all");
        if (data?.banners && data.banners.length > 0) {
          setBanners(data.banners);
        } else {
          setBanners(DEFAULT_HERO_SLIDES);
        }
      } catch (error) {
        setBanners(DEFAULT_HERO_SLIDES);
      }
    };

    fetchBanners();
  }, []);

  const slideCount = banners.length > 0 ? banners.length : DEFAULT_HERO_SLIDES.length;

  useEffect(() => {
    if (slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  };

  const slides = banners.length > 0 ? banners : DEFAULT_HERO_SLIDES;

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 select-none">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isUploadedBanner = Boolean(slide?.bannerImage?.url);
          const bgImg = isUploadedBanner ? slide.bannerImage.url : slide.image;

          return (
            <div
              key={index}
              className="w-full flex-shrink-0 relative h-[420px] sm:h-[480px] lg:h-[560px] flex items-center"
            >
              {/* Background Image with Dark Vignette */}
              <img
                src={bgImg}
                alt={slide.title || `Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.65]"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Text Content Overlay */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
                <div className="max-w-xl space-y-4 animate-fadeIn">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
                    {slide.subtitle || "Exclusive Collection"}
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                    {slide.title || "Curated Modern Luxury"}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md">
                    {slide.description ||
                      "Explore high-grade apparel, footwear, beauty, and decor designed with attention to detail."}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={slide.link || "/women"}
                      className="inline-flex items-center px-6 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-amber-400 hover:text-slate-950 shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {slide.cta || "Shop Collection"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Buttons */}
      <button
        onClick={prevBanner}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-200 shadow-lg z-20"
      >
        <FaChevronLeft className="text-sm" />
      </button>

      <button
        onClick={nextBanner}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-200 shadow-lg z-20"
      >
        <FaChevronRight className="text-sm" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setCurrentIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
            className={`transition-all duration-300 rounded-full h-2 ${
              currentIndex === dotIdx ? "w-8 bg-amber-400" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeBanner;