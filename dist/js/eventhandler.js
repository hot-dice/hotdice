
'use strict';

const boardRack = document.getElementById("board-rack");
const playerRack = document.getElementById("player-rack");

// may not need these, keeping on standby for now
let dieOne = document.getElementById("1");
let dieTwo = document.getElementById("2");
let dieThree = document.getElementById("3");
let dieFour = document.getElementById("4");
let dieFive = document.getElementById("5");
let dieSix = document.getElementById("6");



let rollDiceButton = document.getElementById("roll-dice-button");

function handleRollClick(event) {
  event.preventDefault();

  // TODO invoke method to roll dice for current player

  dieOne.src = 'assets/1.png'; dieFour.src = 'assets/4.png'; //proof of life, delete after adding random rolls

  for (let i = 1; i < players[0].diceHeld.length + 1; i++){
    let die = document.getElementById(`${i}`); 
    die.src = `assets/${players[0].diceHeld[i-1]}.png`;
  }
  
  for (let i = 1; i < players[0].diceRolled.length + 1; i++){
    let die = document.getElementById(`${i}`); 
    die.src = `assets/${players[0].diceHeld[i-1]}.png`;
  } 
  
}

rollDiceButton.addEventListener('click', handleRollClick);



//////////////////////////////////////////



let rollingDice = document.getElementById("board-rack");

function handleDiceClick(event) {
  event.preventDefault();
  
  let diceClicked = event.target.getAttribute("id");
  let die = document.getElementById(diceClicked);
    
  console.log(die);
  if (die.alt === 'unselected') {
    die.style = 'opacity: 1';
    die.alt = 'selected';
  } else {
    die.style = 'opacity: 0.7';
    die.alt = 'unselected';
  }  
  
}
rollingDice.addEventListener('click', handleDiceClick);



// will use this function for event actions hold or roll
function passSelectedDice() {
  let tempArray = [];

  for (let i = 1; i < 6+1; i++) {
    if (document.getElementById(i).alt === 'selected') {
      tempArray.push(parseInt(document.getElementById(i).id)); 
    }
  }
  return tempArray;
} 

