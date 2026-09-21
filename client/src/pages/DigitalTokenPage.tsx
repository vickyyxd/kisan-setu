import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Ticket, 
  Download, 
  Share2, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Wheat, 
  Printer,
  CheckCircle2
} from 'lucide-react';

export const DigitalTokenPage: React.FC = () => {
  const { myBooking, nowServing } = useQueue();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const token = myBooking?.token || "A127";
  const farmerName = myBooking?.farmerName || user?.name || "Vicky Kumar";
  const crop = myBooking?.crop || "Wheat";
  const centre = myBooking?.centreName || "Pauri Procurement Centre";
  const date = myBooking?.date || "15 Sep 2026";
  const slot = myBooking?.timeSlot || "11:00 AM – 12:00 PM";
  const position = myBooking?.queuePosition ?? 8;
  const turn = myBooking?.estimatedTurn || "11:40 AM";

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`KISAN SETU MANDI TOKEN: ${token} for ${farmerName} at ${centre}. Queue Pos: ${position}, Est Turn: ${turn}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.myToken}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'मंडी प्रवेश द्वार पर यह डिजिटल ई-टोकन या मुद्रित पर्ची दिखाएं'
            : 'Present this digital pass or printed voucher at the mandi entry gate'}
        </p>
      </div>

      {/* Printable Digital Token Card */}
      <div id="printable-token" className="card-surface p-6 sm:p-8 bg-linear-to-b from-white via-white to-agri-50/50 border-2 border-agri-600 rounded-3xl shadow-card relative overflow-hidden">
        {/* Top Watermark Badge */}
        <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-agri-700 text-white font-black text-xs px-2.5 py-1 rounded">
                KISAN SETU
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                DIGITAL PROCUREMENT PASS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Uttarakhand State Agricultural Marketing Board
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded border border-green-200">
              ● VERIFIED
            </span>
          </div>
        </div>

        {/* Big Token Number */}
        <div className="py-6 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            OFFICIAL TOKEN NUMBER
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-agri-900 font-mono tracking-wider mt-1">
            {token}
          </h2>
          <span className="inline-block bg-agri-100 text-agri-800 text-xs font-bold px-3 py-1 rounded-full mt-2">
            Queue Position: #{position < 10 ? `0${position}` : position} • Est. Turn: {turn}
          </span>
        </div>

        {/* Farmer & Mandi Details */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Farmer Name:</span>
            <span className="font-bold text-slate-900 text-sm">{farmerName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Farmer ID:</span>
            <span className="font-mono text-slate-700 font-bold">KS-F-00127</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Crop:</span>
            <span className="font-bold text-slate-900">{crop} (गेहूं)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Procurement Centre:</span>
            <span className="font-bold text-slate-900">{centre}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Date & Slot:</span>
            <span className="font-bold text-slate-900">{date} • {slot}</span>
          </div>
        </div>

        {/* Mock QR Code Graphic */}
        <div className="mt-6 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200">
          {/* Custom SVG QR Code visual */}
          <div className="w-36 h-36 p-2 bg-slate-950 rounded-xl flex items-center justify-center relative shadow-xs">
            <div className="w-full h-full bg-white p-2 rounded-lg grid grid-cols-6 grid-rows-6 gap-1">
              <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs" />
              <div className="col-span-2 row-span-1 bg-slate-900" />
              <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs" />
              <div className="col-span-1 row-span-2 bg-slate-900" />
              <div className="col-span-2 row-span-2 bg-agri-700 rounded-xs flex items-center justify-center text-white text-[8px] font-mono">
                KS
              </div>
              <div className="col-span-1 row-span-1 bg-slate-900" />
              <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs" />
              <div className="col-span-2 row-span-1 bg-slate-900" />
              <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-2 tracking-wide">
            SCAN AT GATE • SHA256 VALIDATED
          </p>
        </div>

        {/* Security Stamp Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Uttarakhand Mandi Samiti</span>
          <span className="font-mono">Ref: KS-2026-A127-VKY</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="btn-secondary text-xs py-2.5 px-4 font-bold flex items-center space-x-1.5"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>{t.downloadToken}</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary text-xs py-2.5 px-4 font-bold flex items-center space-x-1.5"
        >
          <Share2 className="w-4 h-4 text-slate-600" />
          <span>{copied ? 'Copied to Clipboard!' : t.shareToken}</span>
        </button>

        <button
          onClick={() => navigate('/queue')}
          className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center space-x-1.5 shadow-md"
        >
          <span>{t.trackQueue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
