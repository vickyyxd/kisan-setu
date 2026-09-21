import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, AlertTriangle, CheckCircle, Navigation, X } from 'lucide-react';

export const SmartAlertBanner: React.FC = () => {
  const { activeAlert, clearActiveAlert, myBooking } = useQueue();
  const { language, t } = useLanguage();

  if (!activeAlert || !myBooking) return null;

  const ahead = myBooking.farmersAhead;
  const pos = myBooking.queuePosition;

  let bgClass = "bg-blue-50 border-blue-200 text-blue-900";
  let icon = <Bell className="w-5 h-5 text-blue-600 shrink-0" />;

  if (ahead === 2) {
    bgClass = "bg-amber-50 border-amber-300 text-amber-950";
    icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 animate-bounce" />;
  } else if (pos === 1) {
    bgClass = "bg-green-50 border-green-300 text-green-950 ring-2 ring-green-400";
    icon = <Navigation className="w-5 h-5 text-green-700 shrink-0 animate-pulse" />;
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm mb-6 flex items-start justify-between ${bgClass}`}>
      <div className="flex items-start space-x-3">
        {icon}
        <div>
          <h4 className="font-bold text-sm sm:text-base">
            {language === 'hi' 
              ? (pos === 1 ? t.alertTurnNowTitle : ahead === 2 ? t.alert2AheadTitle : t.alert5AheadTitle)
              : activeAlert.title}
          </h4>
          <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed">
            {language === 'hi' 
              ? (pos === 1 ? t.alertTurnNowMsg : ahead === 2 ? t.alert2AheadMsg : t.alert5AheadMsg)
              : activeAlert.message}
          </p>
        </div>
      </div>

      <button
        onClick={clearActiveAlert}
        className="text-slate-400 hover:text-slate-700 p-1"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
