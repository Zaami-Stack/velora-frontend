import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../assets/Animations/Login Character Animation.json";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("email"); // email | question | success
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setErrors({ email: t("common.emailRequired") }); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErrors({ email: t("common.invalidEmail") }); return; }

    setIsLoading(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setSecurityQuestion(res.securityQuestion);
      setStep("question");
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!answer.trim()) errs.answer = t("auth.answerRequired");
    if (!newPassword) errs.newPassword = t("auth.newPasswordRequired");
    else if (newPassword.length < 6) errs.newPassword = t("common.passwordMinLength");
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await api.auth.resetPassword(email, answer, newPassword);
      setStep("success");
      toast.success(t("auth.passwordResetSuccess"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) => `w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm dark:shadow-white/5 ${errors[field] ? "border-red-400 focus:ring-red-500" : "border-gray-300 dark:border-white/10 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"}`;

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 h-full overflow-hidden bg-white items-center justify-center shrink-0">
        <div className="w-[500px] h-[500px]">
          <DotLottieReact data={loginAnimation} className="w-full h-full" loop autoplay />
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto px-4 sm:px-6 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto">

          {/* Step 1: Enter email */}
          {step === "email" && (
            <div className="mt-8">
              <div className="w-14 h-14 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t("auth.resetPassword")}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 text-sm sm:text-base">
                {t("auth.resetPasswordSubtitle")}
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.emailAddress")}</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} autoFocus className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      {t("auth.lookingUpAccount")}
                    </div>
                  ) : t("auth.continue")}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                {t("auth.rememberPassword")}{" "}
                <Link to="/login" className="font-medium text-gray-900 dark:text-white hover:underline transition-colors">{t("auth.signIn")}</Link>
              </p>
            </div>
          )}

          {/* Step 2: Answer security question */}
          {step === "question" && (
            <div className="mt-8">
              <div className="w-14 h-14 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t("auth.securityQuestion")}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 text-sm sm:text-base">
                {t("auth.securityQuestionStepDesc")}
              </p>

              <div className="mb-6 p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t("auth.yourQuestion")}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{securityQuestion}</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.yourAnswer")}</label>
                  <input id="answer" type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={t("auth.typeAnswer")} autoFocus className={inputClass("answer")} />
                  {errors.answer && <p className="text-xs text-red-500 mt-1">{errors.answer}</p>}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.newPassword")}</label>
                  <div className="relative">
                    <input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("auth.enterNewPassword")} className={`${inputClass("newPassword")} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      {t("auth.resetting")}
                    </div>
                  ) : t("auth.resetPassword")}
                </button>
              </form>

              <button onClick={() => { setStep("email"); setSecurityQuestion(null); setAnswer(""); setNewPassword(""); setErrors({}); }} className="mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                &larr; {t("auth.backToEmail")}
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="mt-8">
              <div className="w-14 h-14 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t("auth.passwordResetComplete")}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {t("auth.passwordResetCompleteDesc")}
              </p>
              <button onClick={() => navigate("/login")} className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm cursor-pointer">
                {t("auth.backToSignIn")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
