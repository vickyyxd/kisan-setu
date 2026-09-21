import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Building2, MapPin, Navigation, ArrowRight, CheckCircle2, Clock, Users } from 'lucide-react';

export const CentreDiscoveryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [selectedCentre, setSelectedCentre] = useState("centre-01");

  const centres = [
    {
      id: "centre-01",
      name: "Pauri Procurement Centre",
      nameHi: "पौड़ी खरीद केंद्र",
      district: "Pauri Garhwal",
      distance: "12 km",
      capacity: 82,
      served: 146,
      waiting: 23,
      status: "Open",
      hours: "08:00 AM - 05:00 PM",
      mapX: 45,
      mapY: 40
    },
    {
      id: "centre-02",
      name: "Kotdwar Central Mandi",
      nameHi: "कोटद्वार केंद्रीय मंडी",
      district: "Pauri Garhwal (Foothills)",
      distance: "48 km",
      capacity: 64,
      served: 195,
      waiting: 18,
      status: "Open",
      hours: "07:30 AM - 05:30 PM",
      mapX: 30,
      mapY: 75
    },
    {
      id: "centre-03",
      name: "Srinagar Sub-Mandi Hub",
      nameHi: "श्रीनगर उप-मंडी केंद्र",
      district: "Alaknanda Valley",
      distance: "28 km",
      capacity: 42,
      served: 58,
      waiting: 8,
      status: "Open",
      hours: "08:30 AM - 04:30 PM",
      mapX: 65,
      mapY: 25
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'निकटवर्ती खरीद केंद्र एवं मंडी यार्ड' : 'Procurement Centres & Mandi Locator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'hi' 
            ? 'उत्तराखंड राज्य के निकटतम सक्रिय खरीद केंद्रों की वास्तविक लोड क्षमता एवं दूरी देखें।' 
            : 'Explore nearby procurement hubs, real-time yard capacity, and operational hours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulated Interactive Mandi Radar Map */}
        <div className="lg:col-span-7 card-surface p-6 flex flex-col justify-between bg-linear-to-b from-slate-900 to-slate-950 text-white min-h-[420px] relative overflow-hidden rounded-2xl shadow-xl">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-agri-400 uppercase font-bold">
                GIS MANDI TOPOLOGY • GARHWAL REGION
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Uttarakhand State Agri GIS Network
              </h3>
            </div>
            <span className="text-xs bg-agri-950/80 text-agri-300 px-2.5 py-1 rounded-full border border-agri-700/60 font-mono">
              3 ACTIVE CENTRES
            </span>
          </div>

          {/* Interactive Visual Map Pins */}
          <div className="relative z-10 w-full h-64 my-4 border border-slate-800 rounded-xl bg-slate-900/60 p-4">
            {/* Topographic Lines Illustration */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20,80 Q 150,20 300,120 T 600,80" fill="none" stroke="#22c55e" strokeWidth="1" />
              <path d="M 50,180 Q 220,100 400,220 T 700,160" fill="none" stroke="#22c55e" strokeWidth="1" />
            </svg>

            {centres.map(c => {
              const isSel = selectedCentre === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentre(c.id)}
                  style={{ left: `${c.mapX}%`, top: `${c.mapY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSel ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                      isSel 
                        ? 'bg-agri-500 text-slate-950 ring-4 ring-agri-300' 
                        : 'bg-slate-800 text-white border border-slate-700'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-sm ${
                      isSel ? 'bg-agri-500 text-slate-950' : 'bg-slate-800/90 text-slate-300'
                    }`}>
                      {c.name.split(' ')[0]} ({c.distance})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800">
            <span>Click any node pin to inspect yard load</span>
            <span className="font-mono text-agri-400">GPS Geo-Bound Live</span>
          </div>
        </div>

        {/* Centre Cards List */}
        <div className="lg:col-span-5 space-y-4">
          {centres.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedCentre(c.id)}
              className={`card-surface p-5 cursor-pointer transition-all ${
                selectedCentre === c.id 
                  ? 'border-2 border-agri-600 bg-agri-50/40 shadow-md ring-2 ring-agri-100' 
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'hi' ? c.nameHi : c.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.district} • {c.distance}</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  {c.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Yard Capacity Load:</span>
                  <span className="font-bold font-mono text-slate-900">{c.capacity}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.capacity > 80 ? 'bg-amber-500' : 'bg-green-600'}`}
                    style={{ width: `${c.capacity}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Served: {c.served} farmers</span>
                  <span>Waiting: {c.waiting} in line</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/book');
                  }}
                  className="btn-primary text-xs py-1.5 px-3 font-bold flex items-center space-x-1"
                >
                  <span>{language === 'hi' ? 'स्लॉट बुक करें' : 'Select Centre & Book'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
