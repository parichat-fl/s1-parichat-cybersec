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

- `1. ADMIN API` — signup, login, profile, forgot/reset password
- `2. USER API` — register, login, profile, forgot/reset password
- `3. CONTENT API` — CRUD ของ Student, Subject, Teacher

Token ถูกดึงอัตโนมัติผ่าน `# @name` เช่น
`Authorization: Bearer {{adminLogin.response.body.data.token}}`
ให้รัน Login ก่อนเสมอ

## ข้อควรระวัง

- บัญชี Admin สร้างได้ครั้งเดียว ถ้าลืม password ต้องลบ volume ของฐานข้อมูลแล้วเริ่มใหม่
- อย่า commit `api.http` เพราะมี credential จริงอยู่ในไฟล์ (อยู่ใน `.gitignore` แล้ว)
- Admin token มีสิทธิ์เข้าถึง Content ทั้งหมด ควรใช้เฉพาะการดูแลระบบ