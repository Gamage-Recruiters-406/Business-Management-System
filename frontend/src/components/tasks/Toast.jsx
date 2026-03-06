import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({
  message,
  subMessage,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-start gap-3 bg-slate-900 text-white px-4 py-3.5 rounded-xl shadow-lg max-w-xs animate-fade-in-up">
      <div className="shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
        <CheckCircle2 className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{message}</p>
        {subMessage && (
          <p className="text-xs text-slate-400 mt-0.5">{subMessage}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-white transition-colors ml-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
