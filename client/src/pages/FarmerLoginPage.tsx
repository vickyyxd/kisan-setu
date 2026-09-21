import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, Phone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const FarmerLoginPage: React.FC = () => {
  const { loginAsFarmer } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("9876543210");
  const [otp, setOtp] = useState("123456");
  const [otpSent, setOtpSent] = useState(true); // Default true for frictionless hackathon demo
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginAsFarmer(mobile, otp);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch {
      setError("Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setMobile("9876543210");
    setOtp("123456");
    setLoading(true);
    await loginAsFarmer("9876543210", "123456");
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full card-surface p-8 shadow-card border border-slate-200">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-agri-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Tractor className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'किसान सेतु में आपका स्वागत है' : 'Welcome to Kisan Setu'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi' 
              ? 'खरीद स्लॉट बुकिंग एवं लाइव टोकन कतार हेतु लॉगिन करें' 
              : 'Enter mobile number for digital procurement & live token tracking'}
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 p-3 bg-agri-50 border border-agri-200 rounded-xl text-xs space-y-1 text-agri-950">
          <div className="flex justify-between items-center font-bold text-agri-900">
            <span>🔑 {language === 'hi' ? 'डेमो किसान विवरण:' : 'Demo Farmer Credentials:'}</span>
            <span className="text-[10px] bg-agri-200 px-1.5 py-0.2 rounded font-mono">Auto-Filled</span>
          </div>
          <p className="text-slate-600">
            Mobile: <strong className="font-mono text-slate-800">9876543210</strong> (Vicky Kumar)
          </p>
          <p className="text-slate-600">
            Demo OTP: <strong className="font-mono text-slate-800">123456</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-slate-400 font-mono">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                required
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-agri-500 outline-none"
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-sm font-bold shadow-sm"
            >
              <span>{language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          ) : (
            <div className="space-y-4 pt-1 animate-in fade-in">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'hi' ? 'ओटीपी (OTP)' : 'OTP Code'}
                  </label>
                  <span className="text-[11px] text-green-700 font-semibold">Demo OTP: 123456</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="123456"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tracking-widest text-center text-lg font-black focus:bg-white focus:ring-2 focus:ring-agri-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-sm font-bold shadow-sm"
              >
                {loading ? 'Verifying...' : (language === 'hi' ? 'सत्यापित करें एवं जारी रखें' : 'Verify & Continue')}
              </button>
            </div>
          )}
        </form>

        {/* 1-Click Quick Demo Login Button */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full text-xs font-bold text-agri-800 bg-agri-100/70 hover:bg-agri-200 py-2.5 rounded-lg border border-agri-300 transition-colors flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-agri-700" />
            <span>{language === 'hi' ? '1-क्लिक डेमो लॉगिन (विक्की कुमार)' : '1-Click Presentation Demo Login (Vicky Kumar)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
