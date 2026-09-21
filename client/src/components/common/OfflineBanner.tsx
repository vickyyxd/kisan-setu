import React from 'react';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, MessageSquare, Clock } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline, lastSyncTime, triggerSmsAlert } = useOffline();
  const { language } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-5 h-5 text-slate-900 shrink-0 animate-bounce" />
          <span>
            <strong>
              {language === 'hi' ? 'सीमित नेटवर्क / ऑफलाइन मोड' : 'Limited Connectivity Mode'}:
            </strong>{' '}
            {language === 'hi' 
              ? 'आपकी कतार की अद्यतन जानकारी सुरक्षित ऑफलाइन उपलब्ध है।' 
              : 'Your latest queue information is available offline.'}
          </span>
          <span className="inline-flex items-center space-x-1 bg-amber-600/30 px-2 py-0.5 rounded text-xs font-mono text-slate-900">
            <Clock className="w-3 h-3" />
            <span>{language === 'hi' ? 'अंतिम अपडेट' : 'Last updated'}: {lastSyncTime}</span>
          </span>
        </div>

        <button
          onClick={() => triggerSmsAlert()}
          className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-3 py-1 rounded-md text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ऑफलाइन एसएमएस अलर्ट देखें' : 'View SMS Fallback Alert'}</span>
        </button>
      </div>
    </div>
  );
};
