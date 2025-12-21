import { User, Building2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Yellow Section */}
        <div className="w-full md:w-5/12 bg-[#FCD34D] p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Background Circles */}
          {/* Decorative Background Circles - Enhanced for Edge Design */}
          {/* Top Right Edge */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-[-60px] w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>

          {/* Bottom Left Edge */}
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 left-[-40px] w-56 h-56 bg-white/25 rounded-full blur-2xl pointer-events-none"></div>

          {/* Center/Mid Accents */}
          <div className="absolute top-[40%] left-[10%] w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Logo Area */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="JunkHUB Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Junk<span className="font-extrabold">HUB</span>
            </span>
          </div>

          {/* Hero Text */}
          <div className="relative z-10 mt-12 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Hello!
            </h1>
            <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed max-w-sm">
              Select your account type to access your personalized dashboard and
              manage your junk removal services.
            </p>
          </div>

          {/* Bottom Spacer/Element */}
          <div className="h-10"></div>
        </div>

        {/* Right Side - Selection Section */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-3 text-center text-gray-900">
              Continue as:
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Select your account type to proceed
            </p>

            <div className="space-y-5">
              {/* User Option */}
              <button
                onClick={() => navigate("/login/user")}
                className="w-full p-4 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition-all duration-200 text-left bg-white group hover:border-[#FCD34D] hover:shadow-md hover:bg-yellow-50"
              >
                <div className="p-3 rounded-full bg-[#FCD34D] text-gray-900 group-hover:scale-105 transition-transform duration-200">
                  <User size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">User</h3>
                  <p className="text-sm text-gray-500">
                    I need junk removal services
                  </p>
                </div>
              </button>

              {/* Owner Option */}
              <button
                onClick={() => navigate("/login/owner")}
                className="w-full p-4 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition-all duration-200 text-left bg-white group hover:border-[#4F46E5] hover:shadow-md hover:bg-indigo-50"
              >
                <div className="p-3 rounded-full bg-[#4F46E5] text-white group-hover:scale-105 transition-transform duration-200">
                  <Building2 size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Owner</h3>
                  <p className="text-sm text-gray-500">
                    I provide junk removal services
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-12 text-center text-sm font-medium flex flex-col gap-2">
              <div>
                <span className="text-gray-400">
                  Not sure which to choose?{" "}
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#4F46E5] hover:underline hover:text-[#4338ca] bg-transparent border-none cursor-pointer"
                >
                  Learn about account types
                </button>
              </div>

              <button
                onClick={() => navigate("/about")}
                className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold mt-2 underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4"
              >
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Account Types */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Account Types</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* User Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-[#FCD34D]">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    User Account
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Designed for individuals or businesses looking to remove
                    junk. Create listings, browse service providers, and get
                    your space cleared out efficiently.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 w-full"></div>

              {/* Owner Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#4F46E5]">
                    <Building2 size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Owner Account
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    For junk removal businesses and independent contractors.
                    Manage your profile, find leads, and grow your junk removal
                    business on our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
