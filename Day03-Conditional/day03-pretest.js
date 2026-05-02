/* Grade Calculator
- Hardcode 3 subjects: math=75, english=82, science=68
- Calculate the average
- console.log each subject score + typeof each variable
- Use % to check if the average is even or odd */

const math = 75;
const english = 82;
const science = 68;

const avg = (math+english+science)/3;
const isAvgEvenOrOdd = avg % 2;

console.log("Math: "+math+" "+"("+typeof math+")");
console.log("English: "+english+" "+"("+typeof english+")");
console.log("Science: "+science+" "+"("+typeof science+")");
console.log("Average: "+avg);

if(isAvgEvenOrOdd !== 0){
    console.log("Average is odd");
}else{
    console.log("Average is even");
}