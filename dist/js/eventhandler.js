
'use strict';

const boardRack = document.getElementById("board-rack");
const playerRack = document.getElementById("player-rack");

let dieOne = document.getElementById("1");
let dieTwo = document.getElementById("2");
let dieThree = document.getElementById("3");
let dieFour = document.getElementById("4");
let dieFive = document.getElementById("5");
let dieSix = document.getElementById("6");



let rollDiceButton = document.getElementById("roll-dice-button");

function handleClick(event) {
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

rollDiceButton.addEventListener('click', handleClick);