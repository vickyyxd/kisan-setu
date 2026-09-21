import React from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { SmartAlertBanner } from '../components/queue/SmartAlertBanner';
import { 
  Users, 
  Clock, 
  Ticket, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveQueuePage: React.FC = () => {
  const { 
    myBooking, 
    nowServing, 
    centre, 
    waitingList, 
    activeList, 
    advanceQueue, 
    isLoading 
  } = useQueue();
  const { language, t } = useLanguage();

  const token = myBooking?.token || "A127";
  const position = myBooking?.queuePosition ?? 8;
  const ahead = myBooking?.farmersAhead ?? 7;
  const estimatedWaitMin = ahead * 5;
  const turn = myBooking?.estimatedTurn || "11:40 AM";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-green-700">
              Live Mandi Queue Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t.queue} • {centre?.name || "Pauri Procurement Centre"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' 
              ? 'वास्तविक समय में कतार स्थिति, काउंटर प्रगति एवं अपनी बारी का सटीक समय देखें।' 
              : 'Deterministic, real-time yard queue tracking with proximity trigger alerts.'}
          </p>
        </div>

        <button
          onClick={() => advanceQueue()}
          disabled={isLoading}
          className="btn-primary text-xs py-2.5 px-4 font-bold shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{t.refreshQueue} ({position < 10 ? `0${position}` : position} → {position > 1 ? (position - 1 < 10 ? `0${position - 1}` : position - 1) : 'Counter'})</span>
        </button>
      </div>

      {/* Smart Alerts */}
      <SmartAlertBanner />

      {/* Main Queue Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Now Serving */}
        <div className="card-surface p-5 bg-agri-900 text-white flex flex-col justify-between">
          <span className="text-xs text-agri-300 font-bold uppercase tracking-wider">
            {t.nowServing}
          </span>
          <p className="text-4xl font-black font-mono my-2 text-agri-200">
            {nowServing}
          </p>
          <span className="text-[11px] text-agri-400">
            Counter 1 (Weighbridge)
          </span>
        </div>

        {/* Your Token */}
        <div className="card-surface p-5 border-2 border-agri-300 bg-agri-50/50 flex flex-col justify-between">
          <span className="text-xs text-agri-800 font-bold uppercase tracking-wider">
            Your Token
          </span>
          <p className="text-4xl font-black font-mono my-2 text-agri-900">
            {token}
          </p>
          <span className="text-[11px] text-agri-700 font-medium">
            Vicky Kumar (Wheat)
          </span>
        </div>

        {/* Current Position */}
        <div className="card-surface p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {t.queuePosition}
          </span>
          <p className="text-4xl font-black font-mono my-2 text-slate-900">
            {position < 10 ? `0${position}` : position}
          </p>
          <span className="text-[11px] text-slate-400">
            {position === 1 ? '🎯 Proceed to Counter' : `Target: Counter 2`}
          </span>
        </div>

        {/* Farmers Ahead */}
        <div className="card-surface p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {t.farmersAhead}
          </span>
          <p className="text-4xl font-black font-mono my-2 text-slate-900">
            {ahead < 10 ? `0${ahead}` : ahead}
          </p>
          <span className="text-[11px] text-slate-400">
            In yard queue
          </span>
        </div>

        {/* Estimated Wait */}
        <div className="card-surface p-5 bg-amber-50/60 border-amber-200 flex flex-col justify-between">
          <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">
            {t.estimatedWaitTime}
          </span>
          <p className="text-3xl font-black font-mono my-2 text-amber-900">
            {estimatedWaitMin} <span className="text-sm font-bold text-amber-700">{t.minutes}</span>
          </p>
          <span className="text-[11px] text-amber-800 font-medium">
            Est. Turn: {turn}
          </span>
        </div>
      </div>

      {/* Queue Visualization: Live Tokens in Line */}
      <div className="card-surface p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-agri-700" />
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'hi' ? 'यार्ड में क्रमवार कतार स्थिति' : 'Live Yard Token Sequence'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {waitingList.length + 2} farmers in queue today
          </span>
        </div>

        {/* Horizontal Visual Queue Track */}
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center space-x-3 min-w-max py-2">
            {/* Active Counter Tokens */}
            <div className="p-3.5 rounded-xl bg-green-50 border-2 border-green-500 flex flex-col items-center justify-center min-w-28 shadow-sm">
              <span className="text-[10px] font-black uppercase text-green-700">Counter 1</span>
              <span className="text-xl font-black font-mono text-green-950 mt-0.5">{nowServing}</span>
              <span className="text-[10px] text-green-800 font-bold mt-1">Weighing</span>
            </div>

            <span className="text-slate-400 text-lg">←</span>

            {/* Waiting Sequence */}
            {['A120', 'A121', 'A122', 'A123', 'A124', 'A125', 'A126', 'A127'].map((tok, idx) => {
              const isVicky = tok === token;
              const posNum = idx + 2; // relative to now serving
              return (
                <div
                  key={tok}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center min-w-24 transition-all ${
                    isVicky
                      ? 'bg-agri-600 text-white border-agri-700 shadow-md ring-4 ring-agri-200'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isVicky ? 'text-agri-100' : 'text-slate-400'}`}>
                    Pos {position}
                  </span>
                  <span className="text-lg font-black font-mono mt-0.5">{tok}</span>
                  <span className={`text-[10px] font-medium mt-0.5 ${isVicky ? 'text-white font-bold' : 'text-slate-500'}`}>
                    {isVicky ? '★ YOU' : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* If position is 1, Show Call to Counter Card */}
        {position === 1 && (
          <div className="p-4 bg-green-50 border border-green-300 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-green-950 text-sm sm:text-base">
                  {language === 'hi' ? '🎯 आपकी बारी आ गई है! काउंटर 2 पर जाएं' : '🎯 Your Turn is NOW! Proceed to Counter 2'}
                </h4>
                <p className="text-xs text-green-800">
                  {language === 'hi' 
                    ? 'कृपया अपने ट्रैक्टर के साथ तौल कांटे पर उपस्थित हों।' 
                    : 'Weighbridge 2 is waiting for Token A127.'}
                </p>
              </div>
            </div>

            <Link
              to="/procurement"
              className="btn-primary text-xs bg-green-700 hover:bg-green-800"
            >
              <span>{language === 'hi' ? 'तौल शुरू करें' : 'Open Weighbridge'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Explanatory Demo Box */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>
            {language === 'hi'
              ? 'डेमो गाइड: "कतार रिफ्रेश करें" पर क्लिक करें। टोकन 08 से 07, 06 होते हुए 01 तक जाएगा और स्मार्ट अलर्ट सक्रिय होंगे।'
              : 'Demo Guide: Click "Refresh Queue" to advance Vicky\'s token step-by-step from 08 down to 01.'}
          </span>
        </div>
      </div>
    </div>
  );
};
