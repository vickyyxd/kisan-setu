const { spawn } = require('child_process');

console.log(`
======================================================
🌐 KISAN SETU — LIVE PUBLIC HTTPS TUNNEL
======================================================
Starting free public HTTPS tunnel for port 5001...
This creates an online link so anyone on the internet
(including mobile phones & evaluators) can access
Kisan Setu without localhost!
======================================================
`);

const lt = spawn('npx', ['-y', 'localtunnel', '--port', '5001'], {
  stdio: 'inherit'
});

lt.on('error', (err) => {
  console.error("Tunnel failed:", err.message);
});
