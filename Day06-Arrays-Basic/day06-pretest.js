// Day 06 Pretest
// Rule: no Google / no AI / no old files

/*
Pre-Assessment: Score Tracker

Task:
Create a small program that tracks scores for 5 students.

Requirements:
1. Store 5 student scores.
2. Find the highest score.
3. Calculate the average score.
4. Count how many students passed.

Passing rule:
- A student passes if their score is greater than or equal to 50.

Questions:
1. If you use variables like s1, s2, s3, s4, s5, does the code feel repetitive?
Ans: Yes, code feel repettitive.
2. Can you think of a better way to store many related values?
Ans: I am not sure yet.
3. What part of the code would become easier if the scores were stored together?
Ans: Finding the highest score, calculating the average, and counting passed students would become easier.
*/

//Planner
// Input: 5 student scores
// Output: highest score, average score, and number of pass students.
// Helper variables: highestScore, totalScore, averageScore, passedCount.
// Repeat: none
// Each round: none
// Return / Print: print highest score, average score, and number of passed students.

let score1 = 80;
let score2 = 45;
let score3 = 60;
let score4 = 90;
let score5 = 50;

function calHighestScore(score1, score2, score3, score4, score5){
    let hightestScore = score1;
    if(hightestScore  < score2){
        hightestScore = score2;
    }
    if(hightestScore < score3){
        hightestScore = score3;
    }
    if(hightestScore < score4){
        hightestScore = score4;
    }
    if(hightestScore < score5){
        hightestScore = score5;
    }
    return hightestScore;
}

function avgScore(score1, score2, score3, score4, score5){
    return avgScore = (score1 + score2 + score3 + score4 + score5)/5;
}

function calPassStudentNumber(score1, score2, score3, score4, score5){
    let passScore = 50;
    let passNumber = 0;
    if(score1 >= 50){
        passNumber += 1;
    }
    if(score2 >= 50){
        passNumber += 1;
    }
    if(score3 >= 50){
        passNumber += 1;
    }
    if(score4 >= 50){
        passNumber += 1;
    }
    if(score5 >= 50){
        passNumber += 1;
    }
    return passNumber;
}

console.log("Highest score:" + calHighestScore(score1, score2, score3, score4, score5));
console.log("Average Score: " + avgScore(score1, score2, score3, score4, score5));
console.log("Pass Student Number: " + calPassStudentNumber(score1, score2, score3, score4, score5));