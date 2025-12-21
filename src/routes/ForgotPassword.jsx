import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Check } from "lucide-react";

export default function ForgotPassword() {
  const { type } = useParams(); // 'user' or 'owner'
  const navigate = useNavigate();

  // State for the form
  const [formData, setFormData] = useState({
    accountType: type || "user",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });

  // Update accountType if URL param changes
  useEffect(() => {
    if (type) {
      setFormData((prev) => ({ ...prev, accountType: type }));
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle account type change via radio buttons
    if (name === "accountType") {
      navigate(`/forgot-password/${value}`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isOwner = formData.accountType === "owner";
  const themeColor = isOwner ? "indigo" : "yellow";
  const activeColor = isOwner ? "#4F46E5" : "#FCD34D";
  const lightBg = isOwner ? "bg-indigo-50" : "bg-yellow-50";
  const borderColor = isOwner
    ? "focus:border-[#4F46E5]"
    : "focus:border-[#FCD34D]";
  const ringColor = isOwner
    ? "focus:ring-[#4F46E5]/20"
    : "focus:ring-[#FCD34D]/20";
  const buttonBg = "bg-gray-900 hover:bg-gray-800";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 font-sans ${lightBg} transition-colors duration-300`}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Branding/Info */}
        <div
          className={`w-full md:w-5/12 p-12 flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
            isOwner ? "bg-[#4F46E5]" : "bg-[#FCD34D]"
          }`}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(isOwner ? "/login/owner" : "/login/user")}
            className={`absolute top-8 left-8 z-20 p-2 rounded-full transition-colors ${
              isOwner
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-white/20 hover:bg-white/30 text-gray-900"
            }`}
          >
            <ArrowLeft size={24} />
          </button>

          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-[-60px] w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 left-[-40px] w-56 h-56 bg-white/25 rounded-full blur-2xl pointer-events-none"></div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3 mt-12">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center p-2 ${
                isOwner ? "bg-white/20" : "bg-white/40"
              }`}
            >
              <img
                src="/favicon.png"
                alt="JunkHUB Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                isOwner ? "text-white" : "text-gray-900"
              }`}
            >
              Junk<span className="font-extrabold">HUB</span>
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-8">
            <h1
              className={`text-4xl font-extrabold mb-4 tracking-tight ${
                isOwner ? "text-white" : "text-gray-900"
              }`}
            >
              Forgot Password?
            </h1>
            <p
              className={`text-lg font-medium leading-relaxed ${
                isOwner ? "text-indigo-100" : "text-gray-800"
              }`}
            >
              Don't worry! Enter your personal details below to verify your
              identity and reset your password.
            </p>
          </div>
          <div className="h-4"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none flex flex-col justify-center">
          <div className="max-w-xl w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Account Verification
              </h2>
              <p className="text-gray-500 mt-2">
                Please provide your details to continue
              </p>
            </div>

            {/* Account Type Selection */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              {/* User Type */}
              <label
                className={`relative cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                  !isOwner
                    ? `border-[${activeColor}] bg-yellow-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  checked={!isOwner}
                  onChange={handleChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                <div
                  className={`p-2 rounded-full ${
                    !isOwner
                      ? "bg-[#FCD34D] text-gray-900"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <User size={24} />
                </div>
                <span
                  className={`font-bold ${
                    !isOwner ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  User
                </span>
                {!isOwner && (
                  <div className="absolute top-2 right-2 text-[#FCD34D]">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </label>

              {/* Owner Type */}
              <label
                className={`relative cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                  isOwner
                    ? "border-[#4F46E5] bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="owner"
                  checked={isOwner}
                  onChange={handleChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                <div
                  className={`p-2 rounded-full ${
                    isOwner
                      ? "bg-[#4F46E5] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Building2 size={24} />
                </div>
                <span
                  className={`font-bold ${
                    isOwner ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Owner
                </span>
                {isOwner && (
                  <div className="absolute top-2 right-2 text-[#4F46E5]">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </label>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="ex. John"
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="ex. Doe"
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="ex. 09123456789"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ex. your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                />
              </div>

              <button
                className={`w-full py-4 mt-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${buttonBg}`}
              >
                VERIFY ACCOUNT
              </button>
            </form>

            <div className="mt-8 text-center text-gray-500 text-sm">
              Remember your password?{" "}
              <Link
                to={isOwner ? "/login/owner" : "/login/user"}
                className={`font-bold hover:underline ${
                  isOwner ? "text-[#4F46E5]" : "text-[#D97706]"
                }`}
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
