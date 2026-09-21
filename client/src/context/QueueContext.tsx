import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Booking, ProcurementCentre, Procurement, Payment, AppNotification } from '../types';
import { standaloneDb } from '../services/localDb';

interface QueueContextType {
  centre: ProcurementCentre | null;
  nowServing: string;
  myBooking: Booking | null;
  waitingList: Booking[];
  activeList: Booking[];
  procurement: Procurement | null;
  payment: Payment | null;
  notifications: AppNotification[];
  isLoading: boolean;
  activeAlert: { title: string; message: string; type: 'info' | 'warning' | 'urgent' } | null;
  clearActiveAlert: () => void;
  advanceQueue: () => Promise<void>;
  recordWeighing: (gross: number, tare: number) => Promise<void>;
  recordGrading: (moisture: number, foreignMatter: number, grade: 'A' | 'B' | 'C' | 'Rejected') => Promise<void>;
  completeProcurement: () => Promise<void>;
  processPayment: () => Promise<void>;
  updateCentreCapacity: (newPercent: number) => Promise<void>;
  toggleQueuePause: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  refreshAll: () => Promise<void>;
  demoStep: number;
  setDemoStep: (step: number) => void;
  runDemoStep: (step: number) => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [centre, setCentre] = useState<ProcurementCentre | null>(() => standaloneDb.getCentre());
  const [nowServing, setNowServing] = useState<string>(() => standaloneDb.getNowServing());
  const [myBooking, setMyBooking] = useState<Booking | null>(() => standaloneDb.getBooking());
  const [waitingList, setWaitingList] = useState<Booking[]>([]);
  const [activeList, setActiveList] = useState<Booking[]>([]);
  const [procurement, setProcurement] = useState<Procurement | null>(() => standaloneDb.getProcurement());
  const [payment, setPayment] = useState<Payment | null>(() => standaloneDb.getPayment());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{ title: string; message: string; type: 'info' | 'warning' | 'urgent' } | null>(null);
  const [demoStep, setDemoStep] = useState(1);
  const [socket, setSocket] = useState<Socket | null>(null);

  const clearActiveAlert = () => setActiveAlert(null);

  const updateAlertsForBooking = (b: Booking) => {
    const ahead = b.farmersAhead;
    const pos = b.queuePosition;
    if (pos === 1 && b.status !== "Payment Completed") {
      setActiveAlert({
        title: "🎯 Your turn is now!",
        message: "Proceed immediately to Counter 2 (Weighbridge).",
        type: "urgent"
      });
    } else if (ahead === 2) {
      setActiveAlert({
        title: "🚜 Your turn is near.",
        message: "2 farmers ahead of you. Please proceed towards the procurement counter.",
        type: "warning"
      });
    } else if (ahead === 5) {
      setActiveAlert({
        title: "🔔 Your turn is approaching.",
        message: "5 farmers are ahead of you. Please prepare to proceed to the centre.",
        type: "info"
      });
    }
  };

  // Fetch all live data with automatic fallback to standaloneDb
  const refreshAll = useCallback(async () => {
    try {
      const qRes = await fetch('/api/queue/centre-01');
      if (qRes.ok) {
        const qData = await qRes.json();
        setCentre(qData.centre);
        setNowServing(qData.nowServing);
        setWaitingList(qData.waitingList || []);
        setActiveList(qData.activeList || []);
      }

      const bRes = await fetch('/api/bookings/bk-127');
      if (bRes.ok) {
        const bData = await bRes.json();
        setMyBooking(bData.booking);
        if (bData.booking) updateAlertsForBooking(bData.booking);
      }

      const pRes = await fetch('/api/procurement/bk-127');
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.procurement) setProcurement(pData.procurement);
      }

      const payRes = await fetch('/api/payments/bk-127');
      if (payRes.ok) {
        const payData = await payRes.json();
        if (payData.payment) setPayment(payData.payment);
      }

      const notifRes = await fetch('/api/notifications/f-001');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }
    } catch {
      // Backend not running: use client-side standalone database
      const c = standaloneDb.getCentre();
      const b = standaloneDb.getBooking();
      const ns = standaloneDb.getNowServing();
      const p = standaloneDb.getProcurement();
      const pay = standaloneDb.getPayment();
      setCentre(c);
      setMyBooking(b);
      setNowServing(ns);
      setProcurement(p);
      setPayment(pay);
      updateAlertsForBooking(b);
    }
  }, []);

  // Setup Socket.IO connection
  useEffect(() => {
    refreshAll();

    try {
      const socketClient = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 3000
      });

      socketClient.on('queueUpdated', (data) => {
        setNowServing(data.nowServing);
        if (data.centre) setCentre(data.centre);
        if (data.vickyBooking) {
          setMyBooking(data.vickyBooking);
          updateAlertsForBooking(data.vickyBooking);
        }
        refreshAll();
      });

      socketClient.on('procurementUpdated', (data) => {
        if (data.procurement) setProcurement(data.procurement);
        if (data.booking) setMyBooking(data.booking);
        refreshAll();
      });

      socketClient.on('procurementCompleted', (data) => {
        if (data.procurement) setProcurement(data.procurement);
        if (data.payment) setPayment(data.payment);
        refreshAll();
      });

      socketClient.on('paymentUpdated', (data) => {
        if (data.payment) setPayment(data.payment);
        refreshAll();
      });

      socketClient.on('demoReset', () => {
        refreshAll();
      });

      setSocket(socketClient);

      return () => {
        socketClient.disconnect();
      };
    } catch {
      // Socket.IO optional
    }
  }, [refreshAll]);

  // Advance Queue with hybrid support
  const advanceQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/centre-01/advance', { method: 'POST' });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}
    
    // Standalone fallback
    const res = standaloneDb.advanceQueue();
    setNowServing(res.nowServing);
    setMyBooking(res.booking);
    setCentre(res.centre);
    updateAlertsForBooking(res.booking);
    setIsLoading(false);
  };

  // Record Weighing with hybrid support
  const recordWeighing = async (gross: number, tare: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/procurement/bk-127/weigh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grossWeight: gross, tareWeight: tare })
      });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}

    // Standalone fallback
    const proc = standaloneDb.recordWeighing(gross, tare);
    setProcurement(proc);
    setMyBooking(standaloneDb.getBooking());
    setIsLoading(false);
  };

  // Record Grading with hybrid support
  const recordGrading = async (moisture: number, foreignMatter: number, grade: 'A' | 'B' | 'C' | 'Rejected') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/procurement/bk-127/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moisture, foreignMatter, grade })
      });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}

    const proc = standaloneDb.recordGrading(moisture, foreignMatter, grade);
    setProcurement(proc);
    setMyBooking(standaloneDb.getBooking());
    setIsLoading(false);
  };

  // Complete Procurement with hybrid support
  const completeProcurement = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/procurement/bk-127/complete', { method: 'POST' });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}

    const res = standaloneDb.completeProcurement();
    setProcurement(res.procurement);
    setPayment(res.payment);
    setMyBooking(standaloneDb.getBooking());
    setIsLoading(false);
  };

  // Process Payment with hybrid support
  const processPayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments/bk-127/process', { method: 'POST' });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}

    const pay = standaloneDb.processPayment();
    setPayment(pay);
    setMyBooking(standaloneDb.getBooking());
    setIsLoading(false);
  };

  // Update Centre Capacity
  const updateCentreCapacity = async (newPercent: number) => {
    try {
      const res = await fetch('/api/centres/centre-01/capacity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadPercent: newPercent })
      });
      if (res.ok) {
        await refreshAll();
        return;
      }
    } catch {}

    const c = standaloneDb.updateCapacity(newPercent);
    setCentre(c);
  };

  // Toggle Pause
  const toggleQueuePause = async () => {
    try {
      await fetch('/api/queue/centre-01/toggle-pause', { method: 'POST' });
      await refreshAll();
    } catch {}
  };

  // Reset Demo Data
  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
    } catch {}
    standaloneDb.reset();
    setDemoStep(1);
    await refreshAll();
    setIsLoading(false);
  };

  // Interactive 10-Step Demo Controller
  const runDemoStep = async (step: number) => {
    setDemoStep(step);
    switch (step) {
      case 1:
        await resetDemoData();
        break;
      case 2:
        await refreshAll();
        break;
      case 3:
        await advanceQueue();
        await advanceQueue();
        await advanceQueue();
        break;
      case 4:
        await advanceQueue();
        await advanceQueue();
        await advanceQueue();
        break;
      case 5:
        await advanceQueue();
        break;
      case 6:
        await recordWeighing(1250, 50);
        break;
      case 7:
        await recordGrading(12.0, 1.5, 'A');
        break;
      case 8:
        await completeProcurement();
        break;
      case 9:
        await processPayment();
        break;
      case 10:
        await refreshAll();
        break;
      default:
        break;
    }
  };

  return (
    <QueueContext.Provider
      value={{
        centre,
        nowServing,
        myBooking,
        waitingList,
        activeList,
        procurement,
        payment,
        notifications,
        isLoading,
        activeAlert,
        clearActiveAlert,
        advanceQueue,
        recordWeighing,
        recordGrading,
        completeProcurement,
        processPayment,
        updateCentreCapacity,
        toggleQueuePause,
        resetDemoData,
        refreshAll,
        demoStep,
        setDemoStep,
        runDemoStep
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within QueueProvider');
  return context;
};
