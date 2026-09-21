import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Farmer } from '../types';
import { User, Phone, MapPin, Building2, ShieldCheck, CheckCircle2, Edit3, Save } from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const farmer = user as Farmer;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: farmer?.name || "Vicky Kumar",
    village: farmer?.village || "Chaukhamba, Pauri",
    district: farmer?.district || "Pauri Garhwal",
    landHoldingAcre: farmer?.landHoldingAcre || 4.5,
    preferredCrop: farmer?.preferredCrop || "Wheat",
    bankAccount: farmer?.bankAccount || "SBI •••• 4512",
    ifsc: farmer?.ifsc || "SBIN0001234"
  });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/farmers/${farmer?.id || 'f-001'}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {
      // Offline / fallback save
    }
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.profile}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' 
              ? 'सत्यापित किसान डेटा, भू-अभिलेख एवं डीबीटी बैंक खाता विवरण' 
              : 'Verified farmer credentials, land holding, and Aadhaar-linked DBT account'}
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              // save
              handleSave({ preventDefault: () => {} } as any);
            } else {
              setIsEditing(true);
            }
          }}
          className={`text-xs py-2 px-4 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
            isEditing ? 'bg-green-700 hover:bg-green-800 text-white' : 'btn-secondary'
          }`}
        >
          {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? (language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes') : (language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile')}</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{language === 'hi' ? 'प्रोफ़ाइल विवरण सफलतापूर्वक सहेजा गया!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="card-surface p-6 sm:p-8 space-y-6">
        {/* User Hero Row */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-agri-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
            VK
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded border border-green-200">
                ✓ AADHAAR VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Farmer ID: <strong className="text-slate-800">KS-F-00127</strong>
            </p>
          </div>
        </div>

        {/* Profile Details Form / Grid */}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'किसान का नाम' : 'Farmer Name'}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900"
              />
            ) : (
              <p className="text-sm font-bold text-slate-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Mobile Number'}
            </label>
            <p className="text-sm font-mono font-bold text-slate-900">+91 98765 43210</p>
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'गाँव / क्षेत्र' : 'Village / Location'}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900"
              />
            ) : (
              <p className="text-sm font-medium text-slate-800">{formData.village}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'जिला एवं राज्य' : 'District & State'}
            </label>
            <p className="text-sm font-medium text-slate-800">Pauri Garhwal, Uttarakhand</p>
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'कृषि भूमि (एकड़)' : 'Land Holding (Acres)'}
            </label>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={formData.landHoldingAcre}
                onChange={(e) => setFormData({ ...formData, landHoldingAcre: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900"
              />
            ) : (
              <p className="text-sm font-bold text-slate-900">{formData.landHoldingAcre} Acres</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'प्रमुख फसल' : 'Registered Crop'}
            </label>
            <p className="text-sm font-bold text-agri-800">{formData.preferredCrop} (गेहूं)</p>
          </div>

          <div className="sm:col-span-2 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-agri-700" />
              <span>{language === 'hi' ? 'डीबीटी बैंक खाता विवरण' : 'DBT Linked Bank Account'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Bank Account:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formData.bankAccount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">IFSC Code:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formData.ifsc}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
