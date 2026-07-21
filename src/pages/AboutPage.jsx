import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/Layout";

const defaultContent = {
  heroTitle: "Our Story",
  heroSubtitle: "A passion for timeless elegance and refined craftsmanship.",
  storyTitle: "The Story of Velora",
  storyText:
    "Founded in 2020, Velora was born from a desire to create clothing that transcends seasons and trends. Every piece we design is rooted in simplicity, quality, and an unwavering attention to detail. We believe that true luxury lies in the perfect balance of form and function, in fabrics that feel as beautiful as they look, and in silhouettes that empower the wearer.",
  missionTitle: "Our Mission",
  missionText:
    "To redefine modern luxury through sustainable practices and timeless design. We are committed to creating pieces that last — not just in quality, but in style.",
  valuesTitle: "Our Values",
  values: [
    { icon: "⏳", title: "Timeless Design", text: "Pieces crafted to transcend fleeting trends and remain relevant season after season." },
    { icon: "♦", title: "Uncompromising Quality", text: "Premium fabrics and meticulous construction in every garment we produce." },
    { icon: "🌿", title: "Sustainability", text: "Responsible sourcing and ethical production at the core of everything we do." },
    { icon: "💎", title: "Refined Elegance", text: "A commitment to understated beauty that speaks louder than excess." },
  ],
  ctaText: "Explore the Collection",
};

export default function AboutPage() {
  const { t } = useLanguage();
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    api.products
      .page("about")
      .then((data) => {
        if (data && data.content) {
          setContent((prev) => ({ ...prev, ...data.content }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Layout hideSideNav>
      <div className="bg-gray-950 min-h-screen">
        <section className="relative py-24 md:py-36 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400 mb-6">{t("aboutPage.badge") || content.heroSubtitle}</p>
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-wide mb-6">
              {t("aboutPage.heroTitle") !== "aboutPage.heroTitle" ? t("aboutPage.heroTitle") : content.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              {t("aboutPage.heroSubtitle") !== "aboutPage.heroSubtitle" ? t("aboutPage.heroSubtitle") : content.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-6">
                {t("aboutPage.storyTitle") !== "aboutPage.storyTitle" ? t("aboutPage.storyTitle") : content.storyTitle}
              </h2>
              <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed whitespace-pre-line">
                {t("aboutPage.storyText") !== "aboutPage.storyText" ? t("aboutPage.storyText") : content.storyText}
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-6">
                {t("aboutPage.missionTitle") !== "aboutPage.missionTitle" ? t("aboutPage.missionTitle") : content.missionTitle}
              </h2>
              <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-12">
                {t("aboutPage.missionText") !== "aboutPage.missionText" ? t("aboutPage.missionText") : content.missionText}
              </p>

              <h3 className="text-lg font-light text-white tracking-wide mb-6">
                {t("aboutPage.valuesTitle") !== "aboutPage.valuesTitle" ? t("aboutPage.valuesTitle") : content.valuesTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(content.values || []).map((value, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-sm p-5 hover:bg-white/[0.07] transition-colors">
                    <span className="text-2xl block mb-3">{value.icon}</span>
                    <h4 className="text-sm font-medium text-white mb-2">
                      {t(`aboutPage.value${i}Title`) !== `aboutPage.value${i}Title` ? t(`aboutPage.value${i}Title`) : value.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      {t(`aboutPage.value${i}Text`) !== `aboutPage.value${i}Text` ? t(`aboutPage.value${i}Text`) : value.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-20 md:py-28 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-6">
              {t("aboutPage.ctaTitle") !== "aboutPage.ctaTitle" ? t("aboutPage.ctaTitle") : "Discover Velora"}
            </h2>
            <p className="text-sm text-gray-400 font-light mb-10 max-w-md mx-auto">
              {t("aboutPage.ctaSubtitle") !== "aboutPage.ctaSubtitle" ? t("aboutPage.ctaSubtitle") : "Experience the collection and find pieces that speak to your sense of style."}
            </p>
            <Link
              to="/shop"
              className="inline-block px-10 py-3.5 bg-white text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-100 transition-colors"
            >
              {t("aboutPage.ctaText") !== "aboutPage.ctaText" ? t("aboutPage.ctaText") : content.ctaText}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
