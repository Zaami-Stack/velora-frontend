import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

export default function PagesPage() {
  const { t } = useLanguage();
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState("about");
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await api.admin.pages();
      setPages(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getPage(slug) {
    return pages.find((p) => p.slug === slug);
  }

  function getContent(slug) {
    const page = getPage(slug);
    return page?.content || {};
  }

  function updateContent(slug, field, value) {
    setPages(pages.map((p) => {
      if (p.slug === slug) {
        return { ...p, content: { ...p.content, [field]: value } };
      }
      return p;
    }));
  }

  async function handleSave(slug) {
    try {
      setSaving(true);
      const content = getContent(slug);
      await api.admin.updatePage(slug, content);
      success(t("pagesPage.saved"));
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-64 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("pagesPage.heading")}</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "about"
              ? "bg-white text-gray-950"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {t("pagesPage.about")}
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "contact"
              ? "bg-white text-gray-950"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {t("pagesPage.contact")}
        </button>
      </div>

      {activeTab === "about" && (
        <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.title")}</label>
            <input
              value={getContent("about").title || ""}
              onChange={(e) => updateContent("about", "title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.subtitle")}</label>
            <input
              value={getContent("about").subtitle || ""}
              onChange={(e) => updateContent("about", "subtitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.story")}</label>
            <textarea
              value={getContent("about").story || ""}
              onChange={(e) => updateContent("about", "story", e.target.value)}
              rows={4}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.mission")}</label>
            <textarea
              value={getContent("about").mission || ""}
              onChange={(e) => updateContent("about", "mission", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.values")}</label>
            <textarea
              value={Array.isArray(getContent("about").values) ? getContent("about").values.join(", ") : getContent("about").values || ""}
              onChange={(e) => updateContent("about", "values", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))}
              rows={2}
              className={inputClass}
              placeholder={t("pagesPage.valuesHint")}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave("about")}
              disabled={saving}
              className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.title")}</label>
            <input
              value={getContent("contact").title || ""}
              onChange={(e) => updateContent("contact", "title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.email")}</label>
              <input
                value={getContent("contact").email || ""}
                onChange={(e) => updateContent("contact", "email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.phone")}</label>
              <input
                value={getContent("contact").phone || ""}
                onChange={(e) => updateContent("contact", "phone", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.address")}</label>
            <input
              value={getContent("contact").address || ""}
              onChange={(e) => updateContent("contact", "address", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{t("pagesPage.hours")}</label>
            <input
              value={getContent("contact").hours || ""}
              onChange={(e) => updateContent("contact", "hours", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-400">{t("pagesPage.socialLinks")}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Instagram</label>
                <input
                  value={getContent("contact").instagram || ""}
                  onChange={(e) => updateContent("contact", "instagram", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Facebook</label>
                <input
                  value={getContent("contact").facebook || ""}
                  onChange={(e) => updateContent("contact", "facebook", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">TikTok</label>
                <input
                  value={getContent("contact").tiktok || ""}
                  onChange={(e) => updateContent("contact", "tiktok", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave("contact")}
              disabled={saving}
              className="px-5 py-2 bg-white text-gray-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
