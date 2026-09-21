import React from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { WeighingModule } from '../components/procurement/WeighingModule';
import { GradingModule } from '../components/procurement/GradingModule';
import { 
  CheckCircle2, 
  Clock, 
  Scale, 
  Award, 
  CreditCard, 
  FileCheck, 
  Ticket, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProcurementJourneyPage: React.FC = () => {
  const { myBooking, procurement, payment } = useQueue();
  const { language, t } = useLanguage();

  const status = myBooking?.status || "Slot Confirmed";

  const timeline = [
    { id: 1, label: language === 'hi' ? 'पंजीकरण एवं प्रोफाइल' : 'Registration Verified', done: true },
    { id: 2, label: language === 'hi' ? 'स्लॉट बुक हुआ' : 'Slot Booked', done: true },
    { id: 3, label: language === 'hi' ? 'डिजिटल टोकन जारी' : 'Token Generated (A127)', done: true },
    { 
      id: 4, 
      label: language === 'hi' ? 'कतार में इंतज़ार' : 'Waiting in Queue', 
      done: true,
      current: status === 'Slot Confirmed' || status === 'Waiting'
    },
    { 
      id: 5, 
      label: language === 'hi' ? 'तौल प्रक्रिया (कांटा)' : 'Weighing in Progress', 
      done: ['Weighing', 'Grading', 'Procurement Complete', 'Payment Completed'].includes(status),
      current: status === 'Weighing'
    },
    { 
      id: 6, 
      label: language === 'hi' ? 'गुणवत्ता ग्रेडिंग' : 'Quality Grading Lab', 
      done: ['Grading', 'Procurement Complete', 'Payment Completed'].includes(status),
      current: status === 'Grading'
    },
    { 
      id: 7, 
      label: language === 'hi' ? 'खरीद पूर्ण एवं बिल' : 'Procurement Complete', 
      done: ['Procurement Complete', 'Payment Completed'].includes(status),
      current: status === 'Procurement Complete'
    },
    { 
      id: 8, 
      label: language === 'hi' ? 'डीबीटी भुगतान' : 'Payment Settled', 
      done: status === 'Payment Completed',
      current: status === 'Payment Completed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.procurement} Journey • Token {myBooking?.token || "A127"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' 
              ? 'डिजिटल कांटा तौल, नमी जांच एवं समर्थन मूल्य बिलिंग की पूर्ण पारदर्शी ट्रैकिंग।' 
              : 'End-to-end milestone tracker from farmgate booking to weighbridge and DBT settlement.'}
          </p>
        </div>

        <Link
          to="/payment"
          className="btn-primary text-xs py-2 px-4 font-bold flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>{t.paymentStatus}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Dynamic Visual Timeline Banner */}
      <div className="card-surface p-6 overflow-x-auto no-scrollbar">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          {language === 'hi' ? 'फसल खरीद चरणबद्ध प्रगति' : 'Procurement Milestone Stepper'}
        </h3>
        <div className="flex items-center space-x-2 min-w-max py-2">
          {timeline.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                step.current 
                  ? 'bg-agri-600 text-white font-bold border-agri-700 shadow-md ring-2 ring-agri-300' 
                  : step.done 
                    ? 'bg-agri-50 text-agri-900 border-agri-200 font-semibold' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                    {step.id}
                  </span>
                )}
                <span>{step.label}</span>
              </div>
              {idx < timeline.length - 1 && (
                <span className="text-slate-300 text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Weighing Module */}
      <div>
        <WeighingModule isOperator={false} />
      </div>

      {/* Grading Module */}
      <div>
        <GradingModule isOperator={false} />
      </div>
    </div>
  );
};
