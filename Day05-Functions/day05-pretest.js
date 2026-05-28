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

// i   Spaces   Stars
// 1   2        1  spaces = size - i
// 2   1        3  stars = i * 2 - 1
// 3   0        5

const testCase = [3, 5, 7, 10];

for(let t = 0; t < testCase.length; t++){
    let size = testCase[t];
    
    if(size % 2 ===0){
        size += 1;
    }

    for(let i = 1; i <= size; i++){
        let spaces = "";
        let stars = "";

        for(let j = 1; j <= size - i; j++){
            spaces += " ";
        }

        for(let k = 1; k <= i * 2 - 1; k++){
            stars += "*";
        }
        console.log(spaces + stars);
    }
    console.log("");
}