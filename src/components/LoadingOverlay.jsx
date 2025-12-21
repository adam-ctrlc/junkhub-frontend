import { Loader2 } from "lucide-react";

/**
 * LoadingOverlay Component
 * Use this for full-screen or container-overlay loading states.
 *
 * @param {boolean} isLoading - Controls visibility of the overlay.
 * @param {string} text - Optional text to display below the spinner (default: "Loading...").
 * @param {boolean} fullScreen - If true, covers the entire viewport. If false, covers the parent container (parent must be relative).
 */
export default function LoadingOverlay({
  isLoading,
  text = "Loading...",
  fullScreen = false,
}) {
  if (!isLoading) return null;

  return (
    <div
      className={`
        flex flex-col items-center justify-center 
        bg-white/80 backdrop-blur-sm z-50 transition-opacity duration-300
        ${fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-lg"}
      `}
    >
      <Loader2
        className="text-[#FCD34D] animate-spin mb-3"
        size={48}
        strokeWidth={2.5}
      />
      <p className="text-gray-600 font-semibold text-sm animate-pulse">
        {text}
      </p>
    </div>
  );
}

/**
 * ButtonLoader Component
 * Use this inside buttons to toggle between button text and a loading state.
 *
 * @param {boolean} isLoading - If true, shows spinner and text. If false, shows children.
 * @param {string} text - The text to show while loading (e.g. "Sending...").
 * @param {React.ReactNode} children - The normal button content.
 */
export function ButtonLoader({ isLoading, text = "Loading...", children }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={18} />
        <span>{text}</span>
      </div>
    );
  }
  return children;
}
