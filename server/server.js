const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach socket.io to express app for use in routes
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('subscribeQueue', (centreId) => {
    socket.join(`centre_${centreId}`);
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kisan Setu API Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build if it exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send("Kisan Setu Server Running. Client build not found at " + clientDistPath);
    }
  });
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Get local IPv4 address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();

server.listen(PORT, HOST, () => {
  console.log(`
  ======================================================
  🌾 KISAN SETU — Smart Digital Procurement System
  ======================================================
  🚀 Accessible on your machine:
     Local:    http://localhost:${PORT}
     Network:  http://${localIp}:${PORT}  <-- Open on mobile/other PCs!
  
  📡 Real-time Socket.IO: ENABLED
  📁 Database Engine: Persistent JSON File Engine
  
  🔑 Demo Credentials:
     Farmer:   Mobile: 9876543210 (OTP: 123456)
     Operator: operator@kisansetu.demo (Pass: demo123)
  ======================================================
  `);
});
