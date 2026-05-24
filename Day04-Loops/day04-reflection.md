# Day 4 Pre-Assessment Reflection
- Understood: ...
- Confused: += vs =+
-> += adds to current value (score += 5 means score = score + 5)
-> =+ resets value (score =+ 5 means score = 5)
- Want to know more: ...
- The another way to output even numbers in the loop
for (let i = 2; i <= 10; i += 2) {
  console.log(i);
}
- Use  do{ body }while(); when need to run body AT LEAST ONCE before checking condition.
  do {
    body  <- runs first, always
  } while (condition);  <- checked AFTER body runs

- Output prime numbers:
  1. วน for loop ตรวจสอบเลขตั้งแต่ 2 ถึง n โดยตั้ง label ชื่อ nextPrime ไว้ที่ loop นี้
  2. วน for loop ด้านใน นำ j มาหาร i ถ้า i % j === 0 (หารลงตัว) -> continue nextPrime คือกระโดดออกจาก loop ในทันที แล้วไป i ถัดไปเลย
  3. ถ้า loop ในวนครบโดยไม่มี continue เลย แปลว่าไม่มี j ตัวไหนหาร i ลงตัวได้ -> i เป็น prime -> console.log(i)