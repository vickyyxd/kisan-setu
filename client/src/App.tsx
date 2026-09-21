import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { QueueProvider } from './context/QueueContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SmsAlertModal } from './components/common/SmsAlertModal';
import { DemoControlBar } from './components/demo/DemoControlBar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { DigitalTokenPage } from './pages/DigitalTokenPage';
import { LiveQueuePage } from './pages/LiveQueuePage';
import { ProcurementJourneyPage } from './pages/ProcurementJourneyPage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { ProcurementHistoryPage } from './pages/ProcurementHistoryPage';
import { CentreDiscoveryPage } from './pages/CentreDiscoveryPage';
import { OperatorDashboardPage } from './pages/OperatorDashboardPage';
import { OperatorAnalyticsPage } from './pages/OperatorAnalyticsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OfflineProvider>
          <QueueProvider>
            <ToastProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans">
                  {/* Offline Connectivity Banner */}
                  <OfflineBanner />

                  {/* Main Minimalist Header */}
                  <Navbar />

                  {/* Active Page View */}
                  <main className="flex-1 pb-24">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/farmer-login" element={<LoginPage />} />
                      <Route path="/operator-login" element={<LoginPage />} />
                      <Route path="/dashboard" element={<FarmerDashboard />} />
                      <Route path="/book" element={<SlotBookingPage />} />
                      <Route path="/token" element={<DigitalTokenPage />} />
                      <Route path="/queue" element={<LiveQueuePage />} />
                      <Route path="/procurement" element={<ProcurementJourneyPage />} />
                      <Route path="/payment" element={<PaymentStatusPage />} />
                      <Route path="/profile" element={<FarmerProfilePage />} />
                      <Route path="/history" element={<ProcurementHistoryPage />} />
                      <Route path="/centres" element={<CentreDiscoveryPage />} />
                      <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
                      <Route path="/operator/analytics" element={<OperatorAnalyticsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>

                  {/* Minimalist Footer */}
                  <Footer />

                  {/* Offline SMS Preview Modal */}
                  <SmsAlertModal />

                  {/* Floating 10-Step SIH Hackathon Demo Controller */}
                  <DemoControlBar />
                </div>
              </Router>
            </ToastProvider>
          </QueueProvider>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
