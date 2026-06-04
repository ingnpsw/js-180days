// Find Event Number Planner
// Input: number
// Output: true if number is even, false if not
// Helper variable: none
// Repeat: none
// Each round: none
// Return: number % 2 === 0

//  function isEven(number){
//      return number % 2 === 0;
//  }

// console.log(isEven(2)); // true
// console.log(isEven(3)); // false
// console.log(isEven(0)); // true

//Find Odd Number Planner
// Input: number
// Output: true if number is odd, false if not
// Helper variable: none
// Repeat: none
// Each round: none
// Return: number % 2 !== 0

// function isOdd(number){
//     return number % 2 !== 0;
// }

// console.log(isOdd(3)); // true
// console.log(isOdd(2)); // false
// console.log(isOdd(0)); // false

// Factorial Number Planner
// Input: number
// Output: number
// Helper variable: result = 1
// Repeat: loop from 1 to n
// Each round: result = result * i
// Return: result

// function factorial(number){
//     let result = 1;
//     for(let i = 1; i <= number; i++){
//         result = result * i;
//     }
//     return result;
// }

// console.log(factorial(1)); // 1
// console.log(factorial(2)); // 2
// console.log(factorial(3)); // 6
// console.log(factorial(5)); // 120
// console.log(factorial(0)); // 1

// Find Maximum Number
// Input: num1, num2, num3
// Output: maximum number
// Helper variable: maxnum = num1
// Repeat: none
// Each round: none
// Return: maxnum

// function maxNumber(num1, num2, num3){
//     let maxnum = num1;
//     if(num2 > maxnum){
//         maxnum = num2;
//     }
//     if (num3 > maxnum){
//         maxnum = num3;
//     }
//     return maxnum;
// }

// console.log(maxNumber(1, 2, 3)) // 3
// console.log(maxNumber(10, 5, 7)) // 10
// console.log(maxNumber(-1, -5, -3)) // -1
// console.log(maxNumber(4, 4, 2)) // 4

//celsius to fahrenheit planner
// Input: celsius number
// Output: fahrenheit number
// Helper variable: none
// Repeat: none
// Each round: none
// Return: F = C * 9 / 5 + 32

// function celsiusToF(cel){
//     return cel * 9 / 5 + 32;
// }

// console.log(celsiusToF(0))    // 32
// console.log(celsiusToF(100))  // 212
// console.log(celsiusToF(37))   // 98.6
// console.log(celsiusToF(-40))  // -40

// Find Prime Number Planner
// Input: number
// Output: true if number is prime, false if not
// Helper variable: none
// Repeat: loop divisor from 2 to number - 1
// Each round: if number % divisor === 0, return false
// Return: true after loop finishes

function isPrime(number){
    if(number <= 1){
        return false;
    }
    for(let i = 2; i < number; i++){
        if(number % i === 0){
            return false;
        }
    }
    return true;
}

console.log(isPrime(2));  // true
console.log(isPrime(3));  // true
console.log(isPrime(4));  // false
console.log(isPrime(5));  // true
console.log(isPrime(9));  // false
console.log(isPrime(1));  // false
console.log(isPrime(0));  // false
console.log(isPrime(-7)); // false