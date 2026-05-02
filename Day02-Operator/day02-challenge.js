//Tip Calculator 

// const billAmount = 1250
// const numberOfPeople = 4
// const tipPercentage = 10

// Requirements:
// Calculate tip amount from bill
// Calculate total (bill + tip)
// Calculate how much each person pays
// Use % to check if it divides evenly -> if not, console.log "Remainder: X baht"
// Display results in Thai

const billAmount = 1250;
const numberOfPeople = 4;
const tipPercentage = 10;

const tipAmount = billAmount * 10 / 100;
const total = tipAmount + billAmount;
const eachPersonPays = Math.floor(total / numberOfPeople);
const remainder = total - (eachPersonPays * numberOfPeople);

console.log("Bill Amount: "+billAmount+" baht");
console.log("Tip Amount: "+tipAmount+" baht");
console.log("Total: "+total+" baht");
console.log("Each Person Pays: "+eachPersonPays+" baht");

if(remainder !== 0){
    console.log("Remainder: "+remainder+" baht");
}