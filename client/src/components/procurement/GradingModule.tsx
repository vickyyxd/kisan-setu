import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { Award, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface GradingModuleProps {
  isOperator?: boolean;
}

export const GradingModule: React.FC<GradingModuleProps> = ({ isOperator = false }) => {
  const { procurement, recordGrading, completeProcurement, isLoading } = useQueue();
  const { language, t } = useLanguage();

  const [moisture, setMoisture] = useState(procurement?.moisture || 12.0);
  const [foreignMatter, setForeignMatter] = useState(procurement?.foreignMatter || 1.5);
  const [grade, setGrade] = useState<'A' | 'B' | 'C' | 'Rejected'>(procurement?.grade || 'A');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (procurement) {
      setMoisture(procurement.moisture || 12.0);
      setForeignMatter(procurement.foreignMatter || 1.5);
      setGrade(procurement.grade || 'A');
    }
  }, [procurement]);

  const handleSave = async (selectedGrade = grade) => {
    await recordGrading(moisture, foreignMatter, selectedGrade);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const mspRate = grade === 'A' ? 2300 : grade === 'B' ? 2200 : grade === 'C' ? 2050 : 0;
  const netWeight = procurement?.netWeight || 1200;
  const totalAmount = Math.round((netWeight / 100) * mspRate);

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.qualityAssessment}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' 
                ? 'गुणवत्ता प्रयोगशाला परीक्षण रिपोर्ट (Moisture Meter & Grain Analyzer)' 
                : 'Digital Grain Quality Analyzer & Certified Lab Report'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getGradeColor(grade)}`}>
          Grade {grade} • {grade === 'Rejected' ? t.rejected : t.approved}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Moisture Content */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t.moisture}
          </label>
          {isOperator ? (
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none"
              />
              <span className="absolute right-3 top-3 text-sm font-bold text-slate-400">%</span>
            </div>
          ) : (
            <p className="text-3xl font-black text-slate-900 font-mono">
              {moisture}%
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'मानक सीमा: ≤ 12.0% नमी' : 'Permissible Standard: ≤ 12.0%'}
          </p>
        </div>

        {/* Foreign Matter */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t.foreignMatter}
          </label>
          {isOperator ? (
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(Number(e.target.value))}
                className="w-full text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none"
              />
              <span className="absolute right-3 top-3 text-sm font-bold text-slate-400">%</span>
            </div>
          ) : (
            <p className="text-3xl font-black text-slate-900 font-mono">
              {foreignMatter}%
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'धूल / तिनका: ≤ 2.0% अनुमेय' : 'Permissible Chaff/Dirt: ≤ 2.0%'}
          </p>
        </div>

        {/* Quality Grade */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t.qualityGrade}
          </label>
          {isOperator ? (
            <select
              value={grade}
              onChange={(e) => {
                const newG = e.target.value as any;
                setGrade(newG);
                handleSave(newG);
              }}
              className="w-full text-lg font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none"
            >
              <option value="A">Grade A (Premium Fair Average)</option>
              <option value="B">Grade B (Standard MSP)</option>
              <option value="C">Grade C (Below Standard)</option>
              <option value="Rejected">Rejected (Excess Moisture)</option>
            </select>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {grade}
              </span>
              <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded font-bold">
                {grade === 'Rejected' ? 'Disapproved' : 'Fair Average Quality (FAQ)'}
              </span>
            </div>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'भारतीय खाद्य निगम (FCI) मानक' : 'Govt FCI Grade Certification'}
          </p>
        </div>

        {/* Total MSP Calculation */}
        <div className="bg-agri-50 rounded-xl p-4 border border-agri-200">
          <span className="block text-xs font-bold text-agri-800">
            {language === 'hi' ? 'देय न्यूनतम समर्थन मूल्य (MSP)' : 'Calculated MSP Value'}
          </span>
          <p className="text-2xl sm:text-3xl font-black text-agri-950 font-mono mt-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-agri-700 mt-0.5">
            ₹{mspRate} / क्विंटल ({netWeight} kg)
          </p>
        </div>
      </div>

      {isOperator && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Grade Presets:</span>
            {(['A', 'B', 'C', 'Rejected'] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGrade(g);
                  handleSave(g);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                  grade === g ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {savedSuccess && (
              <span className="text-xs text-green-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सफलतापूर्वक सहेजा गया' : 'Saved!'}</span>
              </span>
            )}
            <button
              onClick={() => completeProcurement()}
              disabled={isLoading || grade === 'Rejected'}
              className="btn-primary text-xs bg-agri-800 hover:bg-agri-900"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
              <span>{language === 'hi' ? 'खरीद स्वीकृत करें एवं बिल बनाएं' : 'Approve & Generate Bill'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
