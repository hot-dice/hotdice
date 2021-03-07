'use strict';
// Globals
const players = [];
var game;

// Global Selectors
const gameBoardElement = document.querySelector('#board-area ul');
const holdAreaElement = document.querySelector('#dice-hold-area ul');
const roundScoreElement = document.querySelector('#round-score');
const player1score = document.querySelector('#player1-score');
const player2score = document.querySelector('#player2-score');
var rollingDice = document.querySelectorAll('#board-area .die');

// Retrieve From localStorage
const retrievedPlayers = JSON.parse(localStorage.getItem('Player_List'));
if (retrievedPlayers) {
  retrievedPlayers.forEach(item => {
    new Player(item.name, item.isTurn, item.id, item.totalScore, item.roundScore, item.diceHeld, item.diceRolled);
    if(item.isTurn) {
      renderDieImgElements(convertToDiceArrayOfObjects(item.diceHeld), '#dice-hold-area ul');
      renderDieImgElements(convertToDiceArrayOfObjects(item.diceRolled), '#board-area ul');
      renderRoundScore(item.roundScore);
    }
  });
}

/***
 * InitGame
 */
function Game() {
  this.gameActive = true;
  this.turnCount = 0;
  this.activePlayer;
  this.newGame();
  this.checkState();
};
Game.prototype.saveState = function() {
  game = this;
  console.log('Game Saved')
  localStorage.setItem('Game', JSON.stringify(game));
}

Game.prototype.newGame = function() {
  // TODO: ADD Modal TO have players select 1 or 2 player - If 1 player make a computer player else have to entires for names
  if (localStorage.getItem('Player_List') === null) {
    new Player('Test00', true);
    new Player('Test01');
  }
  game = this;
  localStorage.setItem('Game', JSON.stringify(game));
}

// See who's turn it is
Game.prototype.checkState = function() {
  if (this.gameActive) {
    if(this.turnCount % 2 === 0){
      this.activePlayer = players[0];
      players[0].isTurn = true;
      players[1].isTurn = false;
    } else {
      this.activePlayer = players[1];
      players[0].isTurn = false;
      players[1].isTurn = true;
    }
    players.forEach(player => {
      if(player.totalScore >= 10000) {
        this.gameActive = false;
      }
    });
  } else {
    console.log('Game Has Ended')
  }
}

/***
 * Player Object Constructor Function
 * @param {string} playerName
 */
function Player(playerName, isTurn = false, id = uuidv4(), totalScore = 0, roundScore = 0, diceHeld = [], diceRolled = []) {
  this.name = playerName;
  this.id = id;
  this.totalScore = totalScore;
  this.roundScore = roundScore;
  this.diceHeld = diceHeld;
  this.diceRolled = diceRolled;
  this.isTurn = isTurn;
  // Create player objects and push to players and save to localStorage
  players.push(this);
  localStorage.setItem('Player_List', JSON.stringify(players));
};

// Player ProtoTypes
// Add round score to total and reset player round state
Player.prototype.addRoundScoreToTotal = function() {
  this.totalScore += this.roundScore;
  this.roundScore = 0;
  this.diceHeld = [];
  this.diceRolled = [];
  this.saveState();
};

// Hold dice that are valid to hold and passed to this function
Player.prototype.holdDice = function(dice) {
  let tempDice = getScore(dice);
  this.roundScore += tempDice.score;
  this.diceHeld = [];
  this.diceRolled = [];
  clearBoard();
  renderRoundScore(0);
  this.addRoundScoreToTotal()
  game.turnCount += 1;
  game.checkState();
  game.saveState();
  this.saveState();
  return this.diceHeld;
};

// Roll those dice bb
Player.prototype.rollDice = function(numberOfDiceToRoll = this.diceRolled.length || 6) {
  let diceOnTable = document.querySelectorAll('.die');
  let dice = passSelectedDice();
  let tempDice = getScore(dice);
  if (dice.length || diceOnTable.length !== 0) {
    this.roundScore += tempDice.score;
    renderRoundScore(this.roundScore);
    console.log('tempDice: ', tempDice)
    this.diceHeld.push.apply(this.diceHeld, tempDice.diceToScore);
    this.saveState();
    renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
    if (this.diceHeld.length < 7) {
      renderDieImgElements(convertToDiceArrayOfObjects(this.diceHeld), '#dice-hold-area ul');
    } else {
      while (holdAreaElement.lastChild) { 
        holdAreaElement.removeChild(holdAreaElement.lastChild);
      }
    }
    if (this.diceHeld.length >= 6) { // HOT DICE!!!
      this.diceHeld = [];
      clearBoard();
      let hotDice = document.createElement('img');
      hotDice.src = 'assets/gear50x50.png'
      hotDice.altText = 'You Have Hot Dice Roll Again or Stay'
      hotDice.class += 'hot-dice';
      gameBoardElement.append(hotDice);
    }
  }
  this.diceRolled = getRandom(6 - this.diceHeld.length);
  this.saveState();
  renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
  rollingDice = document.querySelectorAll('#board-area .die');
  let bustCheck = getScore(this.diceRolled);
  if (bustCheck.score === 0 && bustCheck.diceToRollAgain.length === 0 && bustCheck.diceToScore.length === 0) {
    clearBoard();
    roundScoreElement.textContent = 'BUST!!!'
    this.diceHeld = [];
    this.diceRolled = [];
    this.roundScore = 0;
    game.turnCount += 1;
    game.checkState();
    game.saveState();
  } else {
    renderRoundScore(this.roundScore);
    this.roundScore += tempDice.score;
  }
  this.saveState();
  if (this.diceHeld.length === 0) {
    while (holdAreaElement.lastChild) { 
      holdAreaElement.removeChild(holdAreaElement.lastChild);
    }
  }
  game.checkState();
  game.saveState();
  this.saveState();
};

// Update the correct player object
Player.prototype.saveState = function() {
  if(players.length) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === this.id) {
        players[i] = this;
        break;
      }
    }
  }
  localStorage.setItem('Player_List', JSON.stringify(players));
};

// Global Functions
function renderDieImgElements(diceArray = dice, selectorToRenderIn = '#board-area ul') {
  // Remove existing dice elements if present
  let renderLocation = document.querySelector(`${selectorToRenderIn}`);
  while (renderLocation.lastChild) { 
    renderLocation.removeChild(renderLocation.lastChild);
  }
  // Convert list
  diceArray.forEach((die) => {
    let listItem = document.createElement('li');
    listItem.value = die.value;
    listItem.setAttribute('selected', false);
    let newDie = document.createElement('img');
    newDie.src = die.src;
    newDie.alt = die.altText;
    newDie.classList += 'die'
    listItem.appendChild(newDie);
    renderLocation.appendChild(listItem);
  });
};

// Global Functions
function clearBoard(){
  while (holdAreaElement.lastChild) { 
    holdAreaElement.removeChild(holdAreaElement.lastChild);
  }
  while (gameBoardElement.lastChild){
    gameBoardElement.removeChild(gameBoardElement.lastChild);
  }
}

function renderRoundScore(score) {
  roundScoreElement.textContent = score;
};

function convertToDiceArrayOfObjects(inputArray) { // [1,2,3,4]
  const objectArray = [];
  inputArray.forEach(item => {
    let tempObject = {};
    tempObject.value = item;
    tempObject.src = `assets/die-${item}.png`;
    tempObject.altText = `Die with value: ${item}`;
    objectArray.push(tempObject);
  });
  return objectArray;
};


/***
 * Calculates score, remaining dice, and scored dice
 * @param {array} rollToCheck Array of numbers e.g. `[5,4,4,3]`
 * @returns {object} An object e.g `{score: 50, diceToRollAgain: [3,4,4], diceToStore: [5]}`
 */
function getScore(rollToCheck) {
  let score = 0;
  let savedDiceString = '';
  let remainingDiceString = rollToCheck.sort().toString();
  for (let i = 0; i < scoreTuples.length; i++) {
    if (remainingDiceString.includes(scoreTuples[i][0])) {
      // Append to saved dice string
      savedDiceString += `${scoreTuples[i][0]},`;
      // Remove score string that matches; use regex to remove duplicate, leading, and trailing commas
      remainingDiceString = remainingDiceString.replace(scoreTuples[i][0], '').replace(/,+/g,',').replace(/(^,)|(,$)/g, '');
      score += scoreTuples[i][1];
    }
  }
  // Clean last comma from savedDiceString
  savedDiceString = savedDiceString.replace(/(,$)/g, '');

  var diceToStore = [];
  var diceToRollAgain = [];
  // Didn't Bust
  if (score) {
    let remainingDiceArray = [];
    let savedDiceArray = [];
    if (remainingDiceString.length > 1) {
      remainingDiceArray = remainingDiceString.split(',');
    } else {
      remainingDiceArray = Array.from(remainingDiceString);
    }
    if (savedDiceString.length > 1) {
      savedDiceArray = savedDiceString.split(',');
    } else {
      savedDiceArray = Array.from(savedDiceString);
    }
    // Convert Remaining Dice to Numbers if score
    remainingDiceArray.forEach(dice => {
      diceToRollAgain.push(+dice);
    });
    savedDiceArray.forEach(dice => {
      diceToStore.push(+dice);
    });
  }

  // Return Score, Dice Eligible To Roll Again And Dice To Store As An Object
  // return [score, diceToRollAgain, diceToStore]; // Slightly faster and more consistent with objects
  return {score: score, diceToRollAgain: diceToRollAgain, diceToScore: diceToStore}
};

/***
 * Calculates an array of random number(s)
 * @param {number} numberOfRandoms A int of number of desired random e.g. `6`
 * @param {number} [min=1] The minimum number for random values inclusive
 * @param {number} [max=6] The maximum number for random inclusive 
 * @returns {array} An array of random numbers `[1,2,4,2,5,6]`
 */
function getRandom(numberOfRandoms, min = 1, max = 6) {
  let randomNumberArray = [];
  for (let i = 0; i < numberOfRandoms; i++) {
    let randomBuffer = new Uint32Array(1); // Creates a new Uint32Array object.
    (window.crypto || window.msCrypto).getRandomValues(randomBuffer); // Get cryptographically strong random values
    let randomFloat = randomBuffer[0] / (0xffffffff + 1); // Translate from a random integer to a floating point from 0 to 1
    randomNumberArray.push(Math.floor(randomFloat * (max - min + 1)) + min);
  }
  return randomNumberArray;
};

/***
 * Creates a random UUID
 * @returns {string} A cryptographically secure UUID
 */
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

// Get Selected Dice Form DOM
function passSelectedDice() {
  let tempArray = [];
  let selected = document.querySelectorAll("li[selected='true']");
  selected.forEach(item => {
    tempArray.push(+item.value);
  });
  return tempArray;
} 

// Event Handler
function handleDiceClick(event) {
  var li = event.target.closest('li');
  if (li && li.parentNode.parentNode.id === 'board-area') {
    if (li.getAttribute('selected') === 'false') {
      li.setAttribute('selected', true);
    } else {
      li.setAttribute('selected', false);
    }
  }
};

// Attach Event Handler
document.body.addEventListener('click', handleDiceClick);

// Init Game
new Game;

// // Test Cases for getScore
// var time1 = performance.now();
// console.log('Should Be 4000: ', getScore([1,1,1,1,1,1]));
// console.log('Should Be 300: ', getScore([3,2,3,4,2,3]));
// console.log('Should Be 300: ', getScore([1,1,5,5]));
// console.log('Should Be 50: ', getScore([4,4,2,3,5,6]));
// console.log('Should Be 250: ', getScore([4,3,1,1,5]));
// console.log('Should Be 450: ', getScore([4,4,4,5]));
// console.log('Should Be 400: ', getScore([4,4,4]));
// console.log('Should Be 0: ', getScore([4,4]));
// console.log('Should Be 50: ', getScore([5]));
// console.log('Should Be 50: ', getScore([5,4]));
// console.log('Should Be 100: ', getScore([5,5]));
// console.log('Should Be 200: ', getScore([1,1]));
// console.log('Should Be 200: ', getScore([1,1,2,3,4,6]));
// console.log('Should Be 150: ', getScore([1,5]));
// console.log('Should Be 150: ', getScore([3,1,5,4]));
// console.log('Should Be 1200: ', getScore([4,4,4,4,4]));
// console.log('Should Be 1300: ', getScore([4,4,4,4,4,1]));
// console.log('Should Be 2100: ', getScore([1,5,1,5,1,1]));
// var time2 = performance.now();
// console.log(`Time Elapsed: ${(time2 - time1) / 1000} seconds.`);



// Some code that wasn't used
// while (this.gameActive) {
//   console.log(this.gameActive);
//   // Make the player move.
//   // Take player movement 
//   players.forEach((player, index) => {
//     if(player.isTurn && player.isBusted || player.isHeld) {
//       player.isTurn = false;
//       players[index + 1].isTurn = true;
//       this.activePlayer = players[index + 1];
//     }
//   });
//   // Check if the game is over.
//   players.forEach(player => {
//     if(player.totalScore >= 10000) {
//       this.gameActive = false;
//     }
//   });
// }
// };

// while (game.isActive) {
//   players.forEach(player => {
//     console.log(player.totalScore);
//     if(player.totalScore >= 1000) {
//       game[0].gameActive = false;
//       localStorage.setItem('Game', JSON.stringify(game));
//     }
//   });
// }