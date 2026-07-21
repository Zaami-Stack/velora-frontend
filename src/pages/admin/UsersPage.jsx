import { useState, useEffect } from "react";
import { api } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.admin.users();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-7 w-32 bg-white/5 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5 animate-pulse">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-white/5 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-white/5 rounded w-32 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-white text-gray-950 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">{t("common.tryAgain")}</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{t("usersPage.heading")}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">{t("usersPage.description")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">{t("usersPage.totalUsers")}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">{t("usersPage.totalRevenue")}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">${users.reduce((sum, u) => sum + Number(u.totalSpent || 0), 0).toFixed(2)}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5 col-span-2 sm:col-span-1">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">{t("usersPage.avgOrderValue")}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">
            ${users.length > 0 ? (users.reduce((sum, u) => sum + Number(u.totalSpent || 0), 0) / Math.max(users.reduce((sum, u) => sum + u.orderCount, 0), 1)).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.customer")}</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.phone")}</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.joined")}</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.orders")}</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.totalSpent")}</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("usersPage.role")}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500">{t("usersPage.noUsers")}</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(u.name)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400">{u.phone || "—"}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-3.5 text-sm text-white font-medium">{u.orderCount}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-white">${Number(u.totalSpent).toFixed(2)}</td>
                  <td className="px-6 py-3.5">
                    {Number(u.isAdmin || u.is_admin) === 1 ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white ring-1 ring-white/20">{t("common.admin")}</span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-gray-400">{t("common.client")}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-white/5">
          {users.length === 0 ? (
            <p className="px-4 py-12 text-center text-xs text-gray-500">{t("usersPage.noUsers")}</p>
          ) : users.map((u) => (
            <div key={u.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(u.name)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    {Number(u.isAdmin || u.is_admin) === 1 && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white ring-1 ring-white/20 ml-2 shrink-0">{t("common.admin")}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 ml-12">
                <span className="text-[10px] text-gray-500">{t("usersPage.ordersCount", { count: u.orderCount })}</span>
                <span className="text-[10px] font-semibold text-white">${Number(u.totalSpent).toFixed(2)}</span>
                <span className="text-[10px] text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}