module.exports = {
  apps: [
    {
      name: 'my-nest-app',
      script: 'dist/main.js', // Ruta al archivo de entrada de tu aplicación Nest.js compilada
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
