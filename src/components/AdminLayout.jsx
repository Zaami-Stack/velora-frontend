import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const NAV_LINKS = [
    { path: "/admin", label: t("admin.overview") },
    { path: "/admin/orders", label: t("admin.orders") },
    { path: "/admin/products", label: t("admin.products") },
    { path: "/admin/banners", label: t("admin.banners") },
    { path: "/admin/categories", label: t("admin.categories") },
    { path: "/admin/coupons", label: t("admin.coupons") },
    { path: "/admin/reviews", label: t("admin.reviews") },
    { path: "/admin/stock", label: t("admin.stock") },
    { path: "/admin/pages", label: t("admin.pages") },
    { path: "/admin/users", label: t("admin.users") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">{t("admin.accessDenied")}</h1>
          <p className="text-sm text-gray-400 mb-6">{t("admin.noPermission")}</p>
          <button onClick={() => navigate("/")} className="px-6 py-2.5 bg-white text-gray-950 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            {t("common.backToStore")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  location.pathname === link.path
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/")} className="text-[11px] text-gray-500 hover:text-white transition-colors cursor-pointer shrink-0 ml-3">
            {t("common.viewStore")}
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
