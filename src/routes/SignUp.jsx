import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Eye, EyeOff, Check } from "lucide-react";
import { registerUser, registerOwner } from "../lib/auth";
import { useAuth } from "../context/AuthContext";
import TermsModal from "../components/TermsModal";

export default function SignUp() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'terms', 'privacy', or null
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [formData, setFormData] = useState({
    accountType: type || "user",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    businessName: "",
    businessType: "",
    businessAddress: "",
  });

  useEffect(() => {
    if (type) {
      setFormData((prev) => ({ ...prev, accountType: type }));
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "accountType") {
      navigate(`/signup/${value}`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the Terms of Use and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      if (isOwner) {
        const data = await registerOwner({
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          phone: formData.contactNumber,
        });

        if (data.token) {
          login({ ...data.owner, role: "owner" });
          navigate("/owner");
        } else {
          setRegistrationSuccess(true);
        }
      } else {
        const data = await registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.contactNumber,
        });
        login({ ...data.user, role: "user" });
        navigate("/");
      }
    } catch (err) {
      setError(err.data?.error || "Registration failed. Please try again.");
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
      {/* Terms Modal */}
      <TermsModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        type={activeModal}
      />
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Left Side - Branding/Welcome */}
        <div
          className={`w-full md:w-5/12 p-12 flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
            isOwner ? "bg-[#4F46E5]" : "bg-[#FCD34D]"
          }`}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
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
              Welcome to JunkHub!
            </h1>
            <p
              className={`text-lg font-medium leading-relaxed ${
                isOwner ? "text-indigo-100" : "text-gray-800"
              }`}
            >
              To keep connected with us please sign up with your personal
              information and start your journey.
            </p>
          </div>
          <div className="h-4"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="max-w-xl w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {registrationSuccess
                  ? "Registration Successful"
                  : "Create Account"}
              </h2>
              <p className="text-gray-500 mt-2">
                {registrationSuccess
                  ? "Your application is now pending admin review."
                  : "Join us directly to manage or request services"}
              </p>
            </div>

            {registrationSuccess ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={40} strokeWidth={3} />
                </div>
                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-left">
                  <h3 className="font-bold text-indigo-900 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-indigo-800 space-y-3">
                    <li className="flex gap-2">
                      <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      Our administrators will review your business information.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      You will receive an email once your account is approved.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      After approval, you can log in to your owner dashboard.
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all"
                >
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

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

                <form className="space-y-6" onSubmit={handleSubmit}>
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
                        required={!isOwner}
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
                        required={!isOwner}
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

                  {isOwner && (
                    <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                          <Building2 size={18} />
                          Business Information
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 block">
                              Business Name
                            </label>
                            <input
                              type="text"
                              name="businessName"
                              value={formData.businessName || ""}
                              onChange={handleChange}
                              placeholder="ex. Quick Junk Removal Services"
                              className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-white focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                              required={isOwner}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 block">
                              Business Address
                            </label>
                            <input
                              type="text"
                              name="businessAddress"
                              value={formData.businessAddress || ""}
                              onChange={handleChange}
                              placeholder="ex. 123 Main St, City, Province"
                              className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-white focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                              required={isOwner}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="MIN 6 chars"
                          className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repeat password"
                          className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all bg-gray-50 focus:bg-white ${borderColor} focus:ring-2 ${ringColor}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className={`w-4 h-4 border border-gray-300 rounded focus:ring-3 ${
                          isOwner
                            ? "text-[#4F46E5] focus:ring-[#4F46E5]/30"
                            : "text-[#FCD34D] focus:ring-[#FCD34D]/30"
                        }`}
                      />
                    </div>
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      By creating an account, you agree to our{" "}
                      <button
                        type="button"
                        onClick={() => setActiveModal("terms")}
                        className={`font-semibold hover:underline ${
                          isOwner ? "text-[#4F46E5]" : "text-[#D97706]"
                        }`}
                      >
                        Terms of Use
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setActiveModal("privacy")}
                        className={`font-semibold hover:underline ${
                          isOwner ? "text-[#4F46E5]" : "text-[#D97706]"
                        }`}
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 mt-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${buttonBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? "SIGNING UP..." : "SIGN UP"}
                  </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    to={isOwner ? "/login/owner" : "/login/user"}
                    className={`font-bold hover:underline ${
                      isOwner ? "text-[#4F46E5]" : "text-[#D97706]"
                    }`}
                  >
                    Login here
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
