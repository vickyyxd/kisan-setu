import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { 
  Tractor, 
  Calendar, 
  Ticket, 
  Clock, 
  Scale, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  Users, 
  Leaf,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { nowServing, centre } = useQueue();

  const problemCards = [
    {
      title: t.problem1Title,
      desc: t.problem1Desc,
      stat: "0 Visibility",
      border: "border-slate-200"
    },
    {
      title: t.problem2Title,
      desc: t.problem2Desc,
      stat: "8-14 Hours",
      border: "border-slate-200"
    },
    {
      title: t.problem3Title,
      desc: t.problem3Desc,
      stat: "15-20% Spoilage",
      border: "border-slate-200"
    },
    {
      title: t.problem4Title,
      desc: t.problem4Desc,
      stat: "Delayed DBT",
      border: "border-slate-200"
    }
  ];

  const workflowSteps = [
    { num: "01", title: t.solutionStep1, desc: language === 'hi' ? 'मोबाइल व आधार आधारित किसान सत्यापन' : 'Mobile OTP & Aadhaar farmer verification' },
    { num: "02", title: t.solutionStep2, desc: language === 'hi' ? 'मनपसंद खरीद केंद्र व समय स्लॉट चयन' : 'Reserve verified mandi arrival slot' },
    { num: "03", title: t.solutionStep3, desc: language === 'hi' ? 'क्यूआर कोड युक्त डिजिटल ई-टोकन' : 'QR-coded digital mandi gate pass' },
    { num: "04", title: t.solutionStep4, desc: language === 'hi' ? 'घर बैठे लाइव कतार व बारी अलर्ट' : 'Deterministic yard queue countdown' },
    { num: "05", title: t.solutionStep5, desc: language === 'hi' ? 'कांटा तौल एवं ग्रेडिंग लैब सत्यापन' : 'Automated gross-tare electronic weighing' },
    { num: "06", title: t.solutionStep6, desc: language === 'hi' ? 'सीधे बैंक खाते में डीबीटी भुगतान' : 'Direct Benefit Transfer (DBT) credit' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* SIH Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Smart India Hackathon • SIH26032 • Team White Raven</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {language === 'hi' ? 'किसान सेतु' : 'Kisan Setu'}
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-bold text-emerald-800">
            {t.heroTitle}
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            “{t.heroSubtitle}”
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link 
              to="/book" 
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookASlot}</span>
            </Link>

            <Link 
              to="/token" 
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 shadow-xs transition-all flex items-center space-x-2"
            >
              <Ticket className="w-4 h-4 text-emerald-700" />
              <span>{t.trackMyToken}</span>
            </Link>

            <Link 
              to="/login?tab=operator" 
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>{t.operatorLogin}</span>
            </Link>
          </div>

          {/* Minimalist Live Metrics Counter */}
          <div className="mt-12 max-w-lg mx-auto bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-around divide-x divide-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                {t.nowServing}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">
                {nowServing}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                {t.farmersServed}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {centre?.farmersServedToday || 146}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                {t.centreCapacity}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {centre?.currentLoadPercent || 82}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Problem Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t.problemHeading}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            {language === 'hi' 
              ? 'वर्तमान भौतिक खरीद केंद्रों पर बिना सूचना के आने से लंबी कतारें, अनिश्चितता और फसल बर्बादी होती है।' 
              : 'Unscheduled arrivals at mandi yards cause congestion, crop quality deterioration, and extreme farmer fatigue.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problemCards.map((card, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
              <span className="inline-block text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mb-3">
                {card.stat}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution Pipeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Architecture Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t.solutionHeading}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            A transparent 6-stage digital public infrastructure pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map(s => (
            <div key={s.num} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Stage {s.num}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-3 mb-1">
                {s.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Stakeholder Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
            <h3 className="font-bold text-slate-900 text-sm mb-3 text-emerald-800">
              {t.forFarmers}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.farmerBenefit1}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.farmerBenefit2}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.farmerBenefit3}</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
            <h3 className="font-bold text-slate-900 text-sm mb-3 text-slate-800">
              {t.forCentres}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.centreBenefit1}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.centreBenefit2}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.centreBenefit3}</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
            <h3 className="font-bold text-slate-900 text-sm mb-3 text-slate-800">
              {t.forGovernment}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.govBenefit1}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.govBenefit2}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>{t.govBenefit3}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
