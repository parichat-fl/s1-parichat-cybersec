# s1-parichat-cybersec

รหัสนักศึกษา: 056860405033-2XXX

ความคาดหวังของวิชานี้: ต้องการเรียนรู้และพัฒนาทักษะเกี่ยวกับ Git, GitHub และ Docker รวมถึงเข้าใจการจัดการโปรเจกต์และการทำงานร่วมกันอย่างเป็นระบบ เพื่อนำความรู้ที่ได้รับไปประยุกต์ใช้ในการพัฒนาโปรเจกต์จริงในอนาคต

services:
  db:
    image: postgres:16-alpine
    container_name: 69-s1-db
    ports:
      - ${POSTGRES_PORT}:5432
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - ./data/data:/var/lib/postgresql/data
