import { useState, useEffect } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";

const defaultContent = {
  heroTitle: "Get in Touch",
  heroSubtitle: "We'd love to hear from you. Reach out and we'll get back to you as soon as possible.",
  email: "support@velora.com",
  phone: "+212 600 000 000",
  address: "123 Avenue Mohammed V, Casablanca, Morocco",
  hours: "Mon – Fri: 9:00 AM – 6:00 PM",
  socialLinks: [
    { name: "Instagram", url: "#" },
    { name: "Twitter", url: "#" },
    { name: "Pinterest", url: "#" },
    { name: "TikTok", url: "#" },
  ],
};

const contactInfoCards = [
  { key: "email", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
  ) },
  { key: "phone", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
  ) },
  { key: "address", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
  ) },
  { key: "hours", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [content, setContent] = useState(defaultContent);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.products
      .page("contact")
      .then((data) => {
        if (data && data.content) {
          setContent((prev) => ({ ...prev, ...data.content }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    setTimeout(() => {
      toast.success(t("contactPage.successToast") || "Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 800);
  };

  const infoValues = {
    email: content.email,
    phone: content.phone,
    address: content.address,
    hours: content.hours,
  };

  return (
    <Layout hideSideNav>
      <div className="bg-gray-950 min-h-screen">
        <section className="relative py-24 md:py-36 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-wide mb-6">
              {t("contactPage.heroTitle") !== "contactPage.heroTitle" ? t("contactPage.heroTitle") : content.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              {t("contactPage.heroSubtitle") !== "contactPage.heroSubtitle" ? t("contactPage.heroSubtitle") : content.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-8">
                {t("contactPage.infoTitle") !== "contactPage.infoTitle" ? t("contactPage.infoTitle") : "Contact Information"}
              </h2>
              <div className="space-y-4 mb-12">
                {contactInfoCards.map((card) => (
                  <div key={card.key} className="flex items-start gap-4 bg-white/5 border border-white/5 rounded-sm p-5">
                    <div className="text-gray-400 mt-0.5 shrink-0">{card.icon}</div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        {t(`contactPage.${card.key}Label`) !== `contactPage.${card.key}Label` ? t(`contactPage.${card.key}Label`) : card.key.charAt(0).toUpperCase() + card.key.slice(1)}
                      </p>
                      <p className="text-sm text-white font-light">{infoValues[card.key]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-light text-white tracking-wide mb-6">
                {t("contactPage.socialTitle") !== "contactPage.socialTitle" ? t("contactPage.socialTitle") : "Follow Us"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {(content.socialLinks || []).map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-sm text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-8">
                {t("contactPage.formTitle") !== "contactPage.formTitle" ? t("contactPage.formTitle") : "Send a Message"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {t("contactPage.nameLabel") !== "contactPage.nameLabel" ? t("contactPage.nameLabel") : "Name"}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("contactPage.namePlaceholder") !== "contactPage.namePlaceholder" ? t("contactPage.namePlaceholder") : "Your name"}
                    className="w-full px-4 py-3 text-sm border border-white/10 bg-white/5 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {t("contactPage.emailLabel") !== "contactPage.emailLabel" ? t("contactPage.emailLabel") : "Email"}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t("contactPage.emailPlaceholder") !== "contactPage.emailPlaceholder" ? t("contactPage.emailPlaceholder") : "you@example.com"}
                    className="w-full px-4 py-3 text-sm border border-white/10 bg-white/5 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {t("contactPage.messageLabel") !== "contactPage.messageLabel" ? t("contactPage.messageLabel") : "Message"}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contactPage.messagePlaceholder") !== "contactPage.messagePlaceholder" ? t("contactPage.messagePlaceholder") : "How can we help you?"}
                    rows={5}
                    className="w-full px-4 py-3 text-sm border border-white/10 bg-white/5 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !form.name.trim() || !form.email.trim() || !form.message.trim()}
                  className="w-full px-6 py-3.5 bg-white text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending
                    ? (t("contactPage.sending") !== "contactPage.sending" ? t("contactPage.sending") : "Sending...")
                    : (t("contactPage.send") !== "contactPage.send" ? t("contactPage.send") : "Send Message")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
