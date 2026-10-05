# Security Notes

บันทึกเรื่องความปลอดภัยของโปรเจกต์และวิธีตรวจสอบตัวเอง

## การจัดการ Secret

| ไฟล์ | อยู่ใน Git | หมายเหตุ |
| --- | --- | --- |
| `.env` | ไม่ | เก็บค่าจริงทั้งหมด ห้าม commit |
| `.env.simple` | ใช่ | เทมเพลต ค่าว่างทั้งหมด ปลอดภัยที่จะ commit |
| `api.http` | ไม่ | มี credential จริง ห้าม commit |
| `api.http.simple` | ใช่ | เทมเพลต request ค่าว่าง ปลอดภัยที่จะ commit |

`.gitignore` ครอบคลุม `.env`, `.env.*`, `*.env`, `api.http`, `data/`, `pgadmin/`
และใช้ `!.env.simple` เป็น negation เพื่อไม่ให้เทมเพลตถูก ignore ไปพร้อมกัน

## Strapi Secrets ที่ต้องสร้างเอง

ทุกค่าในกลุ่มนี้ต้องสุ่มใหม่ทุกคน ห้ามใช้ค่าเดียวกัน

```bash
openssl rand -base64 32
```

| ตัวแปร | ใช้ทำอะไร |
| --- | --- |
| `APP_KEYS` | เข้ารหัส cookie และ session |
| `APP_JWT_SECRET` | ลงชื่อ token ของผู้ใช้ทั่วไป |
| `APP_ADMIN_JWT_SECRET` | ลงชื่อ token ของ Admin |
| `APP_API_TOKEN_SALT` | สร้าง API token |
| `APP_TRANSFER_TOKEN_SALT` | สร้าง transfer token |

ถ้าใช้ค่าเดียวกันข้ามคน ผู้ที่รู้ค่านั้นสามารถปลอม token ของทุกคนได้

## จุดเสี่ยงที่ต้องระวัง

**Password ของฐานข้อมูล** — `DB_PASS` และ `PG_PASS` ถูกส่งเข้า container ผ่าน
environment variable ซึ่งมองเห็นได้จาก `docker inspect` ถ้าเครื่องมีคนอื่นใช้

**Port ที่เปิดออกสู่ภายนอก** — PostgreSQL และ pgAdmin bind ที่ `0.0.0.0` ทำให้เข้าถึง
จากนอกเครือข่ายได้ ในการใช้งานจริงควรเปลี่ยนเป็น `127.0.0.1:${DB_PORT}:5432`

**Admin Panel** — เปิดสู่ public ได้ ควรมี reverse proxy + TLS และจำกัดจำนวนครั้ง
ที่ลอง login

**Reset password token** — token ต้องมีอายุสั้นและใช้ครั้งเดียว อย่าบันทึกลง log

**Default port ของ Strapi** — ถ้าเปิดสู่ภายนอกตรง ๆ ให้เปลี่ยน port ที่ expose

## ตรวจสอบว่าไม่มี Secret หลุด

```bash
# ดูว่ามีไฟล์อะไรถูก track บ้าง
git ls-files

# ค้นหาค่าที่อาจเป็น secret ในประวัติทั้งหมด
git log --all --full-history -p -- .env
```

ถ้าพบว่า `.env` เคยถูก commit ต้องทำสองอย่าง

1. เปลี่ยนรหัสผ่านทั้งหมดทันที เพราะค่าเก่าถือว่ารั่วแล้ว
2. ลบออกจากประวัติด้วย `git filter-repo` หรือ BFG แล้ว force push

การลบไฟล์ออกจาก commit ล่าสุดไม่ได้ทำให้ข้อมูลหายจากประวัติ
เพราะไฟล์เก่ายังดึงกลับมาได้จนกว่าจะ rewrite ทั้ง repository

## Checklist ก่อนส่งงาน

- [ ] `.env` ไม่อยู่ใน `git ls-files`
- [ ] `api.http` ไม่อยู่ใน `git ls-files`
- [ ] ค่าใน `.env.simple` และ `api.http.simple` ว่างทั้งหมด
- [ ] Strapi secrets สุ่มใหม่ ไม่ซ้ำกับที่ใช้ในเครื่องอื่น
- [ ] ไม่มี secret ใน README หรือ docs