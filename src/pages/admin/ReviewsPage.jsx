import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ReviewsPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.admin.reviews();
      setReviews(Array.isArray(data) ? data : data?.reviews || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.admin.approveReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
      );
      toast.success(t("reviewsPage.approved"));
    } catch (err) {
      toast.error(err.message || t("reviewsPage.approveFailed"));
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await api.admin.rejectReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: false } : r))
      );
      toast.success(t("reviewsPage.rejected"));
    } catch (err) {
      toast.error(err.message || t("reviewsPage.rejectFailed"));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      await api.admin.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirm(null);
      toast.success(t("reviewsPage.deleted"));
    } catch (err) {
      toast.error(err.message || t("reviewsPage.deleteFailed"));
    } finally {
      setActionId(null);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const num = Number(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= num ? "text-amber-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("reviewsPage.heading")}</h1>
        <p className="text-sm text-gray-400 mt-1">{t("reviewsPage.description")}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 animate-pulse">
              <div className="flex gap-4">
                <div className="h-4 bg-white/5 rounded w-32" />
                <div className="h-4 bg-white/5 rounded w-24" />
                <div className="h-4 bg-white/5 rounded w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={loadReviews} className="px-5 py-2 bg-white text-gray-950 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">{t("common.tryAgain")}</button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">{t("reviewsPage.noReviews")}</p>
          <p className="text-xs text-gray-600 mt-1">{t("reviewsPage.noReviewsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.03] rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-gray-500">{review.rating}/5</span>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${review.approved ? "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20" : "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20"}`}>
                      {review.approved ? t("reviewsPage.approved") : t("reviewsPage.pending")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{review.title || t("reviewsPage.untitled")}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{review.comment || review.text || "—"}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span>{review.customerName || review.userName || t("reviewsPage.anonymous")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                      </svg>
                      <span>{review.productName || t("reviewsPage.unknownProduct")}</span>
                    </div>
                    {review.createdAt && (
                      <span>{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!review.approved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={actionId === review.id}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 ring-1 ring-emerald-400/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {actionId === review.id ? t("common.saving") : t("reviewsPage.approve")}
                    </button>
                  )}
                  {review.approved && (
                    <button
                      onClick={() => handleReject(review.id)}
                      disabled={actionId === review.id}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 ring-1 ring-amber-400/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {actionId === review.id ? t("common.saving") : t("reviewsPage.reject")}
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(review)}
                    disabled={actionId === review.id}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-400/10 text-red-400 hover:bg-red-400/20 ring-1 ring-red-400/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t("reviewsPage.deleteReview")}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t("reviewsPage.deleteWarning")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-5">{t("reviewsPage.deleteConfirm")}</p>
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
