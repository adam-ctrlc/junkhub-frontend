import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginOwner } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export default function OwnerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginOwner(email, password);
      login({ ...data.owner, role: "owner" });
      navigate("/owner");
    } catch (err) {
      setError(err.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Indigo Section */}
        <div className="w-full md:w-5/12 bg-[#4F46E5] p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 left-8 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Decorative Background Circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-[-60px] w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 left-[-40px] w-56 h-56 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>

          {/* Logo Area */}
          <div className="relative z-10 flex items-center gap-3 mt-12">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
              <img
                src="/favicon.png"
                alt="JunkHUB Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Junk<span className="font-extrabold">HUB</span>
            </span>
          </div>

          {/* Text Content */}
          <div className="relative z-10 mt-8">
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-lg text-indigo-100 font-medium leading-relaxed">
              Log in to your business dashboard to manage leads, update your
              profile, and grow your reach.
            </p>
          </div>

          <div className="h-4"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Owner Login
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password/owner"
                  className="font-semibold text-[#4F46E5] hover:text-[#4338ca] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup/owner"
                className="text-[#4F46E5] font-bold hover:underline"
              >
                Register your business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
