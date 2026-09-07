# s1-parichat-cybersec

รหัสนักศึกษา: 056860405033-2XXX

ความคาดหวังของวิชานี้: ต้องการเรียนรู้และพัฒนาทักษะเกี่ยวกับ Git, GitHub และ Docker รวมถึงเข้าใจการจัดการโปรเจกต์และการทำงานร่วมกันอย่างเป็นระบบ เพื่อนำความรู้ที่ได้รับไปประยุกต์ใช้ในการพัฒนาโปรเจกต์จริงในอนาคต

services:
  db:
    image: postgres
    container_name: my-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: "123456"
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  admin:
    image: dpage/pgadmin4
    container_name: 69-s1-admin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@gmail.com
      PGADMIN_DEFAULT_PASSWORD: "123456"
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  postgres_data:
