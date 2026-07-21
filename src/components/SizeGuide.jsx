import { useLanguage } from "../context/LanguageContext";

const measurements = [
  { size: "XS", chest: 80, waist: 62, hips: 86, length: 68 },
  { size: "S", chest: 86, waist: 68, hips: 92, length: 70 },
  { size: "M", chest: 92, waist: 74, hips: 98, length: 72 },
  { size: "L", chest: 98, waist: 80, hips: 104, length: 74 },
  { size: "XL", chest: 104, waist: 86, hips: 110, length: 76 },
  { size: "XXL", chest: 110, waist: 92, hips: 116, length: 78 },
];

const columns = ["size", "chest", "waist", "hips", "length"];

export default function SizeGuide({ isOpen, onClose }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const colLabels = {
    size: t("sizeGuide.size") !== "sizeGuide.size" ? t("sizeGuide.size") : "Size",
    chest: t("sizeGuide.chest") !== "sizeGuide.chest" ? t("sizeGuide.chest") : "Chest (cm)",
    waist: t("sizeGuide.waist") !== "sizeGuide.waist" ? t("sizeGuide.waist") : "Waist (cm)",
    hips: t("sizeGuide.hips") !== "sizeGuide.hips" ? t("sizeGuide.hips") : "Hips (cm)",
    length: t("sizeGuide.length") !== "sizeGuide.length" ? t("sizeGuide.length") : "Length (cm)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-white/10 rounded-sm w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-light text-white tracking-wide">
            {t("sizeGuide.title") !== "sizeGuide.title" ? t("sizeGuide.title") : "Size Guide"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3.5 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {colLabels[col]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurements.map((row, i) => (
                <tr
                  key={row.size}
                  className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className={`px-6 py-3.5 ${col === "size" ? "font-medium text-white" : "text-gray-300 font-light"}`}
                    >
                      {col === "size" ? row[col] : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            {t("sizeGuide.note") !== "sizeGuide.note" ? t("sizeGuide.note") : "All measurements are in centimeters. For the best fit, we recommend taking your measurements and comparing them to the chart above."}
          </p>
        </div>
      </div>
    </div>
  );
}
