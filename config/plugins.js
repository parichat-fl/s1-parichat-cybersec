const path = require('path');

module.exports = ({ env }) => ({
  email: {
    config: {
      // ใช้ mock provider เป็นค่าเริ่มต้น เพื่อให้ forgot-password / reset-password
      // ทำงานได้โดยไม่ต้องต่อ SMTP จริง ถ้าจะใช้ SMTP จริงให้ตั้ง EMAIL_PROVIDER=smtp
      // ถ้าไม่ได้ตั้ง EMAIL_PROVIDER ให้ใช้ mock provider ในโฟลเดอร์นี้
      // ต้องเป็น path ไม่ใช่ชื่อ "mock" เพราะ Strapi จะพยายาม require ชื่อนั้นจาก node_modules
      provider: env('EMAIL_PROVIDER') || path.resolve(__dirname, 'providers', 'email-mock'),
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', ''),
          pass: env('SMTP_PASSWORD', ''),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'no-reply@strapi.io'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'no-reply@strapi.io'),
      },
    },
  },
});