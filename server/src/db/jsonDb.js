const fs = require('fs');
const path = require('path');
const seed = require('./seedData');

const DB_FILE = path.join(__dirname, '../../data/db.json');

class JsonDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.reset();
      }
    } catch (err) {
      console.warn("Could not read db.json, resetting to seed data:", err.message);
      this.reset();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error("Failed to write db.json:", err);
    }
  }

  reset() {
    this.data = {
      farmers: JSON.parse(JSON.stringify(seed.farmers)),
      procurementCentres: JSON.parse(JSON.stringify(seed.procurementCentres)),
      bookings: JSON.parse(JSON.stringify(seed.initialBookings)),
      procurements: JSON.parse(JSON.stringify(seed.initialProcurements)),
      history: JSON.parse(JSON.stringify(seed.initialHistory)),
      payments: JSON.parse(JSON.stringify(seed.initialPayments)),
      notifications: JSON.parse(JSON.stringify(seed.initialNotifications)),
      nowServingToken: "A119",
      queuePaused: false
    };
    this.save();
    return this.data;
  }

  // Getters
  getFarmers() { return this.data.farmers; }
  getFarmerById(id) {
    return this.data.farmers.find(f => f.id === id || f.farmerId === id || f.mobile === id);
  }
  updateFarmer(id, updates) {
    const idx = this.data.farmers.findIndex(f => f.id === id || f.farmerId === id);
    if (idx !== -1) {
      this.data.farmers[idx] = { ...this.data.farmers[idx], ...updates };
      this.save();
      return this.data.farmers[idx];
    }
    return null;
  }

  getCentres() { return this.data.procurementCentres; }
  getCentreById(id) {
    return this.data.procurementCentres.find(c => c.id === id);
  }
  updateCentreCapacity(id, loadPercent) {
    const centre = this.getCentreById(id);
    if (centre) {
      centre.currentLoadPercent = Math.max(0, Math.min(100, loadPercent));
      this.save();
      return centre;
    }
    return null;
  }

  getBookings() { return this.data.bookings; }
  getBookingById(id) {
    return this.data.bookings.find(b => b.id === id || b.token === id);
  }
  getFarmerBookings(farmerId) {
    return this.data.bookings.filter(b => b.farmerId === farmerId || b.farmerMobile === farmerId);
  }

  createBooking(bookingData) {
    const centre = this.getCentreById(bookingData.centreId) || this.data.procurementCentres[0];
    const farmer = this.getFarmerById(bookingData.farmerId) || this.data.farmers[0];
    
    // Generate next token number
    const count = this.data.bookings.length + 128;
    const token = `A${count}`;
    const queuePosition = this.data.bookings.filter(b => b.status === "Slot Confirmed" || b.status === "Waiting").length + 1;

    const newBooking = {
      id: `bk-${Date.now()}`,
      token,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerMobile: farmer.mobile,
      centreId: centre.id,
      centreName: centre.name,
      crop: bookingData.crop || "Wheat",
      date: bookingData.date || "15 September 2026",
      timeSlot: bookingData.timeSlot || "11:00 AM – 12:00 PM",
      queuePosition: queuePosition,
      farmersAhead: Math.max(0, queuePosition - 1),
      estimatedTurn: bookingData.estimatedTurn || "11:45 AM",
      status: "Slot Confirmed",
      createdAt: new Date().toISOString()
    };

    this.data.bookings.push(newBooking);
    
    // Add notification
    this.addNotification({
      farmerId: farmer.id,
      title: "Booking Confirmed",
      titleHi: "बुकिंग की पुष्टि हुई",
      message: `Token ${token} booked for ${newBooking.crop} at ${centre.name}.`,
      messageHi: `टोकन ${token} ${centre.nameHi || centre.name} में ${newBooking.crop} के लिए बुक किया गया।`,
      type: "success"
    });

    this.save();
    return newBooking;
  }

  // Queue Advance Operation
  advanceQueue(centreId = "centre-01") {
    const centre = this.getCentreById(centreId);
    if (!centre) return null;

    // Advance queue:
    // 1. Current "Now Serving" moves forward
    // 2. Vicky Kumar's token A127 steps from 08 -> 07 -> 06 -> 05 ... -> 01
    const vickyBooking = this.data.bookings.find(b => b.token === "A127");
    
    if (vickyBooking) {
      if (vickyBooking.queuePosition > 1) {
        vickyBooking.queuePosition -= 1;
        vickyBooking.farmersAhead = Math.max(0, vickyBooking.queuePosition - 1);
        
        // Recalculate estimated turn
        const minutesPerTurn = 5;
        const totalWaitMin = vickyBooking.farmersAhead * minutesPerTurn;
        vickyBooking.estimatedWaitingMinutes = totalWaitMin;
        
        if (vickyBooking.queuePosition === 1) {
          vickyBooking.status = "At Counter";
          this.data.nowServingToken = "A127";
          this.addNotification({
            farmerId: vickyBooking.farmerId,
            title: "🎯 Your turn is now!",
            titleHi: "🎯 आपकी बारी आ गई है!",
            message: "Please proceed immediately to Counter 2 (Weighbridge).",
            messageHi: "कृपया तुरंत काउंटर 2 (तौल केंद्र) पर जाएं।",
            type: "urgent"
          });
        } else if (vickyBooking.farmersAhead === 2) {
          this.addNotification({
            farmerId: vickyBooking.farmerId,
            title: "🚜 Your turn is near!",
            titleHi: "🚜 आपकी बारी पास है!",
            message: "2 farmers ahead of you. Please proceed towards the procurement counter.",
            messageHi: "आपसे आगे 2 किसान हैं। कृपया खरीद काउंटर की ओर प्रस्थान करें।",
            type: "warning"
          });
        } else if (vickyBooking.farmersAhead === 5) {
          this.addNotification({
            farmerId: vickyBooking.farmerId,
            title: "🔔 Your turn is approaching!",
            titleHi: "🔔 आपकी बारी आ रही है!",
            message: "5 farmers ahead of you. Please prepare to proceed to the centre.",
            messageHi: "आपसे आगे 5 किसान हैं। कृपया केंद्र पहुंचने की तैयारी करें।",
            type: "info"
          });
        }
      } else if (vickyBooking.queuePosition === 1 && vickyBooking.status === "At Counter") {
        vickyBooking.status = "Weighing";
      }
    }

    // Also advance other queue tokens realistically
    const waitingBookings = this.data.bookings.filter(b => b.token !== "A127" && (b.status === "Waiting" || b.status === "Slot Confirmed"));
    waitingBookings.forEach(b => {
      if (b.queuePosition > 1) {
        b.queuePosition -= 1;
        b.farmersAhead = Math.max(0, b.queuePosition - 1);
      }
    });

    // Update centre counts
    centre.farmersServedToday += 1;
    centre.farmersWaitingToday = Math.max(0, centre.farmersWaitingToday - 1);
    
    // Update Now Serving token
    const tokenNum = parseInt(this.data.nowServingToken.replace(/\D/g, '')) || 119;
    if (vickyBooking && vickyBooking.queuePosition === 1) {
      this.data.nowServingToken = "A127";
    } else {
      this.data.nowServingToken = `A${tokenNum + 1}`;
    }

    this.save();
    return {
      nowServing: this.data.nowServingToken,
      centre,
      vickyBooking
    };
  }

  // Procurement: Weighing
  recordWeighing(bookingId, grossWeight, tareWeight) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return null;

    const gross = Number(grossWeight) || 1250;
    const tare = Number(tareWeight) || 50;
    const net = Math.max(0, gross - tare);

    let proc = this.data.procurements.find(p => p.bookingId === booking.id || p.token === booking.token);
    if (!proc) {
      proc = {
        id: `proc-${Date.now()}`,
        bookingId: booking.id,
        token: booking.token,
        farmerId: booking.farmerId,
        grossWeight: gross,
        tareWeight: tare,
        netWeight: net,
        moisture: 12.0,
        foreignMatter: 1.5,
        grade: "A",
        mspPerQuintal: 2300,
        totalAmount: Math.round((net / 100) * 2300),
        status: "Weighed",
        updatedAt: new Date().toISOString()
      };
      this.data.procurements.push(proc);
    } else {
      proc.grossWeight = gross;
      proc.tareWeight = tare;
      proc.netWeight = net;
      proc.totalAmount = Math.round((net / 100) * (proc.mspPerQuintal || 2300));
      proc.status = "Weighed";
      proc.updatedAt = new Date().toISOString();
    }

    booking.status = "Weighing";
    this.addNotification({
      farmerId: booking.farmerId,
      title: "Weighing Completed",
      titleHi: "तौल कार्य संपन्न",
      message: `Net Weight calculated: ${net} kg (Gross: ${gross} kg - Tare: ${tare} kg).`,
      messageHi: `शुद्ध वजन निर्धारित: ${net} किग्रा (कुल: ${gross} किग्रा - खाली: ${tare} किग्रा)।`,
      type: "info"
    });

    this.save();
    return { booking, procurement: proc };
  }

  // Procurement: Grading
  recordGrading(bookingId, moisture, foreignMatter, grade) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return null;

    let proc = this.data.procurements.find(p => p.bookingId === booking.id || p.token === booking.token);
    if (!proc) {
      proc = this.recordWeighing(bookingId, 1250, 50).procurement;
    }

    proc.moisture = Number(moisture) || 12.0;
    proc.foreignMatter = Number(foreignMatter) || 1.5;
    proc.grade = grade || "A";
    
    // Adjust MSP based on grade
    let msp = 2300;
    if (grade === "B") msp = 2200;
    if (grade === "C") msp = 2050;
    if (grade === "Rejected") msp = 0;

    proc.mspPerQuintal = msp;
    proc.totalAmount = Math.round((proc.netWeight / 100) * msp);
    proc.status = grade === "Rejected" ? "Rejected" : "Graded";
    proc.updatedAt = new Date().toISOString();

    booking.status = grade === "Rejected" ? "Rejected" : "Grading";

    this.addNotification({
      farmerId: booking.farmerId,
      title: `Quality Assessment: Grade ${grade}`,
      titleHi: `गुणवत्ता मूल्यांकन: ग्रेड ${grade}`,
      message: `Moisture: ${proc.moisture}%, Foreign Matter: ${proc.foreignMatter}%. Status: ${proc.status}.`,
      messageHi: `नमी: ${proc.moisture}%, बाह्य पदार्थ: ${proc.foreignMatter}%. स्थिति: ${proc.status}.`,
      type: grade === "Rejected" ? "error" : "success"
    });

    this.save();
    return { booking, procurement: proc };
  }

  // Procurement: Complete
  completeProcurement(bookingId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return null;

    let proc = this.data.procurements.find(p => p.bookingId === booking.id || p.token === booking.token);
    if (!proc) {
      proc = this.recordGrading(bookingId, 12.0, 1.5, "A").procurement;
    }
    proc.status = "Completed";
    booking.status = "Procurement Complete";

    // Create payment entry
    let payment = this.data.payments.find(p => p.bookingId === booking.id);
    if (!payment) {
      payment = {
        id: `pay-${Date.now()}`,
        procurementId: proc.id,
        bookingId: booking.id,
        farmerId: booking.farmerId,
        token: booking.token,
        amount: proc.totalAmount || 27600,
        ratePerKg: (proc.mspPerQuintal || 2300) / 100,
        netWeightKg: proc.netWeight || 1200,
        grade: proc.grade || "A",
        crop: booking.crop || "Wheat",
        transactionId: `KS${new Date().getFullYear()}091500127`,
        status: "Bill Generated", // "Bill Generated", "Payment Processing", "Payment Completed"
        paymentMode: "Direct Benefit Transfer (DBT) via PFMS",
        accountNumber: "SBI •••• 4512",
        date: "15 Sep 2026"
      };
      this.data.payments.push(payment);
    } else {
      payment.status = "Bill Generated";
      payment.amount = proc.totalAmount || 27600;
    }

    this.addNotification({
      farmerId: booking.farmerId,
      title: "Procurement Completed",
      titleHi: "खरीद प्रक्रिया पूरी हुई",
      message: `Procurement of ${proc.netWeight} kg Wheat accepted. Bill generated: ₹${payment.amount.toLocaleString('en-IN')}.`,
      messageHi: `${proc.netWeight} किग्रा गेहूं की खरीद स्वीकृत। बिल तैयार: ₹${payment.amount.toLocaleString('en-IN')}।`,
      type: "success"
    });

    this.save();
    return { booking, procurement: proc, payment };
  }

  // Process Payment
  processPayment(bookingId) {
    const booking = this.getBookingById(bookingId);
    const proc = this.data.procurements.find(p => p.bookingId === bookingId || p.token === bookingId);
    let payment = this.data.payments.find(p => p.bookingId === bookingId || p.token === bookingId);

    if (!payment) {
      payment = {
        id: `pay-${Date.now()}`,
        procurementId: proc ? proc.id : "proc-127",
        bookingId: booking ? booking.id : "bk-127",
        farmerId: booking ? booking.farmerId : "f-001",
        token: booking ? booking.token : "A127",
        amount: proc ? proc.totalAmount : 27600,
        ratePerKg: 23,
        netWeightKg: proc ? proc.netWeight : 1200,
        grade: proc ? proc.grade : "A",
        crop: booking ? booking.crop : "Wheat",
        transactionId: "KS2026091500127",
        status: "Payment Completed",
        paymentMode: "Direct Benefit Transfer (DBT) via PFMS",
        accountNumber: "SBI •••• 4512",
        date: "15 Sep 2026"
      };
      this.data.payments.push(payment);
    } else {
      payment.status = "Payment Completed";
      payment.transactionId = "KS2026091500127";
    }

    if (booking) {
      booking.status = "Payment Completed";
    }

    // Add to history if not exists
    const existsInHistory = this.data.history.some(h => h.transactionId === payment.transactionId);
    if (!existsInHistory) {
      this.data.history.unshift({
        id: `hist-${Date.now()}`,
        date: "2026-09-15",
        centre: "Pauri Procurement Centre",
        crop: payment.crop,
        netWeight: payment.netWeightKg,
        grade: payment.grade,
        amount: payment.amount,
        paymentStatus: "Paid",
        transactionId: payment.transactionId,
        farmerId: payment.farmerId
      });
    }

    this.addNotification({
      farmerId: payment.farmerId,
      title: "💳 Payment Successful",
      titleHi: "💳 भुगतान सफल",
      message: `₹${payment.amount.toLocaleString('en-IN')} transferred to SBI •••• 4512 via DBT. UTR: ${payment.transactionId}.`,
      messageHi: `₹${payment.amount.toLocaleString('en-IN')} आपके एसबीआई खाते •••• 4512 में डीबीटी द्वारा जमा किया गया।`,
      type: "success"
    });

    this.save();
    return { booking, procurement: proc, payment };
  }

  // Notifications
  getNotifications(farmerId) {
    return this.data.notifications.filter(n => n.farmerId === farmerId);
  }
  addNotification(notif) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }
  markNotificationRead(id) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save();
    }
    return n;
  }
}

module.exports = new JsonDatabase();
