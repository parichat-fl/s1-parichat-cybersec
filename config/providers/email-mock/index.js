'use strict';

/**
 * Mock email provider
 *
 * ป้องกัน error "can not connect to any SMTP server" ตอนเรียก forgot-password
 * หรือ reset-password ในสภาพแวดล้อมที่ยังไม่ได้ตั้งค่า SMTP
 * ค่า EMAIL_PROVIDER=smtp จะเปลี่ยนกลับไปใช้ SMTP จริงตามปกติ
 */
module.exports = {
  init: (providerOptions = {}, settings = {}) => ({
    send: async (options) => {
      try {
        strapi.log?.info?.(
          `[Email Service] Mock email dispatched to: ${options?.to} (subject: "${options?.subject}")`
        );
        return {
          ok: true,
          to: options?.to,
          from: options?.from || settings?.defaultFrom,
          subject: options?.subject,
          text: options?.text,
          html: options?.html,
        };
      } catch (err) {
        strapi.log?.warn?.(`[Email Service] Failed to send email gracefully: ${err.message}`);
        return undefined;
      }
    },
  }),
};