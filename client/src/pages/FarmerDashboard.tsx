import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { SmartAlertBanner } from '../components/queue/SmartAlertBanner';
import { 
  Ticket, 
  Clock, 
  Calendar, 
  Scale, 
  CreditCard, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Users, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { myBooking, centre, nowServing, advanceQueue, refreshAll, isLoading } = useQueue();
  const { language, t } = useLanguage();

  const token = myBooking?.token || "A127";
  const position = myBooking?.queuePosition ?? 8;
  const ahead = myBooking?.farmersAhead ?? 7;
  const turn = myBooking?.estimatedTurn || "11:40 AM";
  const status = myBooking?.status || "Slot Confirmed";
  const centreName = myBooking?.centreName || "Pauri Procurement Centre";

  // Calculate realistic queue progress bar (1 to 10 scale where 1 is 100% ready)
  const progressPercent = Math.max(10, Math.min(100, Math.round(((12 - position) / 12) * 100)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Greeting & Subheading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{t.greeting}, {user?.name || "Vicky Kumar"}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refreshAll()}
            disabled={isLoading}
            className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
            title="Refresh live queue status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? 'डेटा रीफ्रेश करें' : 'Refresh'}</span>
          </button>

          <Link to="/book" className="btn-primary text-xs py-2 px-3.5 font-bold shadow-xs">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>{t.bookSlot}</span>
          </Link>
        </div>
      </div>

      {/* Smart Proximity Alert Banner (Triggers automatically at 5 ahead, 2 ahead, 1 turn now) */}
      <SmartAlertBanner />

      {/* Hero Today's Procurement Card */}
      <div className="card-surface p-6 sm:p-8 bg-linear-to-br from-white via-white to-agri-50/40 border-2 border-agri-200/80 shadow-card relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-slate-200/80 gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-agri-100 text-agri-800 text-xs font-black px-2.5 py-1 rounded tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-agri-600" />
              <span>{t.todaysProcurement}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {centreName}
            </h2>
            <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Mandi Samiti Yard, Pauri Garhwal (12 km away)</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide bg-agri-600 text-white shadow-xs">
              ● {status}
            </span>
            <Link
              to="/token"
              className="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1 font-bold"
            >
              <Ticket className="w-3.5 h-3.5 text-agri-700" />
              <span>{language === 'hi' ? 'डिजिटल पास देखें' : 'View Pass'}</span>
            </Link>
          </div>
        </div>

        {/* 4 Big Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 border-b border-slate-200/80">
          {/* Token */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.token}
            </span>
            <p className="text-3xl sm:text-4xl font-black text-agri-800 font-mono mt-1">
              {token}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Crop: Wheat (गेहूं)
            </span>
          </div>

          {/* Queue Position */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.queuePosition}
            </span>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1">
              {position < 10 ? `0${position}` : position}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Now Serving: <strong className="font-mono text-agri-700">{nowServing}</strong>
            </span>
          </div>

          {/* Farmers Ahead */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.farmersAhead}
            </span>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1">
              {ahead < 10 ? `0${ahead}` : ahead}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              In Yard Waiting Area
            </span>
          </div>

          {/* Estimated Turn */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.estimatedTurn}
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-700 font-mono mt-1">
              {turn}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ~{ahead * 5} min remaining
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-600">
              {language === 'hi' ? 'आपकी बारी की प्रगति:' : 'Queue Turn Readiness:'}
            </span>
            <span className="text-agri-800 font-mono font-bold">
              {position === 1 ? '100% Ready (Proceed to Counter)' : `${progressPercent}% in Queue`}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-linear-to-r from-agri-600 to-agri-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Footers */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-agri-600 shrink-0" />
            <span>
              {language === 'hi'
                ? 'कतार में परिवर्तन होने पर आपको स्वतः एसएमएस एवं ऑन-स्क्रीन अलर्ट मिलेगा।'
                : 'Deterministic updates: You will receive notifications at 5-ahead, 2-ahead, and Turn Now.'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => advanceQueue()}
              disabled={isLoading}
              className="btn-primary text-xs py-2 px-3.5 bg-agri-700 hover:bg-agri-800"
              title="Test real queue advance"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t.refreshQueue} (08 → 07...)</span>
            </button>

            <Link
              to="/queue"
              className="btn-secondary text-xs py-2 px-3.5"
            >
              <span>{t.viewLiveQueue}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Quick Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Counter Lab */}
        <div className="card-surface p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-agri-100 text-agri-800 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'hi' ? 'मंडी तौल एवं लैब काउंटर' : 'Active Mandi Counters'}
              </h3>
              <p className="text-xs text-slate-500">Pauri Procurement Centre</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-medium text-slate-700">Weighbridge 1 (कांटा)</span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">
                Serving A119
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-medium text-slate-700">Quality Lab 2 (ग्रेडिंग)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                Testing A120
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-medium text-slate-700">Counter 3 (DBT Settlement)</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                Ready
              </span>
            </div>
          </div>

          <Link
            to="/procurement"
            className="mt-4 block text-center text-xs font-bold text-agri-700 hover:text-agri-900 pt-2 border-t border-slate-100"
          >
            {language === 'hi' ? 'तौल एवं ग्रेडिंग मॉड्यूल खोलें →' : 'Open Weighing & Grading Journey →'}
          </Link>
        </div>

        {/* DBT Payment Status */}
        <div className="card-surface p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {t.paymentStatus}
              </h3>
              <p className="text-xs text-slate-500">Direct Benefit Transfer</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount:</span>
              <span className="font-black text-slate-900 text-base font-mono">₹27,600</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-green-700">✓ Completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account:</span>
              <span className="font-mono text-slate-700">SBI •••• 4512</span>
            </div>
          </div>

          <Link
            to="/payment"
            className="mt-4 block text-center text-xs font-bold text-amber-700 hover:text-amber-900 pt-2 border-t border-slate-100"
          >
            {language === 'hi' ? 'पूर्ण भुगतान रसीद देखें →' : 'View DBT Payment Receipt →'}
          </Link>
        </div>

        {/* Quick Links & History */}
        <div className="card-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'hi' ? 'त्वरित सेवाएं' : 'Quick Actions'}
                </h3>
                <p className="text-xs text-slate-500">Farmer Services</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/history"
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <span>{language === 'hi' ? 'पिछला खरीद इतिहास' : 'Procurement History (4 records)'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/centres"
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <span>{language === 'hi' ? 'निकटवर्ती खरीद केंद्र खोजें' : 'Locate Procurement Centres'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/profile"
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors"
              >
                <span>{language === 'hi' ? 'किसान प्रोफाइल एवं बैंक विवरण' : 'Farmer Profile & Land Holding'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
