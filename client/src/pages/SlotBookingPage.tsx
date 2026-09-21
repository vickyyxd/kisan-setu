import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Wheat, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Ticket, 
  Download, 
  Share2,
  Sparkles
} from 'lucide-react';

export const SlotBookingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { refreshAll } = useQueue();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedCentre, setSelectedCentre] = useState("centre-01");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedDate, setSelectedDate] = useState("2026-09-15");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM – 12:00 PM");
  const [bookedToken, setBookedToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const centres = [
    {
      id: "centre-01",
      name: "Pauri Procurement Centre",
      nameHi: "पौड़ी खरीद केंद्र",
      distance: "12 km away",
      capacity: 82,
      status: "Open",
      address: "Mandi Samiti Yard, Main Pauri Highway"
    },
    {
      id: "centre-02",
      name: "Kotdwar Central Mandi",
      nameHi: "कोटद्वार केंद्रीय मंडी",
      distance: "48 km away",
      capacity: 64,
      status: "Open",
      address: "Najibabad Road Kisan Yard, Kotdwar"
    },
    {
      id: "centre-03",
      name: "Srinagar Sub-Mandi Hub",
      nameHi: "श्रीनगर उप-मंडी केंद्र",
      distance: "28 km away",
      capacity: 42,
      status: "Open",
      address: "Alaknanda Bypass Yard, Srinagar"
    }
  ];

  const crops = [
    { id: "Wheat", name: "Wheat (गेहूं)", msp: "₹2,300 / Quintal", icon: "🌾" },
    { id: "Rice", name: "Rice / Paddy (धान)", msp: "₹2,200 / Quintal", icon: "🍚" },
    { id: "Maize", name: "Maize (मक्का)", msp: "₹2,090 / Quintal", icon: "🌽" },
    { id: "Mandua", name: "Mandua / Ragi (मडुआ)", msp: "₹4,290 / Quintal", icon: "🌱" }
  ];

  const slots = [
    { time: "08:00 AM – 09:00 AM", status: "Available", color: "text-green-700 bg-green-50 border-green-200" },
    { time: "09:00 AM – 10:00 AM", status: "Limited", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { time: "10:00 AM – 11:00 AM", status: "Full", color: "text-red-700 bg-red-50 border-red-200", disabled: true },
    { time: "11:00 AM – 12:00 PM", status: "Available", color: "text-green-700 bg-green-50 border-green-200" },
    { time: "12:00 PM – 01:00 PM", status: "Available", color: "text-green-700 bg-green-50 border-green-200" },
    { time: "02:00 PM – 03:00 PM", status: "Limited", color: "text-amber-700 bg-amber-50 border-amber-200" }
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user?.id || "f-001",
          centreId: selectedCentre,
          crop: selectedCrop,
          date: "15 September 2026",
          timeSlot: selectedSlot
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookedToken(data.booking);
        await refreshAll();
        setStep(5);
      }
    } catch {
      // Fallback local booking
      setBookedToken({
        token: "A128",
        date: "15 September 2026",
        timeSlot: selectedSlot,
        centreName: "Pauri Procurement Centre",
        crop: selectedCrop,
        queuePosition: 9
      });
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.bookSlot}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi' 
            ? 'अपनी फसल का विवरण भरें, समय चुनें और तुरंत डिजिटल टोकन प्राप्त करें।' 
            : 'Multi-step scheduled slot reservation with automated token issuance.'}
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s 
                  ? 'bg-agri-700 text-white ring-4 ring-agri-100' 
                  : step > s 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-600">
                {s === 1 ? t.step1Title : s === 2 ? t.step2Title : s === 3 ? t.step3Title : s === 4 ? t.step4Title : t.step5Title}
              </span>
              {s < 5 && <span className="hidden md:inline text-slate-300 mx-2">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Centre */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-agri-700" />
            <span>{t.step1Title}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <h3 className="font-bold text-slate-900 text-sm">
                    {language === 'hi' ? c.nameHi : c.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{c.distance}</p>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t.capacity}:</span>
                    <span className="font-bold font-mono">{c.capacity}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.capacity > 80 ? 'bg-amber-500' : 'bg-green-600'}`}
                      style={{ width: `${c.capacity}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="btn-primary text-xs py-2.5 px-5 font-bold"
            >
              <span>{language === 'hi' ? 'फसल चुनें' : 'Continue to Crop'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Crop */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Wheat className="w-5 h-5 text-agri-700" />
            <span>{t.step2Title}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crops.map(cr => (
              <div
                key={cr.id}
                onClick={() => setSelectedCrop(cr.id)}
                className={`card-surface p-5 cursor-pointer flex items-center justify-between transition-all ${
                  selectedCrop === cr.id 
                    ? 'border-2 border-agri-600 bg-agri-50/40 shadow-md' 
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{cr.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cr.name}</h3>
                    <p className="text-xs text-agri-700 font-semibold">{cr.msp}</p>
                  </div>
                </div>
                {selectedCrop === cr.id && <CheckCircle2 className="w-5 h-5 text-agri-700" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="btn-secondary text-xs py-2.5 px-4 font-bold">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </button>
            <button onClick={() => setStep(3)} className="btn-primary text-xs py-2.5 px-5 font-bold">
              <span>Continue to Date</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-agri-700" />
            <span>{t.step3Title}</span>
          </h2>

          <div className="card-surface p-6 max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Procurement Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min="2026-09-15"
              className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-agri-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Selected: <strong>15 September 2026 (Today)</strong> • Mandi Operating 08:00 AM – 05:00 PM
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="btn-secondary text-xs py-2.5 px-4 font-bold">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </button>
            <button onClick={() => setStep(4)} className="btn-primary text-xs py-2.5 px-5 font-bold">
              <span>Continue to Time Slot</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Select Time Slot */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-agri-700" />
            <span>{t.step4Title}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {slots.map((s, idx) => (
              <button
                key={idx}
                disabled={s.disabled}
                onClick={() => setSelectedSlot(s.time)}
                className={`card-surface p-4 text-left transition-all ${
                  s.disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:border-slate-300'
                } ${selectedSlot === s.time && !s.disabled ? 'border-2 border-agri-600 bg-agri-50/40 shadow-sm' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-900">{s.time}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${s.color}`}>
                    {s.status}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Capacity: {s.status === 'Full' ? '30/30 (Closed)' : s.status === 'Limited' ? '26/30' : '14/30'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="btn-secondary text-xs py-2.5 px-4 font-bold">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="btn-primary text-xs py-2.5 px-5 font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>{loading ? 'Booking...' : t.confirmBooking}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Booking Confirmation */}
      {step === 5 && (
        <div className="card-surface p-8 text-center space-y-6 animate-in zoom-in-95 max-w-lg mx-auto border-2 border-green-300">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              Procurement Slot Confirmed
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1 font-mono">
              Token: {bookedToken?.token || "A128"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Beneficiary: <strong>{user?.name || "Vicky Kumar"}</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 text-left border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Procurement Centre:</span>
              <span className="font-bold text-slate-900">Pauri Procurement Centre</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="font-bold text-slate-900">15 September 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time Slot:</span>
              <span className="font-bold text-slate-900">{selectedSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Crop:</span>
              <span className="font-bold text-slate-900">{selectedCrop}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => alert("Added to device calendar: 15 Sep 2026, 11:00 AM")}
              className="btn-secondary text-xs py-2 px-3"
            >
              <span>Add to Calendar</span>
            </button>
            <button
              onClick={() => navigate('/token')}
              className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1 font-bold"
            >
              <Ticket className="w-3.5 h-3.5 text-agri-700" />
              <span>{t.downloadToken}</span>
            </button>
            <button
              onClick={() => navigate('/queue')}
              className="btn-primary text-xs py-2 px-4 font-bold"
            >
              <span>{t.trackQueue}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
