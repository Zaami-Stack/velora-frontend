import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

const emptyForm = {
  name: "",
  slug: "",
  image: "",
  sortOrder: "0",
  isActive: true,
};

export default function CategoriesPage() {
  const { t } = useLanguage();
  const { success, error: toastError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.categories();
      setCategories(data);
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
      name: c.name,
      slug: c.slug,
      image: c.image || "",
      sortOrder: String(c.sortOrder ?? c.sort_order ?? 0),
      isActive: c.isActive ?? c.is_active ?? true,
    });
    setModal({ type: "edit", id: c.id });
  }

  function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!form.name) {
      toastError(t("categoriesPage.requiredFields"));
      return;
    }
    const slug = form.slug || generateSlug(form.name);
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        slug,
        image: form.image || null,
        sort_order: Number(form.sortOrder) || 0,
        is_active: form.isActive,
      };
      if (modal?.type === "edit") {
        const updated = await api.admin.updateCategory(modal.id, payload);
        setCategories(categories.map((c) => (c.id === modal.id ? updated : c)));
        success(t("categoriesPage.categoryUpdated"));
      } else {
        const created = await api.admin.createCategory(payload);
        setCategories([...categories, created]);
        success(t("categoriesPage.categoryCreated"));
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
      await api.admin.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      success(t("categoriesPage.categoryDeleted"));
    } catch (err) {
      toastError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("categoriesPage.heading")}</h1>
          <p className="text-sm text-gray-400 mt-1">{t("categoriesPage.description")}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-950 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {t("categoriesPage.addCategory")}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{t("categoriesPage.noCategories")}</p>
          <p className="text-xs text-gray-600 mt-1">{t("categoriesPage.noCategoriesDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden hover:bg-white/[0.05] transition-colors">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-white/[0.02] flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">/{c.slug}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-500">{t("categoriesPage.order")}: {c.sortOrder ?? c.sort_order ?? 0}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${(c.isActive ?? c.is_active) ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-500/10 text-gray-500"}`}>
                        {(c.isActive ?? c.is_active) ? t("categoriesPage.active") : t("categoriesPage.inactive")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.edit")}</button>
                  <button onClick={() => setDeleteConfirm(c)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">{t("common.delete")}</button>
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
              <h2 className="text-lg font-bold text-white">{modal?.type === "edit" ? t("categoriesPage.editCategory") : t("categoriesPage.addCategory")}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("categoriesPage.name")} *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("categoriesPage.namePlaceholder")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("categoriesPage.slug")}</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder={t("categoriesPage.slugPlaceholder")} />
                <p className="text-[10px] text-gray-600 mt-1">{t("categoriesPage.slugHint")}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("categoriesPage.imageUrl")}</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" placeholder="https://..." />
                {form.image && <img src={form.image} alt="" className="mt-2 w-full h-32 rounded-lg object-cover bg-white/5" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("categoriesPage.sortOrder")}</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/20" />
                    <span className="text-sm text-gray-300">{t("categoriesPage.active")}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">{t("common.cancel")}</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                {saving ? t("common.saving") : modal?.type === "edit" ? t("common.save") : t("categoriesPage.createCategory")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-2">{t("categoriesPage.deleteCategory")}</h3>
            <p className="text-sm text-gray-300 mb-5">{t("categoriesPage.deleteConfirm")} <strong>{deleteConfirm.name}</strong>?</p>
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
