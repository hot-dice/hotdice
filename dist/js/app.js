'use strict';
// Globals
const players = [];
var game;

// Global Selectors
const gameBoardElement = document.querySelector('#board-area ul');
const holdAreaElement = document.querySelector('#dice-hold-area ul');
const roundScoreElement = document.querySelector('#round-score');
const player1area = document.querySelector('#player1-score');
const player2area = document.querySelector('#player2-score');
const player1name = document.querySelector('#player1-score span');
const player1score = document.querySelector('#player1-score p');
const player2name = document.querySelector('#player2-score span');
const player2score = document.querySelector('#player2-score p');
var rollingDice = document.querySelectorAll('#board-area .die');

// Retrieve From localStorage
const retrievedPlayers = JSON.parse(localStorage.getItem('Player_List'));
if (retrievedPlayers) {
  retrievedPlayers.forEach(item => {
    new Player(item.name, item.isTurn, item.id, item.totalScore, item.roundScore, item.diceHeld, item.diceRolled, item.timesRolled, item.timesHeld, item.unsorted, item.totalTurns);
    if(item.isTurn) {
      renderDieImgElements(convertToDiceArrayOfObjects(item.diceHeld), '#dice-hold-area ul');
      renderDieImgElements(convertToDiceArrayOfObjects(item.unsorted), '#board-area ul');
      renderRoundScore(item.roundScore);
    }
  });
}

/***
 * InitGame
 */
function Game(gameActive = true, turnCount = 0) {
  this.gameActive = gameActive;
  this.turnCount = turnCount;
  this.activePlayer;
  this.newGame();
  this.checkState();
};
Game.prototype.saveState = function() {
  game = this;
  players.forEach(player => {
    player.saveState();
  });
  localStorage.setItem('Game', JSON.stringify(game));
}

Game.prototype.newGame = function() {
  // TODO: ADD Modal TO have players select 1 or 2 player - If 1 player make a computer player else have to entires for names
  if (localStorage.getItem('Player_List') === null) {
    new Player('Player 1', true);
    new Player('Player 2');
  }
  game = this;
  game.saveState();
  checkCanRoll();
  checkCanStay();
  localStorage.setItem('Game', JSON.stringify(game));
  player1name.textContent = `${players[0].name}`;
  player2name.textContent = `${players[1].name}`;
}

// See who's turn it is
Game.prototype.checkState = function() {
  if (this.gameActive) {
    players.forEach(player => {
      if(player.totalScore >= 10000 && players[0].totalTurns === players[1].totalTurns) {
        this.gameActive = false;
        this.checkState();
      }
    });
    if(this.turnCount % 2 === 0){
      this.activePlayer = players[0];
      players[0].isTurn = true;
      players[1].isTurn = false;
      player1area.classList = 'bold';
      player2area.classList = '';
    } else {
      this.activePlayer = players[1];
      players[0].isTurn = false;
      players[1].isTurn = true;
      player1area.classList = '';
      player2area.classList = 'bold';
    }
    player1score.textContent = `${+players[0].totalScore}`;
    player2score.textContent = `${+players[1].totalScore}`;
  } else {
    // since it's just 2 players, it only needs to compare the two total scores for now
    if (players[0].totalScore < players[1].totalScore) {
      let modal = document.getElementById("winModal");
      let text = document.querySelector('#winModal div p');
      modal.style.display = "block";
      text.textContent = `Congratulations, ${players[1].name}, you win!`;
    } else if (players[0].totalScore > players[1].totalScore) {
      let modal = document.getElementById("winModal");
      let text = document.querySelector('#winModal div p');
      modal.style.display = "block";
      text.textContent = `Congratulations, ${players[0].name}, you win!`;
    } else {
      let modal = document.getElementById("winModal");
      let text = document.querySelector('#winModal div p');
      modal.style.display = "block";
      text.textContent = `Congratulations you tied!`;
    }
  }
}

/***
 * Player Object Constructor Function
 * @param {string} playerName
 */
function Player(playerName, isTurn = false, id = uuidv4(), totalScore = 0, roundScore = 0, diceHeld = [], diceRolled = [], timesRolled = -1, timesHeld = 0, unsorted = [], totalTurns = 0) {
  this.name = playerName;
  this.id = id;
  this.totalScore = totalScore;
  this.roundScore = roundScore;
  this.diceHeld = diceHeld;
  this.diceRolled = diceRolled;
  this.isTurn = isTurn;
  this.timesRolled = timesRolled;
  this.timesHeld = timesHeld;
  this.unsorted = unsorted;
  this.totalTurns = totalTurns;
  // Create player objects and push to players and save to localStorage
  players.push(this);
  if(players.length !== 1) { // Prevent race condition
    localStorage.setItem('Player_List', JSON.stringify(players));
  }
};

// Player ProtoTypes
// Add round score to total and reset player round state
Player.prototype.addRoundScoreToTotal = function() {
  this.totalTurns++;
  this.totalScore += this.roundScore;
  this.roundScore = 0;
  this.timesRolled = -1;
  this.timesHeld = 0;
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
  this.unsorted = [];
  this.timesRolled = -1;
  this.timesHeld = 0;
  clearBoard();
  renderRollingDice();
  renderRoundScore(0);
  this.addRoundScoreToTotal()
  game.turnCount += 1;
  game.checkState();
  game.saveState();
  this.saveState();
  return this.diceHeld;
};

Player.prototype.canRoll = function() {
  let canRoll = false;
  let diceSelected = document.querySelectorAll("#board-area li[selected='true']");
  let tempDiceToScore = []
  diceSelected.forEach(die => {
    tempDiceToScore.push(+die.value)
  });
  if (this.timesRolled === this.timesHeld - 1) {
    canRoll = true;
  } else if (this.timesRolled <= this.timesHeld && getScore(tempDiceToScore).score) {
    canRoll = true;
  } else {
    canRoll = false
  }
  return canRoll;
}

Player.prototype.canStay = function() {
  let canStay = false;
  let dice = document.querySelectorAll("#board-area li");
  if (dice.length !== 0) {
    canStay = true;
  }
  return canStay;
}

// Roll those dice bb
Player.prototype.rollDice = function(numberOfDiceToRoll = this.diceRolled.length || 6) {
  this.unsorted = [];
  this.timesRolled++;
  let diceOnTable = document.querySelectorAll('.die');
  let dice = passSelectedDice();
  let tempDice = getScore(dice);
  if (dice.length || diceOnTable.length !== 0) {
    this.roundScore += tempDice.score;
    this.timesHeld += 1;
    renderRoundScore(this.roundScore);
    this.diceHeld.push.apply(this.diceHeld, tempDice.diceToScore);
    this.saveState();
    // renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
    if (this.diceHeld.length < 7) {
      renderDieImgElements(convertToDiceArrayOfObjects(this.diceHeld), '#dice-hold-area ul');
    } else {
      while (holdAreaElement.lastChild) { 
        holdAreaElement.removeChild(holdAreaElement.lastChild);
      }
    }
    if (this.diceHeld.length >= 6) { // HOT DICE!!!
      this.diceHeld = [];
      this.diceRolled = [];
      this.unsorted = [];
      clearBoard();
      let hotDice = document.createElement('img');
      hotDice.src = 'assets/gear50x50.png'
      hotDice.altText = 'You Have Hot Dice Roll Again or Stay'
      hotDice.class += 'hot-dice';
      gameBoardElement.append(hotDice);
    }
  }
  this.diceRolled = getRandom(6 - this.diceHeld.length);
  this.diceRolled.forEach(item => {
    this.unsorted.push(item);
  });
  this.saveState();
  renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
  rollingDice = document.querySelectorAll('#board-area .die');
  let bustCheck = getScore(this.diceRolled);
  if (bustCheck.score === 0 && bustCheck.diceToRollAgain.length === 0 && bustCheck.diceToScore.length === 0) {
    clearBoard();
    roundScoreElement.textContent = 'BUST!!!'
    this.roundScore = 0;
    this.unsorted = [];
    this.addRoundScoreToTotal()
    game.turnCount += 1;
  } else {
    renderRoundScore(this.roundScore);
  }
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
  game.checkState();
};

// Global Functions
function renderRollingDice(){ // shows dice graphically rolling
  let board = document.querySelector('#board-area ul');
  for (let i = 0; i < 6; i++) {
    let img = document.createElement('img');
    img.src = 'assets/rolling-dice.gif';
    img.classList = 'roll-die';
    board.appendChild(img);
  }
}

function renderDieImgElements(diceArray = dice, selectorToRenderIn = '#board-area ul') {
  // Remove existing dice elements if present
  let renderLocation = document.querySelector(`${selectorToRenderIn}`);
  if(renderLocation) { 
    while (renderLocation.lastChild) { 
      renderLocation.removeChild(renderLocation.lastChild);
    }
  }
  // Convert list
  diceArray.forEach((die, index) => {
    let listItem = document.createElement('li');
    if(selectorToRenderIn === '#board-area ul') {
      listItem.tabIndex = index + 1;
    }
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

function checkCanRoll() {
  let canRoll = game.activePlayer.canRoll();
  document.querySelector('#roll-dice').disabled = !canRoll;
}

// Check player can stay
function checkCanStay() {
  let canStay = game.activePlayer.canStay();
  document.querySelector('#stay').disabled = !canStay;
}

document.querySelector('.close').onclick = function() { //closes modal with x button and restarts games
  document.querySelector(".modal").style.display = "none";
  localStorage.clear();
  document.location='/hotdice';
  
}

// Attach Event Handler
document.body.addEventListener('click', (e) => {
  handleDiceClick(e);
  checkCanRoll();
  checkCanStay();
});

document.body.addEventListener('keydown', (e) => {
  if (e.code === "Space") {
    handleDiceClick(e);
    checkCanRoll();
    checkCanStay();
  }
});

// Init Game
const retrieveGame = JSON.parse(localStorage.getItem('Game'));
if (retrieveGame) {
  new Game(retrieveGame.gameActive, retrieveGame.turnCount);
} else {
  new Game;
}
