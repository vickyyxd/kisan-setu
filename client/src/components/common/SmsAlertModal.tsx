import React from 'react';
import { useOffline } from '../../context/OfflineContext';
import { useQueue } from '../../context/QueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { Smartphone, X, CheckCheck, MessageSquareText } from 'lucide-react';

export const SmsAlertModal: React.FC = () => {
  const { showSmsModal, setShowSmsModal, cachedQueue } = useOffline();
  const { myBooking } = useQueue();
  const { language } = useLanguage();

  if (!showSmsModal) return null;

  const token = myBooking?.token || cachedQueue.token;
  const position = myBooking?.queuePosition ?? cachedQueue.position;
  const estimatedTurn = myBooking?.estimatedTurn || cachedQueue.estimatedTurn;
  const centre = myBooking?.centreName || cachedQueue.centreName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-modal max-w-sm w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm">
              {language === 'hi' ? 'ग्रामीण एसएमएस फॉलबैक सिमुलेशन' : 'Rural SMS Fallback Simulation'}
            </h3>
          </div>
          <button
            onClick={() => setShowSmsModal(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Feature Phone / Smartphone SMS Bubble */}
        <div className="p-5 bg-slate-50">
          <p className="text-[11px] text-slate-500 mb-3 text-center">
            {language === 'hi' 
              ? 'बिना इंटरनेट के भी किसानों को बुनियादी फोन पर सीधा एसएमएस अलर्ट प्राप्त होता है:' 
              : 'Farmers receive this SMS alert directly on basic keypad phones even with zero internet:'}
          </p>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-100 pb-2">
              <span className="font-semibold text-agri-800">Govt of Uttarakhand • MANDI-ALERT</span>
              <span>11:15 AM</span>
            </div>

            <div className="space-y-1.5 text-slate-800 text-sm">
              <p className="font-bold text-agri-900">🌾 KISAN SETU SMS ALERT</p>
              <p>TOKEN: <strong className="text-agri-700 font-black">{token}</strong></p>
              <p>QUEUE POSITION: <strong>0{position}</strong></p>
              <p>FARMERS AHEAD: <strong>0{Math.max(0, position - 1)}</strong></p>
              <p>EST. TURN: <strong>{estimatedTurn}</strong></p>
              <p className="text-xs text-slate-600 pt-1">CENTRE: {centre}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between items-center">
              <span>Delivery Status: DELIVERED</span>
              <CheckCheck className="w-3.5 h-3.5 text-green-600" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowSmsModal(false)}
              className="btn-primary text-xs w-full"
            >
              {language === 'hi' ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
