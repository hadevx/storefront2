import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Layout from "../../Layout";
import { useRegisterUserMutation } from "../../redux/queries/userApi";
import { registerUserSchema } from "../../schema/userSchema";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ language from redux
  const language = useSelector((state) => state.language.lang);

  const t =
    language === "ar"
      ? {
          title: "إنشاء حساب",
          subtitle: "لن يستغرق الأمر سوى دقيقة",
          name: "الاسم",
          namePlaceholder: "اسمك",
          email: "البريد الإلكتروني",
          emailPlaceholder: "you@example.com",
          phone: "رقم الهاتف",
          phonePlaceholder: "XXXXXXXX",
          password: "كلمة المرور",
          confirmPassword: "تأكيد كلمة المرور",
          passwordPlaceholder: "••••••••",
          hidePassword: "إخفاء كلمة المرور",
          showPassword: "إظهار كلمة المرور",
          register: "تسجيل",
          already: "لديك حساب بالفعل؟",
          signIn: "تسجيل الدخول",
          passwordsNoMatch: "كلمتا المرور غير متطابقتين",
          genericError: "حدث خطأ ما",
        }
      : {
          title: "Create account",
          subtitle: "It only takes a minute",
          name: "Name",
          namePlaceholder: "Your name",
          email: "Email",
          emailPlaceholder: "you@example.com",
          phone: "Phone",
          phonePlaceholder: "XXXXXXXX",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordPlaceholder: "••••••••",
          hidePassword: "Hide password",
          showPassword: "Show password",
          register: "Register",
          already: "Already have an account?",
          signIn: "Sign in",
          passwordsNoMatch: "Passwords do not match",
          genericError: "An error occurred",
        };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, phone, email, password, confirmPassword } = form;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const result = registerUserSchema.safeParse({ name, email, phone, password });
    if (!result.success) return toast.error(result.error.issues[0].message);

    if (password !== confirmPassword) {
      return toast.error(t.passwordsNoMatch, { position: "top-center" });
    }

    try {
      const res = await registerUser({ name, email, phone, password, confirmPassword }).unwrap();
      dispatch(setUserInfo({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || t.genericError, {
        position: "top-center",
      });
    }
  };

  return (
    <Layout>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="min-h-[calc(100vh-64px)] flex py-40 items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">{t.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t.subtitle}</p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-700">{t.name}</label>
              <input
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border bg-zinc-50 px-3 outline-none
                  focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">{t.email}</label>
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border bg-zinc-50 px-3 outline-none
                  focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">{t.phone}</label>
              <div className="flex gap-2">
                <div className="h-11 w-[84px] rounded-xl border bg-zinc-50 flex items-center justify-center text-sm font-semibold text-zinc-700">
                  +965
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  className="h-11 w-full rounded-xl border bg-zinc-50 px-3 outline-none
                    focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border bg-zinc-50 px-3 pr-11 outline-none
                    focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-zinc-500 hover:text-zinc-900"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}>
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">{t.confirmPassword}</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t.passwordPlaceholder}
                value={confirmPassword}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border bg-zinc-50 px-3 outline-none
                  focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full rounded-xl bg-zinc-900 text-white font-semibold
                hover:bg-zinc-800 disabled:opacity-70 flex items-center justify-center">
              {!isLoading ? t.register : <Spinner className="border-t-zinc-900" />}
            </button>
          </form>

          <p className="mt-5 text-sm text-zinc-600">
            {t.already}{" "}
            <Link to="/login" className="font-semibold underline underline-offset-4">
              {t.signIn}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Register;
