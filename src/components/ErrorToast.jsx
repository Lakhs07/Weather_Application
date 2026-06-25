// src/components/ErrorToast.jsx
// Auto-dismissing error notification.

import { useEffect } from "react";

const ErrorToast = ({ message, onDismiss }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="animate-fade-in flex items-start gap-3 glass-dark border border-red-400/30 rounded-xl px-4 py-3 mb-4 text-sm text-white"
    >
      <span aria-hidden="true" className="text-red-400 text-base mt-px">⚠️</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="text-white/40 hover:text-white transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorToast;
