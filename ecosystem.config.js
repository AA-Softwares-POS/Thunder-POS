module.exports = {
  apps: [
    {
      name: 'thunderpos-backend',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'thunderpos-admin',
      script: 'npm',
      args: 'start',
      cwd: './packages/admin-panel',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
