import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/queries/userApi";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Layout from "../../Layout";
import { loginUserSchema } from "../../schema/userSchema";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });

  const { email, password } = form;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  // Generic onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        return toast.error("All fields are required", { position: "top-center" });
      }
      const result = loginUserSchema.safeParse({ email, password });
      if (!result.success) {
        return toast.error(result.error.issues[0].message);
      }

      const res = await loginUser({ email, password }).unwrap();
      dispatch(setUserInfo({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "an error occurred", {
        position: "top-center",
      });
    }
  };
  return (
    <>
      <Layout>
        <div className=" flex mt-[-100px] flex-col items-center justify-center min-h-screen text-black">
          <div>
            <h1 className="mb-5 text-[20px] font-semibold">Login </h1>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className=" h-[40px] bg-opacity-50 w-[300px] rounded-md   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={handleChange}
                  className=" w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
              </div>
              <div className="rounded-md border relative  h-[40px]  w-[300px]   bg-gray-100  placeholder:text-grey-40  flex items-center mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full shadow rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4 outline-none outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
                <button
                  type="button"
                  className="text-grey-40 absolute right-0 focus:text-violet-60 px-4 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye strokeWidth={1} />
                  ) : (
                    <span>
                      <EyeOff strokeWidth={1} />
                    </span>
                  )}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full mt-4 border rounded-lg font-semibold flex items-center justify-center  px-3 py-2  transition-all delay-50 bg-gradient-to-r from-slate-800 to-slate-600 shadow-md text-white hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-900">
                  {!isLoading ? "Log in" : <Spinner className="border-t-slate-700" />}
                </button>
              </div>
            </form>
            <div className="mt-5">
              <span> Don't have an account? </span>
              <Link to="/register" className="font-bold underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Login;
