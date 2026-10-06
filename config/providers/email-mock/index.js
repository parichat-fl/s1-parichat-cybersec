'use strict';

/**
 * Mock email provider
 *
 * ป้องกัน error "can not connect to any SMTP server" ตอนเรียก forgot-password
 * หรือ reset-password ในสภาพแวดล้อมที่ยังไม่ได้ตั้งค่า SMTP
 * ค่า EMAIL_PROVIDER=smtp จะเปลี่ยนกลับไปใช้ SMTP จริงตามปกติ
 *
 * หมายเหตุ: mock ตัวนี้ใช้ตอน develop เท่านั้น โดยพิมพ์เนื้อหาอีเมล (options.text)
 * ลง log เพื่อให้ copy reset code / resetPasswordToken ไปใช้ในขั้นตอน reset-password ได้
 * ห้ามเอาไปใช้กับ SMTP จริง เพราะจะเท่ากับบันทึก token ลง log (ดู docs/SECURITY.md)
 */
module.exports = {
  init: (providerOptions = {}, settings = {}) => ({
    send: async (options) => {
      try {
        strapi.log?.info?.(
          `[Email Service] Mock email dispatched to: ${options?.to} (subject: "${options?.subject}")`
        );
        // พิมพ์เนื้อหาอีเมลเฉพาะตอนใช้ mock (พัฒนา/ทดสอบ) เพื่อเอา code/token ไปรัน reset-password ต่อ
        if (options?.text) {
          strapi.log?.info?.(`[Email Service] Mock email body:\n${options.text}`);
        }
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