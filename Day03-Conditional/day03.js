/* if (a string with zero)
importance: 5
Will output be shown? */
if("0"){
    console.log("Hello"); //Show Hello because "0" is string include if([]), if({}). String is truthy
}

/* The name of JavaScript
importance: 2
Using the if..else construct, write the code which asks: ‘What is the “official” name of JavaScript?’

If the visitor enters “ECMAScript”, then output “Right!”, otherwise – output: “You don’t know? ECMAScript!” */

const x = "ECMAScript";
if (x === "ECMAScript"){
    console.log("Right!");
}else{
    console.log("You don't know? ECMAScript!");
}

/* Show the sign
importance: 2
Using if..else, write the code which gets a number via prompt and then shows in alert:

1, if the value is greater than zero,
-1, if less than zero,
0, if equals zero.
In this task we assume that the input is always a number. */

const a = 1;

if(a > 0){
    console.log("Input is more than 0.");
}else if(a < 0){
    console.log("Input is less than 0.");
}else{
    console.log("Input is equal to 0.");
}

/* Rewrite 'if' into '?'
importance: 5
Rewrite this if using the conditional operator '?':

let result;

if (a + b < 4) {
  result = 'Below';
} else {
  result = 'Over';
} */

const n = 1;
const m = 1;
let result = (n + m < 4) ? "Below" : "Over";
console.log(result)

/* Rewrite 'if..else' into '?'
importance: 5
Rewrite if..else using multiple ternary operators '?'.

For readability, it’s recommended to split the code into multiple lines.

let message;

if (login == 'Employee') {
  message = 'Hello';
} else if (login == 'Director') {
  message = 'Greetings';
} else if (login == '') {
  message = 'No login';
} else {
  message = '';
} */

let login = "Director";

const message = (login === "Employee") ? "Hello" :
    (login === "Director") ? "Greetings" :
    (login === "") ? "No login" :
    "";

console.log(message);

/* Write a leap year checker using if/else.

Logic (order matters!):
- divisible by 400 -> leap year (Yes)
- divisible by 100 -> NOT leap year (No)
- divisible by 4   -> leap year (Yes)
- anything else    -> NOT leap year (No)

Test with these years: 2000, 2020, 2100, 2024, 1900

Expected output:
2000 -> leap year
2020 -> leap year
2100 -> NOT leap year
2024 -> leap year
1900 -> NOT leap year */

const year2000 = 2000
const year2020 = 2020
const year2100 = 2100
const year2024 = 2024
const year1900 = 1900

if (year2000 % 400 === 0){
    console.log("Leap year");
}else if(year2000 % 100 === 0){
    console.log("NoT leap year");
}else if(year2000 % 4 === 0){
    console.log("Leap year");
}else{
    console.log("Not leap year");
}

if (year2020 % 400 === 0){
    console.log("Leap year");
}else if(year2020 % 100 === 0){
    console.log("NoT leap year");
}else if(year2020 % 4 === 0){
    console.log("Leap year");
}else{
    console.log("Not leap year");
}

if (year2100 % 400 === 0){
    console.log("Leap year");
}else if(year2100 % 100 === 0){
    console.log("Not leap year");
}else if(year2100 % 4 === 0){
    console.log("Leap year");
}else{
    console.log("Not leap year");
}

if (year2024 % 400 === 0){
    console.log("Leap year");
}else if(year2024 % 100 === 0){
    console.log("Not leap year");
}else if(year2024 % 4 === 0){
    console.log("Leap year");
}else{
    console.log("Not leap year");
}

if (year1900 % 400 === 0){
    console.log("Leap year");
}else if(year1900 % 100 === 0){
    console.log("Not leap year");
}else if(year1900 % 4 === 0){
    console.log("Leap year");
}else{
    console.log("Not leap year");
}