# Admin Panel

Strapi Admin Panel เป็นส่วนควบคุมของระบบ ใช้จัดการ Content และผู้ใช้งาน

## เข้าใช้งาน

1. เปิดระบบด้วย `docker compose up -d`
2. เปิด http://localhost:8181/admin
3. ครั้งแรกให้กด **Register** เพื่อสร้างบัญชี Admin (ทำได้ครั้งเดียวเท่านั้น)

หลังจากนั้นใช้ email และ password ที่ตั้งไว้ login ที่ http://localhost:8181/admin/login

## โครงสร้าง URL

| Path | หน้า |
| --- | --- |
| `/admin` | หน้าแรก / login |
| `/admin/register-admin` | สร้างบัญชี Admin (ครั้งแรกเท่านั้น) |
| `/admin/users/me` | โปรไฟล์ของ Admin ที่ login อยู่ |
| `/admin/forgot-password` | ขอ reset password ผ่าน email |
| `/admin/reset-password` | ตั้ง password ใหม่จาก token |

## Content Type ที่ใช้ในงาน

| ชื่อ | Endpoint | ฟิลด์ |
| --- | --- | --- |
| Student | `/api/students` | `name`, `mobile`, `cardId` |
| Subject | `/api/subjects` | `name` |
| Teacher | `/api/teachers` | `name` |

สร้าง Content Type ได้จาก **Content Manager → Create content type** แล้วกำหนด API ID
ให้ตรงกับชื่อในตารางด้านบน (`student`, `subject`, `teacher`)

## การทดสอบด้วย REST Client

ชุด request สำหรับทดสอบอยู่ใน `api.http.simple` (25 requests)

- `1. ADMIN API` — register, login, profile, forgot/reset password
- `2. USER API` — register, login, profile, forgot/reset password
- `3. CONTENT API` — CRUD ของ Student, Subject, Teacher

Token ถูกดึงอัตโนมัติผ่าน `# @name` เช่น
`Authorization: Bearer {{adminLogin.response.body.data.token}}`
ให้รัน Login ก่อนเสมอ

## Forgot / Reset Password

1. รัน request Forgot Password (1.4 หรือ 2.4) ระบบจะส่งอีเมลผ่าน mock provider
2. เปิด log เพื่อเอา reset code

   ```bash
   docker logs 69-s1-app
   ```

   หาบรรทัด `Mock email body` แล้ว copy ค่าหลัง `code=` ไปใส่ใน request Reset Password

3. รัน Reset Password (1.5 หรือ 2.5) ด้วย code นั้น (ใช้ได้ครั้งเดียว)
4. ถ้าเปลี่ยน password ต้องรัน Login ใหม่เพื่อเอา token ตัวใหม่

## Content API (ส่วนที่ 3)

ชุด request CRUD ของ Student, Subject, Teacher อยู่ใน `api.http.simple`
หมวด `3. CONTENT API` ประกอบด้วย

| หัวข้อ | Endpoint | หมายเหตุ |
| --- | --- | --- |
| 3.1.1–3.1.5 Student | `/api/students` | `mobile` 10 หลัก + `cardId` 13 หลัก ห้ามซ้ำ |
| 3.2.1–3.2.5 Subject | `/api/subjects` | `name` ห้ามซ้ำ |
| 3.3.1–3.3.5 Teacher | `/api/teachers` | มี relation `mappings` |

แต่ละชุดมี Create, List All, List with ID, Update, Delete

### การยืนยันตัวตน

Content API อยู่ภายใต้ plugin Users & Permissions จึงต้องใช้ **jwt ของ User**
จาก `2.2 User Login` เท่านั้น — token จาก `1.2 Admin Login` จะได้ 401 เพราะ
Strapi แยก secret ของ Admin กับ User ออกเป็นคนละตัว

### ตั้งสิทธิ์ครั้งแรก (ทำครั้งเดียว)

1. เข้า Admin Panel → **Settings → Users & Permissions → Roles → Authenticated**
2. ติ๊กสิทธิ์ของ `student`, `subject`, `teacher` ทั้ง
   `find`, `findOne`, `create`, `update`, `delete`
3. กด **Save** แล้วรัน `2.2 User Login` ก่อนใช้หมวด 3

ถ้าหน้า Settings เปิดไม่ขึ้น ตั้งผ่าน API ได้ (ใช้ token จาก `1.2`)

```
GET  /users-permissions/roles        # ดูรายการ role (id ของ Authenticated = 1)
PUT  /users-permissions/roles/1      # body: name, description, permissions
```

### ข้อควรระวังของข้อมูล

- content type ทั้งสามเปิด **draft & publish** จึงต้องใส่ `publishedAt`
  ใน Create/Update ไม่งั้นข้อมูลจะเป็น draft และไม่ขึ้นใน List All
- `Student.mobile` ถูกเปลี่ยนเป็น md5 อัตโนมัติก่อนบันทึก
  (lifecycle ใน `src/api/student/content-types/student/lifecycles.js`)
- ข้อมูลตัวอย่างที่อยู่ในระบบแล้ว

  | Content Type | ข้อมูล |
  | --- | --- |
  | Student | นางสาวจันทร์แย้ม ยิ้มหวาน |
  | Subject | แคลคูลัส 1 |
  | Teacher | อ.สมหญิง รักสอน |

## ข้อควรระวัง

- บัญชี Admin สร้างได้ครั้งเดียว ถ้ามีอยู่แล้ว request Register (1.1) จะตอบ 400
  "You cannot register a new super admin" ให้ใช้ request Forgot/Reset Password แทน
- อย่า commit `api.http` เพราะมี credential จริงอยู่ในไฟล์ (อยู่ใน `.gitignore` แล้ว)
- Admin token มีสิทธิ์เข้าถึง Content ทั้งหมด ควรใช้เฉพาะการดูแลระบบ