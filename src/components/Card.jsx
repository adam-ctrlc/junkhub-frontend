import { X, Star, MapPin } from "lucide-react";

export default function Card({
  type = "product", // 'product' | 'shop'
  image,
  title,
  subtitle,
  badges = [], // Array of strings or components
  details = [], // Array of { icon, text } or just strings
  actionButton, // { text, onClick, variant: 'primary' | 'secondary' }
  onRemove, // Optional remove handler for cross icon
  className = "",
}) {
  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden group bg-white relative ${className}`}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={16} />
        </button>
      )}

      {/* Image Area */}
      <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 font-medium group-hover:bg-gray-300 transition-colors text-4xl">
        {image}
      </div>

      {/* Content Area */}
      <div className="p-4 text-center">
        {/* Rating / Badges Area */}
        {badges.length > 0 && (
          <div className="flex justify-center gap-0.5 text-[#FCD34D] mb-2">
            {badges.map((badge, idx) => (
              <span key={idx}>{badge}</span>
            ))}
          </div>
        )}

        {/* Title & Subtitle */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
          {title}
        </h3>
        {subtitle && <div className="mb-2">{subtitle}</div>}

        {/* Details Lines */}
        {details.length > 0 && (
          <div className="space-y-1 mb-4">
            {details.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-1.5 text-xs text-gray-500"
              >
                {detail.icon && <span>{detail.icon}</span>}
                <span>{detail.text || detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {actionButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              actionButton.onClick && actionButton.onClick();
            }}
            className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${
              actionButton.variant === "secondary"
                ? "border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                : "bg-gray-50 text-gray-900 group-hover:bg-[#FCD34D]"
            }`}
          >
            {actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
}
