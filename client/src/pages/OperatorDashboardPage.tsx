import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import { WeighingModule } from '../components/procurement/WeighingModule';
import { GradingModule } from '../components/procurement/GradingModule';
import { PaymentModule } from '../components/procurement/PaymentModule';
import { 
  Building2, 
  Users, 
  Scale, 
  TrendingUp, 
  Play, 
  Pause, 
  Bell, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  PhoneCall, 
  Award, 
  CreditCard,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OperatorDashboardPage: React.FC = () => {
  const { 
    centre, 
    nowServing, 
    myBooking, 
    waitingList, 
    advanceQueue, 
    updateCentreCapacity, 
    toggleQueuePause, 
    isLoading,
    refreshAll
  } = useQueue();
  const { language, t } = useLanguage();

  const [capacityInput, setCapacityInput] = useState(centre?.currentLoadPercent || 82);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'weighing' | 'grading' | 'payment'>('queue');
  const [calledFarmerToken, setCalledFarmerToken] = useState<string | null>(null);

  const capacity = centre?.currentLoadPercent ?? 82;
  const served = centre?.farmersServedToday ?? 146;
  const waiting = centre?.farmersWaitingToday ?? 23;
  const progress = 76;

  // Queue rows for the table
  const queueRows = [
    { token: "A124", farmer: "R. Singh", crop: "Wheat", slot: "10:00", pos: "01", status: "Weighing" },
    { token: "A125", farmer: "S. Devi", crop: "Wheat", slot: "10:00", pos: "02", status: "Grading" },
    { token: "A126", farmer: "M. Kumar", crop: "Wheat", slot: "10:30", pos: "03", status: "Payment" },
    { 
      token: myBooking?.token || "A127", 
      farmer: myBooking?.farmerName || "Vicky Kumar", 
      crop: myBooking?.crop || "Wheat", 
      slot: myBooking?.timeSlot || "11:00", 
      pos: myBooking?.queuePosition ? (myBooking.queuePosition < 10 ? `0${myBooking.queuePosition}` : `${myBooking.queuePosition}`) : "08", 
      status: myBooking?.status || "Waiting" 
    }
  ];

  const handleCallFarmer = (tok: string) => {
    setCalledFarmerToken(tok);
    setTimeout(() => setCalledFarmerToken(null), 4000);
  };

  const handleNotifyWaiting = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  const handleCapacitySave = async () => {
    await updateCentreCapacity(capacityInput);
    setShowCapacityModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Kisan Setu Operator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            {centre?.name || "Pauri Procurement Centre"}
          </h1>
          <p className="text-xs text-slate-500">
            Mandi In-charge & Weighbridge Operator Command Station • Mandi Samiti Pauri
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/operator/analytics"
            className="btn-secondary text-xs py-2 px-3 font-bold"
          >
            <span>{language === 'hi' ? 'एनालिटिक्स ग्राफ' : 'View Analytics'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>

          <button
            onClick={() => refreshAll()}
            disabled={isLoading}
            className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Call to Action Feedback Banners */}
      {calledFarmerToken && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-blue-700 animate-bounce" />
            <span>
              Public Announcer & PA System: Calling Token <strong className="font-mono text-sm">{calledFarmerToken}</strong> to Weighbridge Counter 2!
            </span>
          </div>
          <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded">PA Audio Broadcast</span>
        </div>
      )}

      {notificationSent && (
        <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-700" />
          <span>Broadcast SMS and Push Alert successfully dispatched to all 23 waiting farmers in Pauri yard!</span>
        </div>
      )}

      {/* Capacity Threshold Alert */}
      {capacity >= 90 && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">⚠ High Centre Load ({capacity}%)</h4>
              <p className="text-xs opacity-90">{t.highLoadAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCapacityModal(true)}
            className="btn-secondary text-xs py-1.5 px-3 bg-white font-bold text-amber-900"
          >
            Manage Capacity
          </button>
        </div>
      )}

      {capacity < 50 && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-950 flex items-center space-x-3 text-xs">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <div>
            <strong>✓ Capacity Available ({capacity}%):</strong> {t.normalLoadMsg}
          </div>
        </div>
      )}

      {/* 4 Dashboard Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Centre Capacity */}
        <div className="card-surface p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.centreCapacity}
            </span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-2">
            {capacity}%
          </p>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full ${capacity > 85 ? 'bg-red-500' : capacity > 70 ? 'bg-amber-500' : 'bg-green-600'}`}
              style={{ width: `${capacity}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Target threshold: ≤85%
          </span>
        </div>

        {/* Farmers Served */}
        <div className="card-surface p-5 border-l-4 border-l-green-600">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.farmersServed}
            </span>
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-2">
            {served}
          </p>
          <span className="text-xs text-green-700 font-bold block mt-3">
            ↑ +18 farmers since 09:00 AM
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Daily Target: 200 farmers
          </span>
        </div>

        {/* Waiting in Yard */}
        <div className="card-surface p-5 border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.waiting}
            </span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-2">
            {waiting}
          </p>
          <span className="text-xs text-blue-700 font-bold block mt-3">
            Avg Turnaround: 35 mins
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Now Serving: {nowServing}
          </span>
        </div>

        {/* Procurement Progress */}
        <div className="card-surface p-5 border-l-4 border-l-agri-700">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.procurementProgress}
            </span>
            <TrendingUp className="w-4 h-4 text-agri-700" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-agri-900 font-mono mt-2">
            {progress}%
          </p>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-agri-600 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            1,752 Qtl Procured Today
          </span>
        </div>
      </div>

      {/* Operator Control Action Bar (Zero Dead Buttons!) */}
      <div className="card-surface p-5 bg-slate-900 text-white space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-400 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4" />
            <span>Command Center Real-Time Controls</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Every button updates live system state
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {/* 1. Mark Next Farmer Served */}
          <button
            onClick={() => advanceQueue()}
            disabled={isLoading}
            className="btn-primary text-xs py-2 px-3.5 bg-agri-600 hover:bg-agri-500 font-bold shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            <span>{t.markNextFarmerServed}</span>
          </button>

          {/* 2. Add Farmer */}
          <button
            onClick={() => alert("Simulated Mandi Spot Registration: Token A129 generated for spot arrival farmer.")}
            className="btn-secondary text-xs py-2 px-3 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 font-bold"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
            <span>Add Spot Farmer (तत्काल)</span>
          </button>

          {/* 3. Update Capacity */}
          <button
            onClick={() => setShowCapacityModal(true)}
            className="btn-secondary text-xs py-2 px-3 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 font-bold"
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
            <span>{t.updateCapacity} ({capacity}%)</span>
          </button>

          {/* 4. Notify Waiting Farmers */}
          <button
            onClick={handleNotifyWaiting}
            className="btn-secondary text-xs py-2 px-3 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 font-bold"
          >
            <Bell className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
            <span>Notify Waiting Farmers</span>
          </button>

          {/* 5. Pause / Resume */}
          <button
            onClick={() => toggleQueuePause()}
            className="btn-secondary text-xs py-2 px-3 bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 font-bold"
          >
            <Pause className="w-3.5 h-3.5 mr-1.5" />
            <span>{t.pauseProcurement} / Resume</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Live Workspace */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'queue' ? 'border-agri-700 text-agri-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? 'लाइव कतार तालिका' : 'Live Yard Queue Table'}
        </button>
        <button
          onClick={() => setActiveTab('weighing')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'weighing' ? 'border-agri-700 text-agri-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? 'कांटा तौल कंसोल (Gross-Tare)' : 'Weighbridge Console'}
        </button>
        <button
          onClick={() => setActiveTab('grading')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'grading' ? 'border-agri-700 text-agri-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? 'गुणवत्ता एवं ग्रेडिंग लैब' : 'Quality Grading Lab'}
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'payment' ? 'border-agri-700 text-agri-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? 'डीबीटी बिल एवं भुगतान' : 'DBT Settlement Desk'}
        </button>
      </div>

      {/* Tab Content 1: Live Queue Table */}
      {activeTab === 'queue' && (
        <div className="card-surface overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">
              Today's Yard Entry & Counter Assignment Table
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Now Serving Counter 1: <strong>{nowServing}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Token</th>
                  <th className="px-5 py-3">Farmer</th>
                  <th className="px-5 py-3">Crop</th>
                  <th className="px-5 py-3">Slot</th>
                  <th className="px-5 py-3">Position</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Operator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {queueRows.map(row => {
                  const isVicky = row.token === "A127";
                  return (
                    <tr key={row.token} className={`transition-colors ${isVicky ? 'bg-agri-50/50 font-semibold' : 'hover:bg-slate-50'}`}>
                      <td className="px-5 py-3 font-mono font-bold text-slate-900">
                        {row.token}
                        {isVicky && <span className="ml-1.5 text-[9px] bg-agri-600 text-white px-1.5 py-0.2 rounded">DEMO</span>}
                      </td>
                      <td className="px-5 py-3 text-slate-900">{row.farmer}</td>
                      <td className="px-5 py-3">{row.crop}</td>
                      <td className="px-5 py-3 font-mono">{row.slot}</td>
                      <td className="px-5 py-3 font-mono font-bold text-slate-900">{row.pos}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.status === 'Weighing' ? 'bg-green-100 text-green-800' :
                          row.status === 'Grading' ? 'bg-blue-100 text-blue-800' :
                          row.status === 'Payment' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleCallFarmer(row.token)}
                            className="btn-secondary text-[11px] py-1 px-2.5 font-bold"
                            title="Call farmer to counter via PA"
                          >
                            <PhoneCall className="w-3 h-3 mr-1 text-slate-600" />
                            <span>{t.callFarmer}</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('weighing')}
                            className="btn-secondary text-[11px] py-1 px-2 font-bold"
                            title="Weigh"
                          >
                            <Scale className="w-3 h-3 text-agri-700" />
                          </button>

                          <button
                            onClick={() => setActiveTab('grading')}
                            className="btn-secondary text-[11px] py-1 px-2 font-bold"
                            title="Grade"
                          >
                            <Award className="w-3 h-3 text-blue-600" />
                          </button>

                          <button
                            onClick={() => setActiveTab('payment')}
                            className="btn-secondary text-[11px] py-1 px-2 font-bold"
                            title="Process Payment"
                          >
                            <CreditCard className="w-3 h-3 text-amber-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Weighing Console */}
      {activeTab === 'weighing' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
            <span>Operator Weighbridge Console • Active for Token <strong>{myBooking?.token || "A127"}</strong> (Vicky Kumar)</span>
            <button onClick={() => setActiveTab('grading')} className="btn-secondary text-xs py-1 px-2.5 font-bold">
              Next: Go to Quality Lab →
            </button>
          </div>
          <WeighingModule isOperator={true} />
        </div>
      )}

      {/* Tab Content 3: Quality Lab */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
            <span>Quality Inspection Lab • Moisture Meter & Grading Certificate</span>
            <button onClick={() => setActiveTab('payment')} className="btn-secondary text-xs py-1 px-2.5 font-bold">
              Next: Go to DBT Desk →
            </button>
          </div>
          <GradingModule isOperator={true} />
        </div>
      )}

      {/* Tab Content 4: Payment Desk */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span>Direct Benefit Transfer Settlement Desk • Authorization</span>
          </div>
          <PaymentModule isOperator={true} />
        </div>
      )}

      {/* Capacity Modal */}
      {showCapacityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-modal max-w-sm w-full p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Update Centre Capacity
            </h3>
            <p className="text-xs text-slate-500">
              Set current mandi yard load percentage. Values &gt; 90% trigger safety alerts.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Load Percentage: {capacityInput}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={capacityInput}
                onChange={(e) => setCapacityInput(Number(e.target.value))}
                className="w-full accent-agri-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>10% (Low)</span>
                <span>82% (Normal)</span>
                <span>100% (Full)</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCapacityModal(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                onClick={handleCapacitySave}
                className="btn-primary text-xs py-1.5 px-4 font-bold"
              >
                Update & Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
