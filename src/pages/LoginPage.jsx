import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../assets/Animations/Login Character Animation.json";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = t("common.emailRequired");
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = t("common.invalidEmail");
    if (!password) errs.password = t("common.passwordRequired");
    else if (password.length < 6) errs.password = t("common.passwordMinLength");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success(t("auth.welcomeToast"));
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 h-full overflow-hidden bg-white items-center justify-center shrink-0">
        <div className="w-[500px] h-[500px]">
          <DotLottieReact data={loginAnimation} className="w-full h-full" loop autoplay />
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto px-4 sm:px-6 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto">

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t("auth.welcomeBack")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t("auth.signInSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.emailAddress")}</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")}
                className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm dark:shadow-white/5 ${errors.email ? "border-red-400 focus:ring-red-500" : "border-gray-300 dark:border-white/10 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.password")}</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")}
                  className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm dark:shadow-white/5 pr-12 ${errors.password ? "border-red-400 focus:ring-red-500" : "border-gray-300 dark:border-white/10 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:ring-gray-900 dark:focus:ring-white" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t("auth.rememberMe")}</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-gray-900 dark:text-white hover:underline transition-colors">{t("auth.forgotPassword")}</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  {t("auth.signingIn")}
                </div>
              ) : t("auth.signIn")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="font-medium text-gray-900 dark:text-white hover:underline transition-colors">{t("auth.createAccount")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
