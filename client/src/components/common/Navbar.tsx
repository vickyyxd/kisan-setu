import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { useOffline } from '../../context/OfflineContext';
import { useToast } from '../../context/ToastContext';
import { 
  Tractor, 
  Ticket, 
  Globe, 
  Wifi, 
  WifiOff, 
  Menu, 
  X, 
  User, 
  LogOut,
  Bell,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout, quickSwitch } = useAuth();
  const { myBooking, notifications } = useQueue();
  const { isOffline, toggleOffline } = useOffline();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    showToast(language === 'hi' ? 'लॉगआउट संपन्न' : 'Logged out', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Subtle Minimalist GovTech Sub-Header */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-emerald-400">
            {language === 'hi' ? 'स्मार्ट इंडिया हैकाथॉन' : 'Smart India Hackathon'} (SIH26032)
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Team White Raven • GBPIET Pauri Garhwal
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Offline Simulation Toggle */}
          <button 
            onClick={() => {
              toggleOffline();
              showToast(isOffline ? 'Online Mode Restored' : 'Offline / Low Connectivity Mode Active', 'info');
            }}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              isOffline ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle offline/low connectivity simulation"
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Minimalist Language Switcher */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-slate-400 mr-0.5" />
            <button 
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.2 rounded text-[10px] transition-colors ${
                language === 'en' ? 'font-bold text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-slate-600 text-[10px]">/</span>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.2 rounded text-[10px] transition-colors ${
                language === 'hi' ? 'font-bold text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-900 transition-colors">
              <Tractor className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tight block leading-none">
                {language === 'hi' ? 'किसान सेतु' : 'Kisan Setu'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide">
                Digital Procurement
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.home}
            </Link>

            <Link 
              to="/book" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/book') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.bookSlot}
            </Link>

            <Link 
              to="/token" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/token') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.myToken}
            </Link>

            <Link 
              to="/queue" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/queue') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.queue}
            </Link>

            <Link 
              to="/procurement" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/procurement') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.procurement}
            </Link>

            <Link 
              to="/payment" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/payment') ? 'text-emerald-900 bg-emerald-50/80 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.payment}
            </Link>

            <Link 
              to="/operator/dashboard" 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                location.pathname.startsWith('/operator') 
                  ? 'text-slate-950 bg-slate-100 font-bold border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.operatorConsole}</span>
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2">
            {/* Active Live Token Pill */}
            {myBooking && (
              <Link 
                to="/token"
                className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors"
                title="Your Active Token"
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-700" />
                <span>{myBooking.token}</span>
                <span className="text-[10px] text-emerald-700 font-sans">
                  #{myBooking.queuePosition}
                </span>
              </Link>
            )}

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-modal border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">
                      {language === 'hi' ? 'सूचनाएं' : 'Notifications'}
                    </span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                          <p className="font-bold text-slate-800">
                            {language === 'hi' && n.titleHi ? n.titleHi : n.title}
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {language === 'hi' && n.messageHi ? n.messageHi : n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated State vs Login Button */}
            {user ? (
              <div className="flex items-center space-x-1.5">
                <Link
                  to={role === 'farmer' ? '/profile' : '/operator/dashboard'}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono">
                    {role === 'farmer' ? 'Farmer' : 'Operator'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs"
              >
                {t.login}
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-md animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.home}
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.bookSlot}
          </Link>
          <Link
            to="/token"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.myToken}
          </Link>
          <Link
            to="/queue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.queue}
          </Link>
          <Link
            to="/procurement"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.procurement}
          </Link>
          <Link
            to="/payment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.payment}
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-emerald-800"
            >
              Sign In Portal →
            </Link>
            <Link
              to="/operator/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-700"
            >
              Operator Console →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
