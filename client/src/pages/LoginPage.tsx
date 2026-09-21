import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Tractor, 
  ShieldCheck, 
  Phone, 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsFarmer, loginAsOperator } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from query param or route
  const isOperatorDefault = location.pathname.includes('operator') || location.search.includes('tab=operator');
  const [activeTab, setActiveTab] = useState<'farmer' | 'operator'>(isOperatorDefault ? 'operator' : 'farmer');

  // Farmer form state
  const [mobile, setMobile] = useState("9876543210");
  const [otp, setOtp] = useState("123456");
  const [otpSent, setOtpSent] = useState(true);

  // Operator form state
  const [operatorId, setOperatorId] = useState("operator@kisansetu.demo");
  const [password, setPassword] = useState("demo123");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Farmer Login Handler
  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!otpSent) {
      if (mobile.length < 10) {
        setError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        setLoading(false);
        return;
      }
      setOtpSent(true);
      setLoading(false);
      showToast(language === 'hi' ? 'ओटीपी भेजा गया: 123456' : 'Demo OTP sent: 123456', 'info');
      return;
    }

    try {
      const res = await loginAsFarmer(mobile, otp);
      if (res.success) {
        showToast(language === 'hi' ? 'स्वागत है, विक्की कुमार' : 'Welcome, Vicky Kumar', 'success');
        navigate('/dashboard');
      } else {
        setError(res.message || "Invalid OTP. Use demo OTP: 123456");
      }
    } finally {
      setLoading(false);
    }
  };

  // Operator Login Handler
  const handleOperatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAsOperator(operatorId, password);
      if (res.success) {
        showToast(language === 'hi' ? 'संचालक कंसोल में आपका स्वागत है' : 'Welcome to Operator Console', 'success');
        navigate('/operator/dashboard');
      } else {
        setError(res.message || "Invalid credentials. Use operator@kisansetu.demo / demo123");
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Fill Handlers
  const handleQuickFarmerLogin = async () => {
    setLoading(true);
    await loginAsFarmer("9876543210", "123456");
    setLoading(false);
    showToast(language === 'hi' ? 'डेमो किसान लॉगिन सफल' : 'Demo Farmer Login Successful', 'success');
    navigate('/dashboard');
  };

  const handleQuickOperatorLogin = async () => {
    setLoading(true);
    await loginAsOperator("operator@kisansetu.demo", "demo123");
    setLoading(false);
    showToast(language === 'hi' ? 'संचालक लॉगिन सफल' : 'Operator Console Access Granted', 'success');
    navigate('/operator/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md">
        {/* Minimalist Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Smart India Hackathon • SIH26032</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'किसान सेतु पोर्टल' : 'Kisan Setu Portal'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {language === 'hi' 
              ? 'मंडी खरीद स्लॉट, लाइव कतार एवं संचालक कमान केंद्र हेतु अधिकृत प्रवेश।' 
              : 'Digital procurement, live yard queues, and command centre access.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/60 p-1 m-2 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('farmer');
                setError(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'farmer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tractor className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'किसान लॉगिन' : 'Farmer Login'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('operator');
                setError(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'operator'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>{language === 'hi' ? 'संचालक लॉगिन' : 'Operator Login'}</span>
            </button>
          </div>

          <div className="p-6 pt-4 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: FARMER LOGIN */}
            {activeTab === 'farmer' && (
              <form onSubmit={handleFarmerSubmit} className="space-y-4">
                {/* Demo Helper Banner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs flex justify-between items-center text-emerald-950">
                  <div>
                    <span className="font-bold text-emerald-900 block">Demo Farmer:</span>
                    <span className="text-slate-600 font-mono">9876543210 (OTP: 123456)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickFarmerLogin}
                    disabled={loading}
                    className="text-[11px] font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    1-Click Login
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-mono font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      required
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {otpSent ? (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {language === 'hi' ? 'ओटीपी सत्यापन कोड' : 'Verification OTP'}
                        </label>
                        <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                          OTP: 123456
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                          placeholder="123456"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono tracking-widest text-center text-lg font-black focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{loading ? 'Verifying...' : (language === 'hi' ? 'सत्यापित करें एवं डैशबोर्ड खोलें' : 'Verify & Open Dashboard')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Sending...' : (language === 'hi' ? 'ओटीपी कोड प्राप्त करें' : 'Send Verification OTP')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </form>
            )}

            {/* TAB 2: OPERATOR LOGIN */}
            {activeTab === 'operator' && (
              <form onSubmit={handleOperatorSubmit} className="space-y-4">
                {/* Demo Helper Banner */}
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs flex justify-between items-center text-slate-900">
                  <div>
                    <span className="font-bold text-slate-900 block">Operator Credentials:</span>
                    <span className="text-slate-500 font-mono text-[11px]">operator@kisansetu.demo / demo123</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickOperatorLogin}
                    disabled={loading}
                    className="text-[11px] font-bold px-2.5 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    1-Click Login
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Operator ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      placeholder="operator@kisansetu.demo"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Entering...' : (language === 'hi' ? 'संचालक कंसोल में प्रवेश करें' : 'Enter Operator Console')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Minimalist Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Kisan Setu • Uttarakhand State Agricultural Marketing Board
        </p>
      </div>
    </div>
  );
};
