// 1) Is "else" required?
// importance: 4
// The following function returns true if the parameter age is greater than 18.

// Otherwise it asks for a confirmation and returns its result:

// function checkAge(age) {
//   if (age > 18) {
//     return true;
//   } else {
//     // ...
//     return confirm('Did parents allow you?');
//   }
// }
// Will the function work differently if else is removed?

// function checkAge(age) {
//   if (age > 18) {
//     return true;
//   }
//   // ...
//   return confirm('Did parents allow you?');
// }
// Is there any difference in the behavior of these two variants?

// ANS:
// เมื่อเข้า if (age > 18) -> return true แล้วออกจาก function
// เมื่อไม่เข้า if -> ข้ามบล็อก if แล้วไปรัน return confirm('Did parents allow you?') ซึ่งจะคืนค่า true/false จาก confirm function

// 2) Rewrite the function using '?' or '||'
// importance: 4
// The following function returns true if the parameter age is greater than 18.

// Otherwise it asks for a confirmation and returns its result.

// function checkAge(age) {
//   if (age > 18) {
//     return true;
//   } else {
//     return confirm('Did parents allow you?');
//   }
// }
// Rewrite it, to perform the same, but without if, in a single line.

// Make two variants of checkAge:

// Using a question mark operator ?
// Using OR ||

// ANS: Using a question mark operator ?
// function checkAge(age){
//     return age > 18 ? true : confirm('Did parents allow you?');
// }

//ANS: Using OR ||
// function checkAge(age){
//     return age > 18 || confirm('Did parents allow you?');
// }

// Function min(a, b)
// importance: 1
// Write a function min(a,b) which returns the least of two numbers a and b.

// For instance:

// min(2, 5) == 2
// min(3, -1) == -1
// min(1, 1) == 1

// function checkMin(num1, num2){
//     if(num1 < num2){
//         return num1;
//     }else{
//         return num2;
//     }
// }

// console.log(checkMin(2, 5));
// console.log(checkMin(3, -1));
// console.log(checkMin(1, 1));

//Ternary version condition ? valueIfTrue : valueIfFalse
// function checkMin(num1, num2){
//     return num1 < num2 ? num1 : num2;
// }

// Function pow(x,n)
// importance: 4
// Write a function pow(x,n) that returns x in power n. Or, in other words, multiplies x by itself n times and returns the result.

// pow(3, 2) = 3 * 3 = 9
// pow(3, 3) = 3 * 3 * 3 = 27
// pow(1, 100) = 1 * 1 * ...* 1 = 1
// Create a web-page that prompts for x and n, and then shows the result of pow(x,n).

// P.S. In this task the function should support only natural values of n: integers up from 1.

function calPow(num1, num2){
    let result = 1;
    for (let i = 1; i <= num2; i++){
        result = result * num1
    }
    return result;
}

console.log(calPow(3, 2));   // 9
console.log(calPow(3, 3));   // 27
console.log(calPow(1, 100)); // 1
console.log(calPow(2, 4));   // 16

