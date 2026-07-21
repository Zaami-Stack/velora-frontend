import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrder: "",
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponsPage() {
  const { t } = useLanguage();
  const { success, error: toastError } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.coupons();
      setCoupons(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm({ ...emptyForm });
    setModal("add");
  }

  function openEdit(c) {
    setForm({
      code: c.code,
      discountType: c.discountType ?? c.discount_type ?? "percentage",
      discountValue: String(c.discountValue ?? c.discount_value ?? ""),
      minOrder: String(c.minOrder ?? c.min_order ?? ""),
      maxUses: String(c.maxUses ?? c.max_uses ?? ""),
      expiresAt: c.expiresAt ?? c.expires_at ?? "",
      isActive: c.isActive ?? c.is_active ?? true,
    });
    setModal({ type: "edit", id: c.id });
  }

  function handleCodeChange(value) {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setForm({ ...form, code: upper });
  }

  async function handleSave() {
    if (!form.code || !form.discountValue) {
      toastError(t("couponsPage.requiredFields"));
      return;
    }
    try {
      setSaving(true);
      const payload = {
        code: form.code.toUpperCase(),
        discount_type: form.discountType,
        discount_value: Number(form.discountValue),
        min_order: form.minOrder ? Number(form.minOrder) : null,
        max_uses: form.maxUses ? Number(form.maxUses) : null,
        expires_at: form.expiresAt || null,
        is_active: form.isActive,
      };
      if (modal?.type === "edit") {
        const updated = await api.admin.updateCoupon(modal.id, payload);
        setCoupons(coupons.map((c) => (c.id === modal.id ? updated : c)));
        success(t("couponsPage.couponUpdated"));
      } else {
        const created = await api.admin.createCoupon(payload);
        setCoupons([...coupons, created]);
        success(t("couponsPage.couponCreated"));
      }
      setModal(null);
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.admin.deleteCoupon(id);
      setCoupons(coupons.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      success(t("couponsPage.couponDeleted"));
    } catch (err) {
      toastError(err.message);
    }
  }

  function getCouponStatus(c) {
    const isActive = c.isActive ?? c.is_active;
    if (!isActive) return { label: t("couponsPage.inactive"), color: "bg-gray-500/10 text-gray-500" };
    const expiresAt = c.expiresAt ?? c.expires_at;
    if (expiresAt && new Date(expiresAt) < new Date()) return { label: t("couponsPage.expired"), color: "bg-red-400/10 text-red-400" };
    return { label: t("couponsPage.active"), color: "bg-emerald-400/10 text-emerald-400" };
  }

  function formatDiscount(c) {
    const type = c.discountType ?? c.discount_type;
    const value = c.discountValue ?? c.discount_value;
    if (type === "percentage") return `${value}%`;
    return `$${value}`;
  }

  function formatUsage(c) {
    const used = c.timesUsed ?? c.times_used ?? 0;
    const max = c.maxUses ?? c.max_uses;
    if (!max) return `${used} / \u221e`;
    return `${used} / ${max}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("couponsPage.heading")}</h1>
          <p className="text-sm text-gray-400 mt-1">{t("couponsPage.couponCount", { count: coupons.length })}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-950 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {t("couponsPage.addCoupon")}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{t("couponsPage.noCoupons")}</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.code")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.discount")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.minOrder")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.usage")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.expires")}</th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.status")}</th>
                  <th className="text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{t("couponsPage.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const status = getCouponStatus(c);
                  const expiresAt = c.expiresAt ?? c.expires_at;
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-semibold text-white font-mono">{c.code}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white">{formatDiscount(c)}</span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">
                        {(c.minOrder ?? c.min_order) ? `$${c.minOrder ?? c.min_order}` : "\u2014"}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">{formatUsage(c)}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-400">
                        {expiresAt ? new Date(expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.color}`}>{status.label}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.edit")}</button>
                          <button onClick={() => setDeleteConfirm(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.delete")}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-white/5">
            {coupons.map((c) => {
              const status = getCouponStatus(c);
              const expiresAt = c.expiresAt ?? c.expires_at;
              return (
                <div key={c.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white font-mono">{c.code}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white">{formatDiscount(c)}</span>
                    <span className="text-[11px] text-gray-500">{formatUsage(c)}</span>
                    {expiresAt && <span className="text-[11px] text-gray-500">{new Date(expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.edit")}</button>
                    <button onClick={() => setDeleteConfirm(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.delete")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(modal === "add" || modal?.type === "edit") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{modal?.type === "edit" ? t("couponsPage.editCoupon") : t("couponsPage.addCoupon")}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.code")} *</label>
                <input value={form.code} onChange={(e) => handleCodeChange(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 font-mono uppercase" placeholder={t("couponsPage.codePlaceholder")} maxLength={20} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.discountType")} *</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20">
                    <option value="percentage">{t("couponsPage.percentage")}</option>
                    <option value="fixed">{t("couponsPage.fixed")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.discountValue")} *</label>
                  <input type="number" min="0" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.minOrder")}</label>
                  <input type="number" min="0" step="0.01" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("couponsPage.minOrderPlaceholder")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.maxUses")}</label>
                  <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("couponsPage.maxUsesPlaceholder")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("couponsPage.expiresAt")}</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/20" />
                  <span className="text-sm text-gray-300">{t("couponsPage.active")}</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">{t("common.cancel")}</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                {saving ? t("common.saving") : modal?.type === "edit" ? t("common.save") : t("couponsPage.createCoupon")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-2">{t("couponsPage.deleteCoupon")}</h3>
            <p className="text-sm text-gray-300 mb-5">{t("couponsPage.deleteConfirm")} <strong>{deleteConfirm.code}</strong>?</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">{t("common.cancel")}</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-5 py-2 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 ring-1 ring-red-500/20 transition-colors cursor-pointer">{t("common.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
