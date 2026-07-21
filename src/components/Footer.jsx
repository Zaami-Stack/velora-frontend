import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-lg font-bold text-white tracking-tight">Velora</p>
            <p className="text-sm text-gray-400 mt-2">Luxury Fashion, Redefined</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">{t("footer.home")}</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-500 hover:text-white transition-colors">{t("footer.shop")}</Link></li>
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">{t("footer.about")}</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t("footer.help")}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/track" className="text-sm text-gray-500 hover:text-white transition-colors">{t("footer.trackOrder")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs text-gray-500">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
