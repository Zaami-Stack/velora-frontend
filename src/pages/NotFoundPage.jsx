import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-6xl font-light text-gray-900 dark:text-white mb-4">{t("notFound.title")}</p>
        <h1 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">{t("notFound.heading")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t("notFound.description")}</p>
        <Link to="/" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          {t("notFound.backToShop")}
        </Link>
      </div>
    </div>
  );
}
