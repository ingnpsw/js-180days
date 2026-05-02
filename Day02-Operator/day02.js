console.log(5 === "5");
console.log(5 == "5");

console.log(typeof "5"); //string
console.log(typeof 5); //number

console.log(typeof null); //object
console.log(typeof undefined); //undefined

let n = 10;
n *= 2;
console.log(n);

let m = 20;
m /= 4;
console.log(m);

//Task
//The postfix and prefix forms
//importance: 5
//What are the final values of all variables a, b, c and d after the code below?
let a = 1;
let c = ++a; // บวกก่อน -> a กลายเป็น 2 -> แล้วค่อยเก็บใส่ c
console.log(c); // 2

let b = 1;
let d = b++; // เก็บค่าเก่าใส่ d ก่อน -> d = 1 -> แล้วค่อยบวก b
console.log(d); // 1


//Assignment result
//importance: 3
//What are the values of a and x after the code below?

let y = 2;

let x = 1 + (y *= 2); // 1 + (2 * 2) = 5
console.log(x);

//Type conversions
//importance: 5
//What are results of these expressions?

console.log("1" + 1 + 0); //110
console.log("1" - 1 + 0); //0
console.log(true + false); //1 ture = 1, false = 0
console.log(6 / "3"); //2
console.log("2" * "3"); //6
console.log(4 + 5 + "px"); //9px
console.log("$" + 4 + 5); //$45
console.log("4" - 2); //2
console.log("4px" - 2); //NaN Not a Number
console.log("  -9  " + 5); // -9 5
console.log("  -9  " - 5); //-14
console.log(null + 1); //1
console.log(undefined + 1); //NaN Not a Number, undefined แปลงเป็น number ได้ NaN, NaN + 1 = NaN, NaN บวกอะไรก็ได้ NaN เสมอ
console.log(" \t \n" - 2); //-2
//\t = tab, \n = newline
//Think well, write down and then compare with the answer.

//BMI Calculator
const weight = 65;
const weightString = "65";
const height = 1.70;
let bmi = 0;
let bmiWeightString = "";
bmi = weight / (height ** 2);
bmiWeightString = weightString / (height ** 2);
console.log(bmi);
console.log(bmiWeightString);
console.log(bmi.toFixed(2));
console.log(bmiWeightString.toFixed(2));

//Temperature Converter
const celsius = 30;
let fahrenheitFomular = celsius * 9/5 + 32;

const fahrenheit = 86;
let celsiusFomular = (fahrenheit - 32) * 5/9;

console.log("30 Celsius to Fahrenheit: "+fahrenheitFomular);
console.log("100 Fahrenheit to Celsius: "+celsiusFomular);