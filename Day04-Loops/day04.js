// Task 1: Multiplication table
// Use a for loop to print the multiplication table of 7 (from 1 to 12)
// Output format: "7 x 1 = 7"

for(let a = 1; a <= 12; a++){
  let b = 7 * a;
  console.log(7 + " x " + a + " = " + b);
}

// Task 2: Sum 1-100
// Use a for loop to calculate the sum of numbers from 1 to 100
// Output the final sum (should be 5050)
let sum = 0;

for(let c = 0; c <= 100; c++){
  sum += c;
}
console.log("Sum of 1 to 100: " + sum); //=+ reset value, += บวกเพิ่ม

// Task 3: While countdown
// Use a while loop to count down from 10 to 1
// After countdown ends, print "Launch!"

let d = 10;

while(d >= 1){
  console.log(d);
  d--;
}
console.log("Launch !");

// Task 4: FizzBuzz 1-100
// A counting game where players say a word instead of certain numbers:
// - Say "Fizz" instead of multiples of 3
// - Say "Buzz" instead of multiples of 5
// - Say "FizzBuzz" instead of multiples of both
// - Otherwise say the number

for(let e = 1; e <= 100; e++){
  if(e % 3 === 0 && e % 5 === 0){
    console.log("FizzBuzz");
  }else if(e % 3 === 0){
    console.log("Fizz");
  }else if(e % 5 === 0){
    console.log("Buzz");
  }else{
    console.log(e);
  }
}





// Challenge: Star Patterns (const size = 5)
// Pattern 1: Left-aligned triangle
// Pattern 2: Right-aligned triangle (use spaces)
// Pattern 3: Pyramid (centered)