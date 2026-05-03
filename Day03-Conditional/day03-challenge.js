/* File: day03-challenge.js

Requirements:
- const playerChoice = "rock"   (hardcode)
- const computerChoice = "scissors"  (hardcode)
- if/else if/else หาผู้ชนะ
  - rock beats scissors
  - scissors beats paper
  - paper beats rock
- เสมอ -> "It's a tie!"
- ทดสอบ 5 combinations โดยเปลี่ยนค่า

Bonus: rewrite using switch instead of if/else */

const playerChoice = "scissors";
const computerChoice = "rock";

if(playerChoice === computerChoice){
    console.log("It's a tie!");
}else if(
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "rock")
    ){
        console.log("Player win!");
    }else{
        console.log("Computer win!");
    }
 
const combo = playerChoice + " vs " + computerChoice
switch(combo){
    case "rock vs rock":
    case "paper vs paper":
    case "scissors vs scissors":
        console.log("It's a tie!");
        break;
    case "rock vs scissors":
    case "scissors vs paper":
    case "paper vs rock":
        console.log("Player win!");
        break;
    default:
        console.log("Computer win!");
}