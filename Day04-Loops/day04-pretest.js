/* CHALLENGE: RPS 3 Rounds + Grade
Build a program that:

Hardcode playerChoice and computerChoice for 3 rounds (e.g. round 1: rock vs scissors, round 2: paper vs paper, round 3: scissors vs rock)
For each round, determine the winner using if/else logic
Scoring: win = +10, draw = +5, lose = +0
Accumulate score in let totalScore = 0
After all 3 rounds, assign a grade based on totalScore:

30 = A, 20-29 = B, 10-19 = C, 5-9 = D, 0 = F

console.log the final score + grade */


let playerScore = 0;
let computerScore = 0;
let playerTotalScore = 0;
let computerTotalScore = 0;
let round = 1;

//Round1
let playerChoice = "rock";
let computerChoice = "scissors";
    if(playerChoice === computerChoice){
        console.log("It's is a tie!");
        playerScore +=5;
        computerScore +=5;
    }else if(
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
        ){
            console.log("Player win!");
            playerScore +=10;
    }else{
        console.log("Computer win!");
        computerScore +=10;
    }    

//Round2
 playerChoice = "paper";
 computerChoice = "paper";
    if(playerChoice === computerChoice){
        console.log("It's is a tie!");
        playerScore +=5;
        computerScore +=5;
    }else if(
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
        ){
            console.log("Player win!");
            playerScore +=10;
    }else{
        console.log("Computer win!");
        computerScore +=10;
    }
    
//Round3
playerChoice = "scissors";
computerChoice = "rock";
    if(playerChoice === computerChoice){
        console.log("It's is a tie!");
        playerScore +=5;
        computerScore +=5;
    }else if(
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
        ){
            console.log("Player win!");
            playerScore +=10;
    }else{
        console.log("Computer win!");
        computerScore +=10;
    }


computerTotalScore = computerScore;
playerTotalScore = playerScore;

if(computerTotalScore === 30){
    console.log("Computer Grade: A" + " and Final Score: " + computerTotalScore);
}else if(computerTotalScore > 20){
    console.log("Computer Grade: B" + " and Final Score: " + computerTotalScore);
}else if (computerTotalScore > 10){
    console.log("Computer Grade: C" + " and Final Score: " + computerTotalScore);
}else if (computerTotalScore > 5){
    console.log("Computer Grade: D" + " and Final Score: " + computerTotalScore);
}else{
    console.log("Computer Grade: F" + " and Final Score: " + computerTotalScore);
}

if(playerTotalScore === 30){
    console.log("Player Grade: A" + " and Final Score: " + playerTotalScore);
}else if(playerTotalScore > 20){
    console.log("Player Grade: B" + " and Final Score: " + playerTotalScore);
}else if (playerTotalScore > 10){
    console.log("Player Grade: C" + " and Final Score: " + playerTotalScore);
}else if (playerTotalScore > 5){
    console.log("Player Grade: D" + " and Final Score: " + playerTotalScore);
}else{
    console.log("Player Grade: F" + " and Final Score: " + playerTotalScore);
}