import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HistoryRecord } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText,
  Building2,
  Wheat
} from 'lucide-react';

export const ProcurementHistoryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [cropFilter, setCropFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('/api/history/all')
      .then(res => res.json())
      .then(data => {
        if (data.history) setHistory(data.history);
      })
      .catch(() => {
        // fallback demo records
        setHistory([
          {
            id: "hist-01",
            date: "15 Sep 2026",
            centre: "Pauri Procurement Centre",
            crop: "Wheat",
            netWeight: 1200,
            grade: "A",
            amount: 27600,
            paymentStatus: "Paid",
            transactionId: "KS2026091500127",
            farmerId: "f-001"
          },
          {
            id: "hist-02",
            date: "02 Sep 2026",
            centre: "Pauri Procurement Centre",
            crop: "Wheat",
            netWeight: 1450,
            grade: "A",
            amount: 33350,
            paymentStatus: "Paid",
            transactionId: "KS2026090200041",
            farmerId: "f-001"
          },
          {
            id: "hist-03",
            date: "18 Aug 2026",
            centre: "Pauri Procurement Centre",
            crop: "Mandua (Finger Millet)",
            netWeight: 600,
            grade: "A",
            amount: 25740,
            paymentStatus: "Paid",
            transactionId: "KS2026081800098",
            farmerId: "f-001"
          },
          {
            id: "hist-04",
            date: "25 Jun 2026",
            centre: "Kotdwar Central Mandi",
            crop: "Wheat",
            netWeight: 1800,
            grade: "B",
            amount: 39600,
            paymentStatus: "Paid",
            transactionId: "KS2026062500115",
            farmerId: "f-001"
          }
        ]);
      });
  }, []);

  const filtered = history.filter(h => {
    const matchesCrop = cropFilter === "all" || h.crop.toLowerCase().includes(cropFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || h.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      h.centre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.crop.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.history}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' 
              ? 'अतीत में संपन्न की गई खरीद, तौल पर्ची, ग्रेड एवं बैंक खाता अंतरण का डिजिटल रिकॉर्ड।' 
              : 'Complete archive of past procurement lots, grain quality certificates, and DBT credits.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto font-bold"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>{language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Export Statement'}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'केंद्र, यूटीआर या फसल खोजें...' : 'Search centre, UTR or crop...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-agri-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto text-xs">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Crop:</span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 outline-none text-slate-800 font-medium"
            >
              <option value="all">All Crops</option>
              <option value="Wheat">Wheat</option>
              <option value="Mandua">Mandua</option>
              <option value="Mustard">Mustard</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 outline-none text-slate-800 font-medium"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table on Desktop / Responsive Cards on Mobile */}
      <div className="card-surface overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Centre</th>
                <th className="px-6 py-3.5">Crop</th>
                <th className="px-6 py-3.5">Quantity (Net)</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Amount (₹)</th>
                <th className="px-6 py-3.5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4">{row.centre}</td>
                  <td className="px-6 py-4 font-medium">{row.crop}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{row.netWeight} kg</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                      Grade {row.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black font-mono text-slate-900">₹{row.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.paymentStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (No Horizontal Overflows!) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map(row => (
            <div key={row.id} className="p-4 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm text-slate-900">{row.crop}</span>
                  <p className="text-[11px] text-slate-500">{row.centre}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800">
                  {row.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date:</span>
                  <span className="font-medium text-slate-800">{row.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Net Weight:</span>
                  <span className="font-mono font-bold text-slate-900">{row.netWeight} kg (Grade {row.grade})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 text-[10px]">UTR: {row.transactionId}</span>
                <span className="font-black text-slate-900 text-sm font-mono">₹{row.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
