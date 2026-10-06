# s1-parichat-cybersec

รหัสนักศึกษา: 056860405033-2XXX

ความคาดหวังของวิชานี้: ต้องการเรียนรู้และพัฒนาทักษะเกี่ยวกับ Git, GitHub และ Docker รวมถึงเข้าใจการจัดการโปรเจกต์และการทำงานร่วมกันอย่างเป็นระบบ เพื่อนำความรู้ที่ได้รับไปประยุกต์ใช้ในการพัฒนาโปรเจกต์จริงในอนาคต

## Project Overview

Strapi + PostgreSQL + pgAdmin ที่รันด้วย Docker Compose พร้อมชุดทดสอบ REST API 25 รายการ

| Service | Container | Port | คำอธิบาย |
| --- | --- | --- | --- |
| Strapi app | `69-s1-app` | `${APP_PORT}` | REST API และ Admin Panel |
| pgAdmin | `69-s1-admin` | `${PG_PORT}` | จัดการฐานข้อมูล |
| PostgreSQL | `69-s1-db` | `${DB_PORT}` | ฐานข้อมูลหลัก |

## Getting Started

### 1. เตรียมไฟล์ตั้งค่า

```bash
cp .env.simple .env
```

ค่าจาก `.env.simple` ว่างทั้งหมด ต้องกรอกเอง โดยเฉพาะ Strapi secrets
ให้สุ่มแยกค่ากันทุกตัว

```bash
openssl rand -base64 32
```

ต้องใช้กับ `APP_KEYS`, `APP_JWT_SECRET`, `APP_ADMIN_JWT_SECRET`,
`APP_API_TOKEN_SALT`, `APP_TRANSFER_TOKEN_SALT`

### 2. เตรียมไฟล์ทดสอบ API

```bash
cp api.http.simple api.http
```

แล้วกรอก credential ของตัวเองใน `api.http` และตรวจว่า `@baseUrl`
ตรงกับค่า `APP_PORT` ใน `.env`

### 3. ขึ้นระบบ

```bash
docker compose up -d
docker compose ps
```

### 4. สร้างบัญชี Admin

เปิด http://localhost:8181/admin แล้วกด Register สร้างบัญชี (ทำได้ครั้งเดียว)

### 5. หยุดระบบ

```bash
docker compose down          # หยุด แต่เก็บข้อมูล
docker compose down -v       # หยุดและลบข้อมูลทั้งหมด
```

## Testing API

เปิด `api.http` ด้วย VS Code REST Client แล้วรันตามลำดับ ต้องรัน Login ก่อนเสมอ
เพราะ request อื่นดึง token จาก response ของ Login ผ่าน `# @name`

- `1. ADMIN API` — register, login, profile, forgot/reset password
- `2. USER API` — register, login, profile, forgot/reset password
- `3. CONTENT API` — CRUD ของ `students`, `subjects`, `teachers`

`3. CONTENT API` ใช้ jwt จาก `2.2 User Login` เพราะ token ของ Admin ใช้กับ
content API ไม่ได้ (คนละ secret กัน) และต้องตั้งสิทธิ์ role Authenticated
ครั้งแรกก่อน วิธีตั้งค่าดูที่ [docs/ADMIN.md](docs/ADMIN.md)

Forgot Password จะส่งอีเมลผ่าน mock provider และพิมพ์ reset code ลง log อ่านได้จาก

```bash
docker logs 69-s1-app
```

แล้วเอา code ไปใส่ใน request Reset Password (ใช้ได้ครั้งเดียว ต้องรัน Forgot ใหม่ทุกครั้ง)

## Repository Structure

```
.
├── api.http.simple         # เทมเพลตชุดทดสอบ API (25 requests)
├── config/                 # ตั้งค่า Strapi (database, email mock, url ของแอป)
│   └── providers/
│       └── email-mock/     # email จำลอง ใช้ตอนทดสอบ Forgot/Reset Password
├── docker-compose.yml      # db + admin + app
├── docs/
│   ├── ADMIN.md            # คู่มือ Admin Panel
│   └── SECURITY.md         # บันทึกเรื่องความปลอดภัย
├── .env.simple             # เทมเพลตตัวแปรสภาพแวดล้อม
└── .gitignore
```

## Branch Strategy

ใช้ Git Flow แบบย่อ โดย `main` เก็บงานที่ merge แล้ว และพัฒนาผ่าน feature branch

| Branch | หน้าที่ |
| --- | --- |
| `main` | งานที่รวมเข้า `develop` แล้ว |
| `develop` | รวมงานจากทุก feature branch |
| `feat/db` | PostgreSQL, pgAdmin, healthcheck และ `.gitignore` |
| `feat/app` | Strapi service |
| `feat/rest` | ชุดทดสอบ REST API และเอกสารคู่มือ |

แต่ละ branch merge เข้า `develop` แบบ `--no-ff` เพื่อเก็บประวัติการ merge

## Security

`.env` และ `api.http` ถูก exclude จาก Git เพราะเก็บ credential จริง
ส่วน `.env.simple` และ `api.http.simple` เว้นว่างทั้งหมดจึงปลอดภัยที่จะ commit

รายละเอียดเรื่องการจัดการ secret และจุดเสี่ยงที่ต้องระวัง ดูที่ [docs/SECURITY.md](docs/SECURITY.md)