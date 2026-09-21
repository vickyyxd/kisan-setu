module.exports = {
  apps: [
    {
      name: 'kisan-setu',
      script: 'server/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: './server.log',
      error_file: './server.log',
      merge_logs: true
    }
  ]
};
