import { useState } from "react";

const categories = [
  { name: "New In", sub: ["Dresses", "Tops", "Pants"] },
  { name: "Dresses", sub: ["Maxi Dresses", "Mini Dresses", "Midi Dresses", "Slip Dresses"] },
  { name: "Tops", sub: ["Blouses", "T-Shirts", "Crop Tops", "Bodysuits"] },
  { name: "Pants", sub: ["Tailored", "Wide Leg", "Skinny", "Cargo"] },
  { name: "Blazers", sub: ["Single Breasted", "Double Breasted", "Oversized", "Cropped"] },
  { name: "Knitwear", sub: ["Cardigans", "Sweaters", "Knit Dresses", "Vests"] },
  { name: "Shoes", sub: ["Heels", "Boots", "Sandals", "Flats"] },
  { name: "Bags", sub: ["Shoulder", "Crossbody", "Tote", "Clutch"] },
  { name: "Accessories", sub: ["Jewellery", "Scarves", "Belts", "Sunglasses"] },
];

export default function SideNav({ isOpen, onClose, activeCategory, onCategoryChange }) {
  const [expanded, setExpanded] = useState(null);

  const handleCategoryClick = (catName) => {
    if (expanded === catName) {
      setExpanded(null);
    } else {
      setExpanded(catName);
    }
  };

  const handleSubCategoryClick = (parentName) => {
    onCategoryChange(parentName);
    onClose();
    setExpanded(null);
  };

  const handleAllClick = (catName) => {
    onCategoryChange(catName);
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
              Menu
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
                <li key={cat.name}>
                  <div className="border-b border-gray-100 dark:border-white/5 last:border-b-0">
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className="w-full flex items-center justify-between py-4 group cursor-pointer"
                    >
                      <span
                        className={`text-[13px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                          activeCategory === cat.name
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform duration-300 ${
                          expanded === cat.name ? "rotate-45" : ""
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
                        expanded === cat.name ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => handleAllClick(cat.name)}
                        className="block w-full text-left text-[12px] font-medium uppercase tracking-[0.15em] text-gray-900 dark:text-white mb-3 hover:opacity-50 transition-opacity cursor-pointer"
                      >
                        View All {cat.name}
                      </button>
                      <ul className="space-y-2">
                        {cat.sub.map((sub) => (
                          <li key={sub}>
                            <button
                              onClick={() => handleSubCategoryClick(cat.name)}
                              className={`text-[12px] tracking-[0.1em] transition-colors duration-300 cursor-pointer ${
                                activeCategory === sub
                                  ? "text-gray-900 dark:text-white font-medium"
                                  : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              {sub}
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
          <div className="px-8 py-8 border-t border-gray-100 dark:border-white/5">
            <ul className="space-y-4">
              {["Store Locator", "Help", "Contact Us"].map((link) => (
                <li key={link}>
                  <button
                    onClick={onClose}
                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link}
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
