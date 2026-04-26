let studentName = "John Smith";
const studentId = "01";

const subjects = [
    {subjectName: "Math", score: 9},
    {subjectName: "English", score: 8},
    {subjectName: "History", score: 7}
]

let total = subjects[0].score + subjects[1].score + subjects[2].score;
let average = total/3

console.log(typeof studentId);
console.log(studentId);
console.log(studentName);
console.log("Math = " + subjects[0].score);
console.log("English = " + subjects[1].score);
console.log("History = " + subjects[2].score);
console.log("Total Score = " + total);
console.log("Average Score = " + average);
