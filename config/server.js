module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // URL ที่ภายนอกเข้าถึงแอปได้จริง ใช้ตอนสร้าง reset-password link ในอีเมล
  // docker-compose ส่ง APP_PORT เข้ามา ถ้าไม่ตั้งค่า link จะเป็น 0.0.0.0:1337 ซึ่งเปิดไม่ได้
  url: env('URL') || `http://localhost:${env.int('APP_PORT', 1337)}`,
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});