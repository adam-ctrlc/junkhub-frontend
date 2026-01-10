import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../lib/api";

export default function ForgotPassword() {
  const { type } = useParams(); // 'user' or 'owner'
  const navigate = useNavigate();

  // Step state: 'verify' or 'reset'
  const [step, setStep] = useState("verify");

  // State for the form
  const [formData, setFormData] = useState({
    accountType: type || "user",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });

  // Reset password form
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update accountType if URL param changes
  useEffect(() => {
    if (type) {
      setFormData((prev) => ({ ...prev, accountType: type }));
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

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

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password/verify", {
        accountType: formData.accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        email: formData.email,
      });

      if (response.success) {
        setVerificationToken(response.verificationToken);
        setStep("reset");
        setSuccess("Account verified! Please set your new password.");
      }
    } catch (err) {
      setError(
        err.message || "Verification failed. Please check your information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (resetData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password/reset", {
        accountType: formData.accountType,
        email: formData.email,
        verificationToken,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });

      if (response.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate(
            formData.accountType === "owner" ? "/login/owner" : "/login/user"
          );
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = formData.accountType === "owner";
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
              {step === "verify" ? "Forgot Password?" : "Reset Password"}
            </h1>
            <p
              className={`text-lg font-medium leading-relaxed ${
                isOwner ? "text-indigo-100" : "text-gray-800"
              }`}
            >
              {step === "verify"
                ? "Don't worry! Enter your personal details below to verify your identity and reset your password."
                : "Create a new password for your account. Make sure it's strong and secure."}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${
                  isOwner ? "text-white" : "text-gray-900"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === "verify"
                      ? isOwner
                        ? "bg-white text-indigo-600"
                        : "bg-gray-900 text-yellow-400"
                      : isOwner
                      ? "bg-white/30"
                      : "bg-white/60"
                  }`}
                >
                  {step === "reset" ? <Check size={16} /> : "1"}
                </div>
                <span className="font-medium">Verify</span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  isOwner ? "bg-white/40" : "bg-gray-900/30"
                }`}
              ></div>
              <div
                className={`flex items-center gap-2 ${
                  isOwner ? "text-white" : "text-gray-900"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === "reset"
                      ? isOwner
                        ? "bg-white text-indigo-600"
                        : "bg-gray-900 text-yellow-400"
                      : isOwner
                      ? "bg-white/30"
                      : "bg-white/60"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Reset</span>
              </div>
            </div>
          </div>
          <div className="h-4"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none flex flex-col justify-center">
          <div className="max-w-xl w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {step === "verify"
                  ? "Account Verification"
                  : "Create New Password"}
              </h2>
              <p className="text-gray-500 mt-2">
                {step === "verify"
                  ? "Please provide your details to continue"
                  : "Enter your new password below"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {step === "verify" ? (
              <>
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

                <form className="space-y-6" onSubmit={handleVerify}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">
                        {isOwner ? "Business Name (First Part)" : "First Name"}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={isOwner ? "ex. Green" : "ex. John"}
                        className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">
                        {isOwner ? "Business Name (Second Part)" : "Last Name"}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={isOwner ? "ex. Recycling" : "ex. Doe"}
                        className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                        required
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
                      required
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
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 mt-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${buttonBg} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2`}
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? "VERIFYING..." : "VERIFY ACCOUNT"}
                  </button>
                </form>
              </>
            ) : (
              /* Reset Password Form */
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={resetData.newPassword}
                      onChange={handleResetChange}
                      placeholder="Enter new password"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={resetData.confirmPassword}
                      onChange={handleResetChange}
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 mt-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${buttonBg} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2`}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "RESETTING..." : "RESET PASSWORD"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("verify");
                    setError("");
                    setSuccess("");
                    setVerificationToken("");
                    setResetData({ newPassword: "", confirmPassword: "" });
                  }}
                  className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to verification
                </button>
              </form>
            )}

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
