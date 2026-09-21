import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const OperatorLoginPage: React.FC = () => {
  const { loginAsOperator } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [operatorId, setOperatorId] = useState("operator@kisansetu.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginAsOperator(operatorId, password);
      if (res.success) {
        navigate('/operator/dashboard');
      } else {
        setError(res.message || "Invalid operator credentials");
      }
    } catch {
      setError("Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setOperatorId("operator@kisansetu.demo");
    setPassword("demo123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full card-surface p-8 shadow-card border border-slate-200">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.operatorConsole}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi' 
              ? 'मंडी समिति खरीद केंद्र संचालक कमान केंद्र' 
              : 'Mandi Samiti Procurement Command & Yard Operations'}
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-950">
          <div className="flex justify-between items-center font-bold text-amber-900">
            <span>🔑 Demo Operator Credentials:</span>
            <button
              onClick={handleQuickFill}
              className="text-[10px] bg-amber-200 hover:bg-amber-300 px-1.5 py-0.5 rounded font-mono font-bold"
            >
              Fill Demo
            </button>
          </div>
          <p className="text-slate-600">ID: <strong className="font-mono text-slate-800">operator@kisansetu.demo</strong></p>
          <p className="text-slate-600">Password: <strong className="font-mono text-slate-800">demo123</strong></p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Operator ID / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                placeholder="operator@kisansetu.demo"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Logging in...' : 'Enter Operator Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
