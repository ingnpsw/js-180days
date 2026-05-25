/*
Day 05 Pre-Assessment: Pattern Builder (Loop Version)

Task:
Write code that prints a centered pyramid made of "*" characters.

Test cases (run in this order):
- size = 3
- size = 5
- size = 7
- size = 10

Rules:
1) Use loops only (no function yet, no hardcoded pyramid lines).
2) For each test case, if size is even, convert it to size + 1 before drawing.
   Example: 10 -> 11
3) Print exactly one pyramid per test case.
4) Use `console.log` only.

Pyramid rules:
- Total rows = size
- Row 1 has 1 star
- Each next row adds 2 stars
- Pyramid must stay centered (left padding with spaces)

Example output for size = 3:
  *
 ***
*****

Example output for size = 5:
    *
   ***
  *****
 *******
*********
*/