import { useState, useEffect, useCallback } from "react";

export default function Carousel({ slides, autoPlay = true, interval = 5000 }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, paused, next]);

  return (
    <div
      className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] overflow-hidden bg-gray-900 dark:bg-gray-950 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 lg:px-24">
            {slide.badge && (
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.3em] mb-3">
                {slide.badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-light text-white tracking-wide mb-2 sm:mb-4 max-w-xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-xs sm:text-sm text-white/70 max-w-md mb-4 sm:mb-8 hidden sm:block">
                {slide.subtitle}
              </p>
            )}
            {slide.buttonText && (
              <a
                href={slide.buttonLink || "#products"}
                className="px-6 sm:px-10 py-2.5 sm:py-3.5 bg-white text-gray-900 text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                {slide.buttonText}
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
