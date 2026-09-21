import { Booking, ProcurementCentre, Procurement, Payment, AppNotification, HistoryRecord } from '../types';

const INITIAL_CENTRE: ProcurementCentre = {
  id: "centre-01",
  name: "Pauri Procurement Centre",
  nameHi: "पौड़ी खरीद केंद्र",
  district: "Pauri Garhwal",
  state: "Uttarakhand",
  location: "Mandi Samiti Campus, Main Road, Pauri",
  distanceKm: 12,
  totalCapacityPerDay: 200,
  currentLoadPercent: 82,
  farmersServedToday: 146,
  farmersWaitingToday: 23,
  status: "Open",
  operationalHours: "08:00 AM - 05:00 PM",
  counters: [
    { id: "counter-1", name: "Weighbridge 1", activeToken: "A119", status: "Weighing" },
    { id: "counter-2", name: "Quality Lab 2", activeToken: "A120", status: "Grading" },
    { id: "counter-3", name: "Settlement Desk", activeToken: null, status: "Available" }
  ],
  cropsAccepted: ["Wheat", "Rice", "Maize", "Mandua (Finger Millet)"],
  mspRates: {
    "Wheat": 2300,
    "Rice": 2200,
    "Maize": 2090,
    "Mandua (Finger Millet)": 4290
  }
};

const INITIAL_BOOKING: Booking = {
  id: "bk-127",
  token: "A127",
  farmerId: "f-001",
  farmerName: "Vicky Kumar",
  farmerMobile: "9876543210",
  centreId: "centre-01",
  centreName: "Pauri Procurement Centre",
  crop: "Wheat",
  date: "15 September 2026",
  timeSlot: "11:00 AM – 12:00 PM",
  queuePosition: 8,
  farmersAhead: 7,
  estimatedTurn: "11:40 AM",
  status: "Slot Confirmed",
  createdAt: "2026-09-14T18:30:00.000Z"
};

const INITIAL_PROCUREMENT: Procurement = {
  id: "proc-127",
  bookingId: "bk-127",
  token: "A127",
  farmerId: "f-001",
  grossWeight: 1250,
  tareWeight: 50,
  netWeight: 1200,
  moisture: 12.0,
  foreignMatter: 1.5,
  grade: "A",
  mspPerQuintal: 2300,
  totalAmount: 27600,
  status: "Pending",
  updatedAt: "2026-09-15T05:40:00.000Z"
};

const INITIAL_PAYMENT: Payment = {
  id: "pay-127",
  procurementId: "proc-127",
  bookingId: "bk-127",
  farmerId: "f-001",
  token: "A127",
  amount: 27600,
  ratePerKg: 23,
  netWeightKg: 1200,
  grade: "A",
  crop: "Wheat",
  transactionId: "KS2026091500127",
  status: "Pending",
  paymentMode: "Direct Benefit Transfer (DBT) via PFMS",
  accountNumber: "SBI •••• 4512",
  date: "15 Sep 2026"
};

const INITIAL_HISTORY: HistoryRecord[] = [
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
];

class StandaloneDatabase {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(`kisan_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T) {
    try {
      localStorage.setItem(`kisan_${key}`, JSON.stringify(value));
    } catch {}
  }

  getCentre(): ProcurementCentre {
    return this.getStorage('centre', INITIAL_CENTRE);
  }

  getNowServing(): string {
    return this.getStorage('nowServing', 'A119');
  }

  getBooking(): Booking {
    return this.getStorage('booking', INITIAL_BOOKING);
  }

  getProcurement(): Procurement {
    return this.getStorage('procurement', INITIAL_PROCUREMENT);
  }

  getPayment(): Payment {
    return this.getStorage('payment', INITIAL_PAYMENT);
  }

  getHistory(): HistoryRecord[] {
    return this.getStorage('history', INITIAL_HISTORY);
  }

  advanceQueue(): { nowServing: string; booking: Booking; centre: ProcurementCentre } {
    const booking = this.getBooking();
    const centre = this.getCentre();
    let nowServing = this.getNowServing();

    if (booking.queuePosition > 1) {
      booking.queuePosition -= 1;
      booking.farmersAhead = Math.max(0, booking.queuePosition - 1);
      if (booking.queuePosition === 1) {
        booking.status = "At Counter";
        nowServing = "A127";
      }
    } else if (booking.queuePosition === 1) {
      booking.status = "Weighing";
    }

    const tokenNum = parseInt(nowServing.replace(/\D/g, '')) || 119;
    if (booking.queuePosition > 1) {
      nowServing = `A${tokenNum + 1}`;
    }

    centre.farmersServedToday += 1;
    centre.farmersWaitingToday = Math.max(0, centre.farmersWaitingToday - 1);

    this.setStorage('booking', booking);
    this.setStorage('centre', centre);
    this.setStorage('nowServing', nowServing);

    return { nowServing, booking, centre };
  }

  recordWeighing(gross: number, tare: number): Procurement {
    const proc = this.getProcurement();
    const net = Math.max(0, gross - tare);
    proc.grossWeight = gross;
    proc.tareWeight = tare;
    proc.netWeight = net;
    proc.totalAmount = Math.round((net / 100) * (proc.mspPerQuintal || 2300));
    proc.status = "Weighed";

    const booking = this.getBooking();
    booking.status = "Weighing";

    this.setStorage('procurement', proc);
    this.setStorage('booking', booking);
    return proc;
  }

  recordGrading(moisture: number, foreignMatter: number, grade: 'A' | 'B' | 'C' | 'Rejected'): Procurement {
    const proc = this.getProcurement();
    proc.moisture = moisture;
    proc.foreignMatter = foreignMatter;
    proc.grade = grade;
    const msp = grade === 'A' ? 2300 : grade === 'B' ? 2200 : grade === 'C' ? 2050 : 0;
    proc.mspPerQuintal = msp;
    proc.totalAmount = Math.round((proc.netWeight / 100) * msp);
    proc.status = grade === 'Rejected' ? 'Rejected' : 'Graded';

    const booking = this.getBooking();
    booking.status = grade === 'Rejected' ? 'Rejected' : 'Grading';

    this.setStorage('procurement', proc);
    this.setStorage('booking', booking);
    return proc;
  }

  completeProcurement(): { procurement: Procurement; payment: Payment } {
    const proc = this.getProcurement();
    proc.status = "Completed";

    const booking = this.getBooking();
    booking.status = "Procurement Complete";

    const payment = this.getPayment();
    payment.status = "Bill Generated";
    payment.amount = proc.totalAmount;
    payment.netWeightKg = proc.netWeight;
    payment.grade = proc.grade;

    this.setStorage('procurement', proc);
    this.setStorage('booking', booking);
    this.setStorage('payment', payment);

    return { procurement: proc, payment };
  }

  processPayment(): Payment {
    const payment = this.getPayment();
    payment.status = "Payment Completed";

    const booking = this.getBooking();
    booking.status = "Payment Completed";

    this.setStorage('payment', payment);
    this.setStorage('booking', booking);
    return payment;
  }

  updateCapacity(percent: number): ProcurementCentre {
    const centre = this.getCentre();
    centre.currentLoadPercent = percent;
    this.setStorage('centre', centre);
    return centre;
  }

  reset(): void {
    this.setStorage('centre', INITIAL_CENTRE);
    this.setStorage('nowServing', 'A119');
    this.setStorage('booking', INITIAL_BOOKING);
    this.setStorage('procurement', INITIAL_PROCUREMENT);
    this.setStorage('payment', INITIAL_PAYMENT);
    this.setStorage('history', INITIAL_HISTORY);
  }
}

export const standaloneDb = new StandaloneDatabase();
