import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-[#F59E0B]" />
        </div>

        <h1 className="text-8xl font-black text-gray-900 mb-2 tracking-tighter">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-8 max-w-sm">
          Oops! It looks like this page has been tossed out. We couldn't find
          the junk you're looking for.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FCD34D] text-gray-900 font-bold rounded-xl hover:bg-[#FBBF24] transition-colors shadow-sm hover:shadow-md"
          >
            <Home size={20} />
            Dashboard
          </button>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        JunkHUB &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
