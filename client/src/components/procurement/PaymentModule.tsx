import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Building2,
  AlertCircle
} from 'lucide-react';

interface PaymentModuleProps {
  isOperator?: boolean;
}

export const PaymentModule: React.FC<PaymentModuleProps> = ({ isOperator = false }) => {
  const { payment, procurement, myBooking, processPayment, isLoading } = useQueue();
  const { language, t } = useLanguage();

  const amount = payment?.amount || procurement?.totalAmount || 27600;
  const status = payment?.status || "Payment Completed";
  const transactionId = payment?.transactionId || "KS2026091500127";
  const date = payment?.date || "15 Sep 2026";
  const farmerName = myBooking?.farmerName || "Vicky Kumar";
  const token = myBooking?.token || "A127";
  const netWeight = payment?.netWeightKg || procurement?.netWeight || 1200;
  const crop = payment?.crop || myBooking?.crop || "Wheat";
  const grade = payment?.grade || procurement?.grade || "A";

  const stages = [
    { key: "Procurement Accepted", label: t.procurementAccepted, done: true },
    { key: "Bill Generated", label: t.billGenerated, done: true },
    { key: "Payment Processing", label: t.paymentProcessing, done: status === "Payment Processing" || status === "Payment Completed" },
    { key: "Payment Completed", label: t.paymentCompleted, done: status === "Payment Completed" }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 4-Stage Visual Progress */}
      <div className="card-surface p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-agri-700" />
            <span>{t.paymentStatus}</span>
          </h3>

          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
            Token: {token}
          </span>
        </div>

        {/* Timeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100 relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                stage.done 
                  ? 'bg-agri-600 text-white shadow-sm ring-4 ring-agri-100' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {stage.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-xs font-bold ${stage.done ? 'text-slate-900' : 'text-slate-400'}`}>
                {stage.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {stage.done ? (language === 'hi' ? 'सत्यापित' : 'Completed') : (language === 'hi' ? 'प्रतीक्षारत' : 'Pending')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill & Payment Receipt Card */}
      <div id="printable-token" className="card-surface p-6 sm:p-8 border-2 border-agri-200/80 bg-linear-to-b from-white to-agri-50/30 shadow-md">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-agri-700 text-white font-black text-xs px-2.5 py-1 rounded">
                KISAN SETU
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                PFMS / DBT Settlement Advice
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              ₹ {amount.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-green-700 font-bold flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment Successful • Direct Benefit Transfer Credited</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right">
            <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-1 rounded border border-amber-300">
              {t.demoPaymentNotice}
            </span>
            <button
              onClick={handlePrint}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रसीद प्रिंट करें' : 'Print Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Receipt Details Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'लाभार्थी किसान' : 'Beneficiary Farmer'}
            </span>
            <span className="font-bold text-slate-900 text-sm">{farmerName}</span>
            <span className="text-slate-500 block text-[11px]">ID: KS-F-00127</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'लेनदेन संदर्भ संख्या (UTR)' : 'Transaction ID / UTR'}
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">{transactionId}</span>
            <span className="text-slate-500 block text-[11px]">Bank: State Bank of India</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'जमा बैंक खाता' : 'Credited Bank Account'}
            </span>
            <span className="font-bold text-slate-900 text-sm">SBI •••• 4512</span>
            <span className="text-slate-500 block text-[11px]">IFSC: SBIN0001234</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'खरीदी गई फसल एवं ग्रेड' : 'Crop & Certified Grade'}
            </span>
            <span className="font-bold text-slate-900 text-sm">{crop} (Grade {grade})</span>
            <span className="text-slate-500 block text-[11px]">Fair Average Quality</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'प्रमाणित शुद्ध वजन' : 'Certified Net Weight'}
            </span>
            <span className="font-bold text-slate-900 text-sm font-mono">{netWeight} kg</span>
            <span className="text-slate-500 block text-[11px]">{(netWeight / 100).toFixed(2)} Quintals</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
              {language === 'hi' ? 'भुगतान तिथि' : 'Settlement Date'}
            </span>
            <span className="font-bold text-slate-900 text-sm">{date}</span>
            <span className="text-slate-500 block text-[11px]">Pauri Procurement Centre</span>
          </div>
        </div>

        {/* Security & Authenticity Banner */}
        <div className="mt-8 p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-agri-700 shrink-0" />
            <span>
              {language === 'hi'
                ? 'यह रसीद खाद्य नागरिक आपूर्ति एवं उपभोक्ता मामले विभाग, उत्तराखंड शासन द्वारा डिजिटल रूप से उत्पन्न है।'
                : 'Digitally verified PFMS payment advice generated by Dept of Food, Civil Supplies & Consumer Affairs.'}
            </span>
          </div>
          <span className="font-mono text-slate-400 text-[10px] hidden md:inline">
            SHA256: 9e3a...b71c
          </span>
        </div>
      </div>

      {isOperator && (
        <div className="card-surface p-4 flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {language === 'hi' ? 'संचालक क्रिया: भुगतान प्रक्रिया को पूर्ण करें' : 'Operator Control: Trigger Final DBT Simulation'}
          </span>
          <button
            onClick={() => processPayment()}
            disabled={isLoading}
            className="btn-primary text-xs bg-green-700 hover:bg-green-800"
          >
            ✓ {language === 'hi' ? 'डीबीटी भुगतान पुष्टि जारी करें' : 'Process Direct DBT Credit'}
          </button>
        </div>
      )}
    </div>
  );
};
