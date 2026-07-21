import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loginAnimation from "../assets/Animations/Login Character Animation.json";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

const SECURITY_QUESTION_KEYS = [
  "auth.sq1",
  "auth.sq2",
  "auth.sq3",
  "auth.sq4",
  "auth.sq5",
  "auth.sq6",
  "auth.sq7",
  "auth.sq8",
];

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = t("common.nameRequired");
    if (!email) errs.email = t("common.emailRequired");
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = t("common.invalidEmail");
    if (!password) errs.password = t("common.passwordRequired");
    else if (password.length < 6) errs.password = t("common.passwordMinLength");
    if (!confirmPassword) errs.confirmPassword = t("auth.confirmPasswordRequired");
    else if (password !== confirmPassword) errs.confirmPassword = t("auth.passwordsDoNotMatch");
    if (!securityQuestion) errs.securityQuestion = t("auth.selectSecurityQuestion");
    if (!securityAnswer.trim()) errs.securityAnswer = t("auth.answerRequired");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await signup(name, email, password, phone, securityQuestion, securityAnswer);
      toast.success(t("auth.accountCreated"));
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score: 1, label: t("auth.weak"), color: "bg-red-500" };
    if (score <= 3) return { score: 2, label: t("auth.fair"), color: "bg-amber-500" };
    return { score: 3, label: t("auth.strong"), color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();
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

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t("auth.createAccountHeading")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">{t("auth.createAccountSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.fullName")}</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.fullNamePlaceholder")} className={inputClass("name")} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.emailAddress")}</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} className={inputClass("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.phone")}</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("auth.phonePlaceholder")}
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 shadow-sm dark:shadow-white/5" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("common.password")}</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.createPassword")} className={`${inputClass("password")} pr-12`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-gray-200 dark:bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{t("auth.passwordStrength")} {strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.confirmPassword")}</label>
              <input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("auth.reenterPassword")} className={inputClass("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Security Question */}
            <div className="pt-2 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t("auth.securityQuestion")}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t("auth.securityQuestionDesc")}</p>

              <div>
                <label htmlFor="securityQuestion" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.question")}</label>
                <div className="relative">
                  <select
                    id="securityQuestion"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className={`w-full px-4 py-3 pr-10 bg-white dark:bg-white/5 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm dark:shadow-white/5 appearance-none cursor-pointer ${errors.securityQuestion ? "border-red-400 focus:ring-red-500" : "border-gray-300 dark:border-white/10 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"}`}
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t("auth.selectQuestion")}</option>
                    {SECURITY_QUESTION_KEYS.map((key) => (
                      <option key={key} value={key} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t(key)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                {errors.securityQuestion && <p className="text-xs text-red-500 mt-1">{errors.securityQuestion}</p>}
              </div>

              <div className="mt-3">
                <label htmlFor="securityAnswer" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.yourAnswer")}</label>
                <input id="securityAnswer" type="text" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} placeholder={t("auth.typeAnswer")} className={inputClass("securityAnswer")} />
                {errors.securityAnswer && <p className="text-xs text-red-500 mt-1">{errors.securityAnswer}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:ring-gray-900 dark:focus:ring-white" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("auth.agreeTo")} <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">{t("auth.termsOfService")}</a> {t("auth.and")} <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">{t("auth.privacyPolicy")}</a>
              </span>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  {t("auth.creatingAccount")}
                </div>
              ) : t("auth.createAccount")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link to="/login" className="font-medium text-gray-900 dark:text-white hover:underline transition-colors">{t("auth.signIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
