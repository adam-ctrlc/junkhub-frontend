import Modal from "./Modal";
import { AlertTriangle, Trash2, CheckCircle, Info } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) {
  const variants = {
    danger: {
      icon: Trash2,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      buttonText: "text-white",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      buttonText: "text-white",
    },
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      buttonText: "text-white",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}>
          <Icon size={32} className={config.iconColor} />
        </div>

        {/* Title */}
        {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}

        {/* Message */}
        {message && <p className="text-gray-600 leading-relaxed">{message}</p>}

        {/* Actions */}
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonBg} ${config.buttonText}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
