import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Tractor, Heart, Award, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-agri-600 flex items-center justify-center">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {language === 'hi' ? 'किसान सेतु' : 'Kisan Setu'}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {t.tagline}
            </p>
            <div className="inline-flex items-center space-x-2 text-xs bg-slate-800/80 text-agri-400 px-3 py-1.5 rounded-md border border-slate-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon • SIH26032 • Student Innovation (Farmers Problem)</span>
            </div>
          </div>

          {/* Mandi & Tech Stack */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              {language === 'hi' ? 'प्रणाली आर्किटेक्चर' : 'System Architecture'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Real-Time WebSocket Queue Engine</li>
              <li>• Zero-Congestion Mandi Slotting</li>
              <li>• Automated Gross-Tare-Net Weighbridge</li>
              <li>• Transparent Moisture & Grade Lab</li>
              <li>• Direct Benefit Transfer (DBT) Simulation</li>
              <li>• Offline-First SMS Fallback</li>
            </ul>
          </div>

          {/* Team Col */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              {language === 'hi' ? 'विकासक टीम' : 'Development Team'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="text-white font-medium">Team White Raven</p>
              <p>Team Leader: <strong className="text-slate-200">Vicky Kumar</strong></p>
              <p className="flex items-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-agri-400 shrink-0" />
                <span>Govind Ballabh Pant Institute of Engineering & Technology (GBPIET), Pauri Garhwal, Uttarakhand</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with mandatory disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            {t.footerDisclaimer}
          </p>
          <div className="flex items-center space-x-2">
            <span>© 2026 Kisan Setu. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
