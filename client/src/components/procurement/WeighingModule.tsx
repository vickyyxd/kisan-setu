import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { Scale, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

interface WeighingModuleProps {
  isOperator?: boolean;
}

export const WeighingModule: React.FC<WeighingModuleProps> = ({ isOperator = false }) => {
  const { procurement, myBooking, recordWeighing, isLoading } = useQueue();
  const { language, t } = useLanguage();

  const [gross, setGross] = useState(procurement?.grossWeight || 1250);
  const [tare, setTare] = useState(procurement?.tareWeight || 50);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (procurement) {
      setGross(procurement.grossWeight || 1250);
      setTare(procurement.tareWeight || 50);
    }
  }, [procurement]);

  const net = Math.max(0, gross - tare);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordWeighing(gross, tare);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.weighingStarted}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' 
                ? 'कांटे का अंशांकन: इलेक्ट्रॉनिक्स सेंसर ऑटो-सिंक (प्रमाणित)' 
                : 'Sensor: Electronic Weighbridge ISO Calibrated'}
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          procurement?.status && procurement.status !== 'Pending'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}>
          {procurement?.status && procurement.status !== 'Pending' ? '✓ ' + t.approved : '● In Progress'}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Weight */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t.grossWeight}
          </label>
          {isOperator ? (
            <div className="relative">
              <input
                type="number"
                value={gross}
                onChange={(e) => setGross(Number(e.target.value))}
                className="w-full text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-agri-500 outline-none"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">kg</span>
            </div>
          ) : (
            <p className="text-3xl font-black text-slate-900 font-mono">
              {gross} <span className="text-sm font-semibold text-slate-500">kg</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'वाहन + लदी फसल का कुल भार' : 'Tractor/Trolley + Loaded Grain'}
          </p>
        </div>

        {/* Tare Weight */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t.tareWeight}
          </label>
          {isOperator ? (
            <div className="relative">
              <input
                type="number"
                value={tare}
                onChange={(e) => setTare(Number(e.target.value))}
                className="w-full text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-agri-500 outline-none"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">kg</span>
            </div>
          ) : (
            <p className="text-3xl font-black text-slate-900 font-mono">
              {tare} <span className="text-sm font-semibold text-slate-500">kg</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'खाली वाहन एवं बोरी का वजन' : 'Empty Vehicle & Gunny Bags'}
          </p>
        </div>

        {/* Net Weight Display */}
        <div className="bg-agri-50 rounded-xl p-4 border border-agri-200 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-agri-200/80 text-agri-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
              {t.netWeight} = Gross - Tare
            </span>
            <p className="text-3xl sm:text-4xl font-black text-agri-900 font-mono mt-1">
              {net} <span className="text-sm font-bold text-agri-700">kg</span>
            </p>
            <p className="text-xs text-agri-700 font-semibold mt-0.5">
              = {(net / 100).toFixed(2)} Quintals (क्विंटल)
            </p>
          </div>
          <p className="text-[11px] text-agri-800 mt-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
            <span>{language === 'hi' ? 'कंप्यूटेड एवं डिजिटल प्रमाणित' : 'Verified Net Procurement Weight'}</span>
          </p>
        </div>
      </div>

      {isOperator && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {savedSuccess && (
              <span className="text-green-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'तौल डेटा सफलतापूर्वक सहेजा गया!' : 'Weighbridge data updated!'}</span>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary text-xs"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            <span>{language === 'hi' ? 'वजन सहेजें एवं आगे बढ़ें' : 'Save Weight & Advance'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
