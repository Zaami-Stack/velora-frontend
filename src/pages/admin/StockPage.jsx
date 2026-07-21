import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

export default function StockPage() {
  const { t } = useLanguage();
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.stock();
      setProducts(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id, value) {
    setEdits((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave(id) {
    const stock = edits[id] !== undefined ? edits[id] : null;
    try {
      setSaving((prev) => ({ ...prev, [id]: true }));
      const updated = await api.admin.updateStock(id, stock);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      success(t("stockPage.stockUpdated"));
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleSetAllUnlimited() {
    try {
      setLoading(true);
      await Promise.all(
        products.map((p) => api.admin.updateStock(p.id, null))
      );
      const data = await api.admin.stock();
      setProducts(data);
      setEdits({});
      success(t("stockPage.allUnlimited"));
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getEffectiveStock(product) {
    if (edits[product.id] !== undefined) return edits[product.id];
    return product.stock;
  }

  function stockBadge(stock) {
    if (stock === null) return null;
    if (stock === 0) {
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-400/10 text-red-400 ring-1 ring-red-400/20">
          {t("stockPage.outOfStock")}
        </span>
      );
    }
    if (stock < 5) {
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
          {t("stockPage.lowStock")}
        </span>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("stockPage.heading")}</h1>
          <p className="text-sm text-gray-400 mt-1">{t("stockPage.description", { count: products.length })}</p>
        </div>
        <button
          onClick={handleSetAllUnlimited}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] ring-1 ring-white/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          {t("stockPage.setAllUnlimited")}
        </button>
      </div>

      {loading ? (
        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.product")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.currentStock")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.newStock")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.status")}</th>
                  <th className="text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.action")}</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-40 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-16 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-white/5 rounded-lg w-24 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-white/5 rounded-full w-20 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-white/5 rounded-lg w-16 animate-pulse ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-white/5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-4 py-4 space-y-3">
                <div className="h-4 bg-white/5 rounded w-36 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-24 animate-pulse" />
                <div className="h-8 bg-white/5 rounded-lg w-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{t("stockPage.noProducts")}</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.product")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.currentStock")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.newStock")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.status")}</th>
                  <th className="text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("stockPage.action")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const hasEdit = edits[p.id] !== undefined;
                  const displayStock = getEffectiveStock(p);
                  return (
                    <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-medium text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-500">ID: {p.id}</p>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">
                        {p.stock === null ? t("stockPage.unlimited") : p.stock}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={edits[p.id] !== undefined ? (edits[p.id] ?? "") : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "") {
                                handleEdit(p.id, undefined);
                              } else {
                                handleEdit(p.id, Number(val));
                              }
                            }}
                            placeholder={t("stockPage.stockPlaceholder")}
                            className="w-24 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                          />
                          <button
                            onClick={() => handleEdit(p.id, null)}
                            className={`px-2 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                              edits[p.id] === null
                                ? "bg-white/10 text-white"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            }`}
                            title={t("stockPage.setUnlimited")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        {stockBadge(displayStock)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={!hasEdit || saving[p.id]}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                            hasEdit
                              ? "bg-white text-gray-950 hover:bg-gray-100"
                              : "bg-white/5 text-gray-600 cursor-not-allowed"
                          } disabled:opacity-50`}
                        >
                          {saving[p.id] ? t("common.saving") : t("common.save")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden divide-y divide-white/5">
            {products.map((p) => {
              const hasEdit = edits[p.id] !== undefined;
              const displayStock = getEffectiveStock(p);
              return (
                <div key={p.id} className="px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    {stockBadge(displayStock)}
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3">
                    {t("stockPage.currentStock")}: {p.stock === null ? t("stockPage.unlimited") : p.stock}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={edits[p.id] !== undefined ? (edits[p.id] ?? "") : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          handleEdit(p.id, undefined);
                        } else {
                          handleEdit(p.id, Number(val));
                        }
                      }}
                      placeholder={t("stockPage.stockPlaceholder")}
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <button
                      onClick={() => handleEdit(p.id, null)}
                      className={`px-2 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                        edits[p.id] === null
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                      title={t("stockPage.setUnlimited")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSave(p.id)}
                      disabled={!hasEdit || saving[p.id]}
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        hasEdit
                          ? "bg-white text-gray-950 hover:bg-gray-100"
                          : "bg-white/5 text-gray-600 cursor-not-allowed"
                      } disabled:opacity-50`}
                    >
                      {saving[p.id] ? t("common.saving") : t("common.save")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
