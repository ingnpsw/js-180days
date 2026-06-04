
What I learned:
วิธีคิด logic ให้เป็นระบบ ใช้สูตรนี้:

1. Input คืออะไร
Function รับค่าอะไรเข้ามา
เช่น pow(x, n) รับค่า x และ n

2. Output ต้องการอะไร
ต้อง return อะไร
เช่น return ผลลัพธ์ของ x คูณตัวเอง n ครั้ง

3. ต้องมีตัวแปรช่วยไหม
ถ้าต้องสะสมค่า มักต้องมีตัวแปรช่วย
เช่น result = 1

4. ต้องทำซ้ำไหม
ถ้ามีคำว่า “กี่ครั้ง” มักใช้ loop
เช่น คูณ n ครั้ง

5. แต่ละรอบทำอะไร
อธิบายเป็นภาษาคนก่อน
เช่น “เอาผลลัพธ์เดิมคูณ x”

6. จบแล้ว return อะไร
หลัง loop เสร็จ ส่ง result กลับ

สำหรับโจทย์ต่อไป ให้เขียนก่อนโค้ดแบบนี้ทุกครั้ง:
Input:
Output:
Helper variable:
Repeat:
Each round:
Return:

เรียนรู้ function syntax
If a function should produce a result for later use, it needs return.


What confused me:
Ternary syntax:
condition ? valueIfTrue : valueIfFalse

|| OR syntax:
condition || fallback
เช่น return age > 18 || confirm('Did parents allow you?');

return vs console.log:
console.log only displays a value.
return sends a value back from the function.

isPrime function
return true ต้องอยู่หลัง loop เพราะต้องรอให้ check ตัวหารทั้งหมดก่อน ถ้าไม่มีตัวไหนหารลงตัว จึงสรุปได้ว่าเป็น prime
- number <= 1 → return false ก่อน
- loop เช็กตัวหาร 2 ถึง number - 1
- เจอตัวหาร -> return false ทันที
- ไม่เจอตัวหารจน loop จบ -> return true