const express = require('express');
const router = express.Router();
const db = require('../db/jsonDb');

// Helper to broadcast socket events if io is attached
const emitEvent = (req, event, data) => {
  const io = req.app.get('io');
  if (io) {
    io.emit(event, data);
  }
};

// ---------------- AUTH ROUTES ----------------
router.post('/auth/send-otp', (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ success: false, message: "Valid 10-digit mobile number required." });
  }
  // Demo simulation
  res.json({
    success: true,
    message: "OTP sent successfully to " + mobile,
    demoOtp: "123456"
  });
});

router.post('/auth/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (otp !== "123456") {
    return res.status(400).json({ success: false, message: "Invalid OTP. Use demo OTP: 123456" });
  }

  // Find or create farmer
  let farmer = db.getFarmers().find(f => f.mobile === mobile);
  if (!farmer) {
    farmer = db.getFarmerById("f-001"); // Default to Vicky Kumar for demo
  }

  res.json({
    success: true,
    token: "demo-jwt-farmer-token-" + farmer.id,
    user: farmer
  });
});

router.post('/auth/operator-login', (req, res) => {
  const { operatorId, password } = req.body;
  if (operatorId === "operator@kisansetu.demo" && password === "demo123") {
    return res.json({
      success: true,
      token: "demo-jwt-operator-token",
      user: {
        id: "op-001",
        name: "Centre Manager",
        role: "Operator",
        centreId: "centre-01",
        centreName: "Pauri Procurement Centre",
        email: "operator@kisansetu.demo"
      }
    });
  }
  res.status(401).json({ success: false, message: "Invalid credentials. Use operator@kisansetu.demo / demo123" });
});

// ---------------- FARMER ROUTES ----------------
router.get('/farmers/:id', (req, res) => {
  const farmer = db.getFarmerById(req.params.id);
  if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });
  res.json({ success: true, farmer });
});

router.put('/farmers/:id', (req, res) => {
  const updated = db.updateFarmer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Farmer not found" });
  res.json({ success: true, farmer: updated });
});

// ---------------- CENTRE ROUTES ----------------
router.get('/centres', (req, res) => {
  res.json({ success: true, centres: db.getCentres() });
});

router.get('/centres/:id', (req, res) => {
  const centre = db.getCentreById(req.params.id);
  if (!centre) return res.status(404).json({ success: false, message: "Centre not found" });
  res.json({ success: true, centre });
});

router.put('/centres/:id/capacity', (req, res) => {
  const { loadPercent } = req.body;
  const updated = db.updateCentreCapacity(req.params.id, Number(loadPercent));
  if (!updated) return res.status(404).json({ success: false, message: "Centre not found" });
  emitEvent(req, 'capacityUpdated', updated);
  res.json({ success: true, centre: updated });
});

// ---------------- BOOKING ROUTES ----------------
router.get('/bookings', (req, res) => {
  res.json({ success: true, bookings: db.getBookings() });
});

router.get('/bookings/:id', (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  res.json({ success: true, booking });
});

router.get('/farmers/:id/bookings', (req, res) => {
  const bookings = db.getFarmerBookings(req.params.id);
  res.json({ success: true, bookings });
});

router.post('/bookings', (req, res) => {
  try {
    const booking = db.createBooking(req.body);
    emitEvent(req, 'bookingCreated', booking);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- QUEUE ROUTES ----------------
router.get('/queue/:centreId', (req, res) => {
  const centre = db.getCentreById(req.params.centreId) || db.getCentres()[0];
  const bookings = db.getBookings().filter(b => b.centreId === centre.id);
  const nowServing = db.data.nowServingToken;
  const queuePaused = db.data.queuePaused;

  res.json({
    success: true,
    centre,
    nowServing,
    queuePaused,
    waitingList: bookings.filter(b => b.status === "Waiting" || b.status === "Slot Confirmed"),
    activeList: bookings.filter(b => ["Weighing", "Grading", "At Counter"].includes(b.status)),
    servedCount: centre.farmersServedToday,
    waitingCount: centre.farmersWaitingToday
  });
});

router.post('/queue/:centreId/advance', (req, res) => {
  const result = db.advanceQueue(req.params.centreId);
  if (!result) return res.status(404).json({ success: false, message: "Centre not found" });

  emitEvent(req, 'queueUpdated', {
    nowServing: result.nowServing,
    centre: result.centre,
    vickyBooking: result.vickyBooking
  });

  res.json({
    success: true,
    message: "Queue advanced successfully",
    ...result
  });
});

router.post('/queue/:centreId/toggle-pause', (req, res) => {
  db.data.queuePaused = !db.data.queuePaused;
  db.save();
  emitEvent(req, 'queueStatusChanged', { paused: db.data.queuePaused });
  res.json({ success: true, paused: db.data.queuePaused });
});

// ---------------- PROCUREMENT ROUTES ----------------
router.get('/procurement/:bookingId', (req, res) => {
  const booking = db.getBookingById(req.params.bookingId);
  const proc = db.data.procurements.find(p => p.bookingId === req.params.bookingId || p.token === req.params.bookingId);
  res.json({ success: true, booking, procurement: proc });
});

router.post('/procurement/:bookingId/weigh', (req, res) => {
  const { grossWeight, tareWeight } = req.body;
  const result = db.recordWeighing(req.params.bookingId, grossWeight, tareWeight);
  if (!result) return res.status(404).json({ success: false, message: "Booking not found" });

  emitEvent(req, 'procurementUpdated', result);
  res.json({ success: true, ...result });
});

router.post('/procurement/:bookingId/grade', (req, res) => {
  const { moisture, foreignMatter, grade } = req.body;
  const result = db.recordGrading(req.params.bookingId, moisture, foreignMatter, grade);
  if (!result) return res.status(404).json({ success: false, message: "Booking not found" });

  emitEvent(req, 'procurementUpdated', result);
  res.json({ success: true, ...result });
});

router.post('/procurement/:bookingId/complete', (req, res) => {
  const result = db.completeProcurement(req.params.bookingId);
  if (!result) return res.status(404).json({ success: false, message: "Booking not found" });

  emitEvent(req, 'procurementCompleted', result);
  res.json({ success: true, ...result });
});

// ---------------- PAYMENT ROUTES ----------------
router.get('/payments/:bookingId', (req, res) => {
  const payment = db.data.payments.find(p => p.bookingId === req.params.bookingId || p.token === req.params.bookingId);
  res.json({ success: true, payment });
});

router.post('/payments/:bookingId/process', (req, res) => {
  const result = db.processPayment(req.params.bookingId);
  if (!result) return res.status(404).json({ success: false, message: "Record not found" });

  emitEvent(req, 'paymentUpdated', result);
  res.json({ success: true, ...result });
});

// ---------------- NOTIFICATIONS ROUTES ----------------
router.get('/notifications/:farmerId', (req, res) => {
  const notifs = db.getNotifications(req.params.farmerId);
  res.json({ success: true, notifications: notifs });
});

router.post('/notifications/:id/read', (req, res) => {
  const updated = db.markNotificationRead(req.params.id);
  res.json({ success: true, notification: updated });
});

// ---------------- HISTORY & ANALYTICS ----------------
router.get('/history/:farmerId', (req, res) => {
  const history = db.data.history.filter(h => h.farmerId === req.params.farmerId || req.params.farmerId === "all");
  res.json({ success: true, history });
});

router.get('/analytics', (req, res) => {
  // Realistic operator dashboard analytics
  const dailyServed = [
    { day: "Mon", count: 120, target: 150 },
    { day: "Tue", count: 138, target: 150 },
    { day: "Wed", count: 145, target: 150 },
    { day: "Thu", count: 132, target: 150 },
    { day: "Fri", count: 152, target: 150 },
    { day: "Sat", count: 164, target: 150 },
    { day: "Today (Sun)", count: 146, target: 150 }
  ];

  const queueLoadHours = [
    { hour: "08:00", farmers: 15, capacity: 25 },
    { hour: "09:00", farmers: 28, capacity: 30 },
    { hour: "10:00", farmers: 35, capacity: 35 },
    { hour: "11:00", farmers: 38, capacity: 40 },
    { hour: "12:00", farmers: 25, capacity: 35 },
    { hour: "14:00", farmers: 22, capacity: 30 },
    { hour: "15:00", farmers: 18, capacity: 25 }
  ];

  const cropDistribution = [
    { name: "Wheat (गेहूं)", value: 68, color: "#15803d" },
    { name: "Rice (धान)", value: 18, color: "#eab308" },
    { name: "Mandua (मडुआ)", value: 10, color: "#854d0e" },
    { name: "Mustard (सरसों)", value: 4, color: "#ca8a04" }
  ];

  const paymentBreakdown = [
    { status: "Paid (भुगतान पूर्ण)", count: 142, amount: "₹34.8 Lakhs", color: "#16a34a" },
    { status: "Processing (प्रक्रियाधीन)", count: 18, amount: "₹4.2 Lakhs", color: "#eab308" },
    { status: "Pending (लंबित बिल)", count: 9, amount: "₹2.1 Lakhs", color: "#64748b" }
  ];

  res.json({
    success: true,
    centreStats: {
      capacityPercent: 82,
      farmersServed: 146,
      waitingCount: 23,
      procurementProgressPercent: 76,
      totalProcuredTodayKg: 175200,
      totalDisbursedTodayInr: 4029600
    },
    dailyServed,
    queueLoadHours,
    cropDistribution,
    paymentBreakdown
  });
});

// ---------------- DEMO SCENARIO RESET ----------------
router.post('/demo/reset', (req, res) => {
  const freshData = db.reset();
  emitEvent(req, 'demoReset', { message: "System reset to demo initial state" });
  res.json({ success: true, message: "Demo data reset successfully", state: freshData });
});

module.exports = router;
