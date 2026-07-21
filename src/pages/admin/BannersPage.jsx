import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = {
  title: "",
  subtitle: "",
  badge: "",
  buttonText: "",
  buttonLink: "#products",
  image: "",
  sortOrder: "0",
  isActive: true,
};

export default function BannersPage() {
  const { t } = useLanguage();
  const { success, error: toastError } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.banners();
      setBanners(data);
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

  function openEdit(b) {
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      badge: b.badge || "",
      buttonText: b.buttonText || "",
      buttonLink: b.buttonLink || "#products",
      image: b.image,
      sortOrder: String(b.sortOrder ?? b.sort_order ?? 0),
      isActive: b.isActive ?? b.is_active ?? true,
    });
    setModal({ type: "edit", id: b.id });
  }

  async function handleSave() {
    if (!form.title || !form.image) {
      toastError(t("bannersPage.requiredFields"));
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        subtitle: form.subtitle || null,
        badge: form.badge || null,
        button_text: form.buttonText || null,
        button_link: form.buttonLink || "#products",
        image: form.image,
        sort_order: Number(form.sortOrder) || 0,
        is_active: form.isActive,
      };
      if (modal?.type === "edit") {
        const updated = await api.admin.updateBanner(modal.id, payload);
        setBanners(banners.map((b) => (b.id === modal.id ? updated : b)));
        success(t("bannersPage.bannerUpdated"));
      } else {
        const created = await api.admin.createBanner(payload);
        setBanners([...banners, created]);
        success(t("bannersPage.bannerCreated"));
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
      await api.admin.deleteBanner(id);
      setBanners(banners.filter((b) => b.id !== id));
      setDeleteConfirm(null);
      success(t("bannersPage.bannerDeleted"));
    } catch (err) {
      toastError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("bannersPage.heading")}</h1>
          <p className="text-sm text-gray-400 mt-1">{t("bannersPage.bannerCount", { count: banners.length })}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-950 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {t("bannersPage.addBanner")}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{t("bannersPage.noBanners")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden hover:bg-white/[0.05] transition-colors">
              <img src={b.image} alt={b.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{b.subtitle}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      {b.badge && <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-gray-300">{b.badge}</span>}
                      <span className="text-[10px] text-gray-500">{t("bannersPage.order")}: {b.sortOrder ?? b.sort_order ?? 0}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${(b.isActive ?? b.is_active) ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-500/10 text-gray-500"}`}>
                        {(b.isActive ?? b.is_active) ? t("bannersPage.active") : t("bannersPage.inactive")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => openEdit(b)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.edit")}</button>
                  <button onClick={() => setDeleteConfirm(b)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.delete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === "add" || modal?.type === "edit") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{modal?.type === "edit" ? t("bannersPage.editBanner") : t("bannersPage.addBanner")}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.title")} *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("bannersPage.titlePlaceholder")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.subtitle")}</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("bannersPage.subtitlePlaceholder")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.badge")}</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("bannersPage.badgePlaceholder")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.sortOrder")}</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.buttonText")}</label>
                  <input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("bannersPage.buttonTextPlaceholder")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.buttonLink")}</label>
                  <input value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="#products" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("bannersPage.imageUrl")} *</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="https://..." />
                {form.image && <img src={form.image} alt="" className="mt-2 w-full h-32 rounded-lg object-cover bg-white/5" />}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/20" />
                  <span className="text-sm text-gray-300">{t("bannersPage.visible")}</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">{t("common.cancel")}</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                {saving ? t("common.saving") : modal?.type === "edit" ? t("common.save") : t("bannersPage.createBanner")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-2">{t("bannersPage.deleteBanner")}</h3>
            <p className="text-sm text-gray-300 mb-5">{t("bannersPage.deleteConfirm")} <strong>{deleteConfirm.title}</strong>?</p>
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
