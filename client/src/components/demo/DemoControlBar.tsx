import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle, 
  UserCheck, 
  Scale, 
  Award, 
  CreditCard,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const { demoStep, runDemoStep, resetDemoData, isLoading } = useQueue();
  const { quickSwitch, role } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    { num: 1, label: "1. Problem & Landing", role: 'farmer', path: '/' },
    { num: 2, label: "2. Vicky's Token (Pos 08)", role: 'farmer', path: '/token' },
    { num: 3, label: "3. Book Slot Simulation", role: 'farmer', path: '/book' },
    { num: 4, label: "4. Operator Console", role: 'operator', path: '/operator/dashboard' },
    { num: 5, label: "5. Advance Queue (Real-Time)", role: 'operator', path: '/operator/dashboard' },
    { num: 6, label: "6. Farmer Sees Queue Move", role: 'farmer', path: '/queue' },
    { num: 7, label: "7. Weighing (Gross-Tare-Net)", role: 'operator', path: '/operator/dashboard' },
    { num: 8, label: "8. Quality Grading (Grade A)", role: 'operator', path: '/operator/dashboard' },
    { num: 9, label: "9. Complete Procurement", role: 'operator', path: '/operator/dashboard' },
    { num: 10, label: "10. DBT Payment & Receipt", role: 'farmer', path: '/payment' }
  ];

  const handleStepClick = async (s: typeof steps[0]) => {
    quickSwitch(s.role as any);
    await runDemoStep(s.num);
    navigate(s.path);
  };

  const handleNext = async () => {
    const nextNum = demoStep < 10 ? demoStep + 1 : 1;
    const nextStepObj = steps.find(s => s.num === nextNum) || steps[0];
    await handleStepClick(nextStepObj);
  };

  const handlePrev = async () => {
    const prevNum = demoStep > 1 ? demoStep - 1 : 10;
    const prevStepObj = steps.find(s => s.num === prevNum) || steps[0];
    await handleStepClick(prevStepObj);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 text-white border-t border-slate-700 shadow-2xl backdrop-blur-md transition-all duration-300">
      {/* Header bar of presenter controller */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-agri-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>🎬 {language === 'hi' ? 'हैकाथॉन प्रस्तुति डेमो' : 'SIH Hackathon Presentation Demo'}</span>
          </div>

          <span className="text-xs text-slate-300 hidden md:inline">
            {language === 'hi' ? 'वर्तमान चरण' : 'Current Step'}: <strong className="text-agri-400 font-mono">{steps[demoStep - 1]?.label}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Step Nav */}
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-50"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-agri-600 hover:bg-agri-500 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <span>{language === 'hi' ? 'अगला चरण' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset button */}
          <button
            onClick={async () => {
              await resetDemoData();
              quickSwitch('farmer');
              navigate('/');
            }}
            disabled={isLoading}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 text-xs transition-colors border border-slate-700"
            title="Reset to fresh demo scenario"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            title={collapsed ? "Expand step pills" : "Collapse step pills"}
          >
            {collapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Pills list */}
      {!collapsed && (
        <div className="max-w-7xl mx-auto px-4 pb-2.5 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 min-w-max text-xs">
            {steps.map(s => {
              const isCurrent = s.num === demoStep;
              return (
                <button
                  key={s.num}
                  onClick={() => handleStepClick(s)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center space-x-1 ${
                    isCurrent
                      ? 'bg-agri-500 text-slate-950 font-bold shadow-md ring-2 ring-agri-300 ring-offset-1 ring-offset-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
