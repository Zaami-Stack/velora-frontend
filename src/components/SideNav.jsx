import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const categories = [
  { key: "newIn", sub: ["maxiDresses", "miniDresses", "midiDresses", "slipDresses", "blouses", "tailored"] },
  { key: "dresses", sub: ["maxiDresses", "miniDresses", "midiDresses", "slipDresses"] },
  { key: "tops", sub: ["blouses", "tShirts", "cropTops", "bodysuits"] },
  { key: "pants", sub: ["tailored", "wideLeg", "skinny", "cargo"] },
  { key: "blazers", sub: ["singleBreasted", "doubleBreasted", "oversized", "cropped"] },
  { key: "knitwear", sub: ["cardigans", "sweaters", "knitDresses", "vests"] },
  { key: "shoes", sub: ["heels", "boots", "sandals", "flats"] },
  { key: "bags", sub: ["shoulder", "crossbody", "tote", "clutch"] },
  { key: "accessories", sub: ["jewellery", "scarves", "belts", "sunglasses"] },
];

export default function SideNav({ isOpen, onClose, activeCategory, onCategoryChange }) {
  const [expanded, setExpanded] = useState(null);
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCategoryClick = (catKey) => {
    if (expanded === catKey) {
      setExpanded(null);
    } else {
      setExpanded(catKey);
    }
  };

  const handleSubCategoryClick = (catKey) => {
    onCategoryChange(t("categories." + catKey));
    onClose();
    setExpanded(null);
  };

  const handleAllClick = (catKey) => {
    onCategoryChange(t("categories." + catKey));
    onClose();
    setExpanded(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[55] transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-950 z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-full sm:w-[420px] lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:border-r lg:border-gray-100 dark:lg:border-white/5`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close header */}
          <div className="flex items-center justify-between px-8 h-16 lg:hidden">
            <span className="text-[13px] font-medium text-gray-900 dark:text-white tracking-[0.2em] uppercase">
              {t("nav.menu")}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-gray-900 dark:text-white hover:opacity-50 transition-opacity cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto lg:pt-8">
            {/* Main categories */}
            <ul className="px-8">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <div className="border-b border-gray-100 dark:border-white/5 last:border-b-0">
                    <button
                      onClick={() => handleCategoryClick(cat.key)}
                      className="w-full flex items-center justify-between py-4 group cursor-pointer"
                    >
                      <span
                        className={`text-[13px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                          activeCategory === t("categories." + cat.key)
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        }`}
                      >
                        {t("categories." + cat.key)}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform duration-300 ${
                          expanded === cat.key ? "rotate-45" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    {/* Sub-categories */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                        expanded === cat.key ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => handleAllClick(cat.key)}
                        className="block w-full text-left text-[12px] font-medium uppercase tracking-[0.15em] text-gray-900 dark:text-white mb-3 hover:opacity-50 transition-opacity cursor-pointer"
                      >
                        {t("subcategories.viewAllCategory", { category: t("categories." + cat.key) })}
                      </button>
                      <ul className="space-y-2">
                        {cat.sub.map((sub) => (
                          <li key={sub}>
                            <button
                              onClick={() => handleSubCategoryClick(cat.key)}
                              className={`text-[12px] tracking-[0.1em] transition-colors duration-300 cursor-pointer ${
                                activeCategory === t("subcategories." + sub)
                                  ? "text-gray-900 dark:text-white font-medium"
                                  : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              {t("subcategories." + sub)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom links */}
          <div className="px-8 py-6 sm:py-8 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{t("common.language")}</span>
              <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-full p-0.5">
                <button
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    lang === "en"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("fr")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    lang === "fr"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  FR
                </button>
              </div>
            </div>
            <ul className="space-y-1">
              {[
                { key: "storeLocator", label: t("nav.storeLocator") },
                { key: "help", label: t("nav.help") },
                { key: "contactUs", label: t("nav.contactUs") },
              ].map((link) => (
                <li key={link.key}>
                  <button
                    onClick={onClose}
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-left py-2 block w-full"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
