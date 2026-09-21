export type Language = 'en' | 'hi';

export interface Farmer {
  id: string;
  farmerId: string;
  name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  landHoldingAcre: number;
  preferredCrop: string;
  language: Language;
  bankAccount: string;
  ifsc: string;
  verified: boolean;
  registeredDate: string;
}

export interface Counter {
  id: string;
  name: string;
  activeToken: string | null;
  status: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  nameHi?: string;
  district: string;
  state: string;
  location: string;
  distanceKm: number;
  totalCapacityPerDay: number;
  currentLoadPercent: number;
  farmersServedToday: number;
  farmersWaitingToday: number;
  status: string;
  operationalHours: string;
  counters: Counter[];
  cropsAccepted: string[];
  mspRates: Record<string, number>;
}

export type BookingStatus = 
  | 'Slot Confirmed'
  | 'Waiting'
  | 'At Counter'
  | 'Weighing'
  | 'Grading'
  | 'Procurement Complete'
  | 'Payment Completed'
  | 'Rejected';

export interface Booking {
  id: string;
  token: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  centreId: string;
  centreName: string;
  crop: string;
  date: string;
  timeSlot: string;
  queuePosition: number;
  farmersAhead: number;
  estimatedTurn: string;
  estimatedWaitingMinutes?: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Procurement {
  id: string;
  bookingId: string;
  token: string;
  farmerId: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  moisture: number;
  foreignMatter: number;
  grade: 'A' | 'B' | 'C' | 'Rejected';
  mspPerQuintal: number;
  totalAmount: number;
  status: 'Pending' | 'Weighed' | 'Graded' | 'Completed' | 'Rejected';
  updatedAt: string;
}

export interface Payment {
  id: string;
  procurementId: string;
  bookingId: string;
  farmerId: string;
  token: string;
  amount: number;
  ratePerKg: number;
  netWeightKg: number;
  grade: string;
  crop: string;
  transactionId: string;
  status: 'Pending' | 'Procurement Accepted' | 'Bill Generated' | 'Payment Processing' | 'Payment Completed';
  paymentMode: string;
  accountNumber: string;
  date: string;
}

export interface AppNotification {
  id: string;
  farmerId: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  type: 'info' | 'success' | 'warning' | 'urgent' | 'error';
  read: boolean;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  centre: string;
  crop: string;
  netWeight: number;
  grade: string;
  amount: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  transactionId: string;
  farmerId: string;
}
