import React from 'react';
import { PaymentModule } from '../components/procurement/PaymentModule';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { CreditCard, History } from 'lucide-react';

export const PaymentStatusPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.paymentStatus}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं प्रमाणित भुगतान सलाह'
              : 'Direct Benefit Transfer (DBT) settlement & official payment receipt'}
          </p>
        </div>

        <Link
          to="/history"
          className="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto font-bold"
        >
          <History className="w-4 h-4 text-slate-600" />
          <span>{language === 'hi' ? 'पिछला भुगतान इतिहास' : 'View Past Payments'}</span>
        </Link>
      </div>

      <PaymentModule isOperator={false} />
    </div>
  );
};
