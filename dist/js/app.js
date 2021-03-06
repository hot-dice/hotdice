'use strict';
// Globals
const players = []; // JSON.parse(localStorage.getItem('Player_List')) || [];
const dice = []; //JSON.parse(localStorage.getItem('Dice_List')) || [];

// Global Selectors
let gameBoard = document.querySelector('#board-area ul');
let holdArea = document.querySelector('#dice-hold-area ul');
let roundScore = document.querySelector('#round-score');
/***
 * InitGame
 */
function Game() {
  this.gameActive = true;
  this.activePlayer;
  this.newGame();
};

Game.prototype.newGame = function() {
// Init Our Player Objects - Temporary for now
  if (localStorage.getItem('Player_List') === null) {
    new Player('Test00');
    new Player('Test01');
  }
};

/***
 * Die Object Constructor Function
 * @param {string} value
 */
function Dice(value) {
  this.value = value;
  this.src = `assets/die-${value}.png`;
  this.altText = `Die with value: ${value}`;
  this.createDie();
};

Dice.prototype.createDie = function() {
  dice.push(this);
  localStorage.setItem('Dice_List', JSON.stringify(dice));
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
    let newDie = document.createElement('img');
    newDie.src = die.src;
    newDie.alt = die.altText;
    newDie.classList += 'die'
    listItem.appendChild(newDie);
    renderLocation.appendChild(listItem);
  });
};

function renderRoundScore(score) {
  roundScore.textContent = score;
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
 * Player Object Constructor Function
 * @param {string} playerName
 */
function Player(playerName) {
  this.name = playerName;
  this.id = uuidv4();
  this.totalScore = 0;
  this.roundScore = 0;
  this.diceHeld = [];
  this.diceRolled = [];
  this.createPlayer();
};

// Player ProtoTypes
// Add round score to total and reset player round state
Player.prototype.addRoundScoreToTotal = function() {
  this.totalScore += roundScore;
  this.roundScore = 0;
  this.diceHeld = [];
  this.diceRolled = [];
  this.saveState();
};

// Hold dice that are valid to hold and passed to this function
Player.prototype.holdDice = function(dice) {
  let tempDice = getScore(dice);
  this.diceHeld.push.apply(this.diceHeld, tempDice.diceToScore);
  this.roundScore += tempDice.score;
  this.diceRolled = dice.filter(die => !this.diceHeld.includes(die));
  this.saveState();
  renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
  if (this.diceHeld.length < 7) {
    renderDieImgElements(convertToDiceArrayOfObjects(this.diceHeld), '#dice-hold-area ul');
  } else {
    while (holdArea.lastChild) { 
      holdArea.removeChild(holdArea.lastChild);
    }
  }
  if (this.diceHeld.length === 6) { // HOT DICE!!!
    this.diceHeld = [];
    let hotDice = document.createElement('img');
    hotDice.src = 'assets/gear50x50.png'
    hotDice.altText = 'You Have Hot Dice Roll Again or Stay'
    hotDice.class += 'hot-dice';
    gameBoard.append(hotDice);
  }
  
  renderRoundScore(this.roundScore);
  return this.diceHeld;
};

// Roll those dice
Player.prototype.rollDice = function(numberOfDiceToRoll = this.diceRolled.length || 6) {
  this.diceRolled = getRandom(numberOfDiceToRoll);
  renderDieImgElements(convertToDiceArrayOfObjects(this.diceRolled));
  if (this.diceHeld.length === 0) {
    while (holdArea.lastChild) { 
      holdArea.removeChild(holdArea.lastChild);
    }
  }
  this.saveState();
  return this.diceRolled;
};

// Create player objects and push to players and save to localStorage
Player.prototype.createPlayer = function() {
  players.push(this);
  localStorage.setItem('Player_List', JSON.stringify(players));
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

// TODO maybe consolidate this into something else
Player.prototype.clearRoundScore = function() {
  this.roundScore = 0;
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

// Test Cases for getScore
var time1 = performance.now();
console.log('Should Be 4000: ', getScore([1,1,1,1,1,1]));
console.log('Should Be 300: ', getScore([3,2,3,4,2,3]));
console.log('Should Be 300: ', getScore([1,1,5,5]));
console.log('Should Be 50: ', getScore([4,4,2,3,5,6]));
console.log('Should Be 250: ', getScore([4,3,1,1,5]));
console.log('Should Be 450: ', getScore([4,4,4,5]));
console.log('Should Be 400: ', getScore([4,4,4]));
console.log('Should Be 0: ', getScore([4,4]));
console.log('Should Be 50: ', getScore([5]));
console.log('Should Be 50: ', getScore([5,4]));
console.log('Should Be 100: ', getScore([5,5]));
console.log('Should Be 200: ', getScore([1,1]));
console.log('Should Be 200: ', getScore([1,1,2,3,4,6]));
console.log('Should Be 150: ', getScore([1,5]));
console.log('Should Be 150: ', getScore([3,1,5,4]));
console.log('Should Be 1200: ', getScore([4,4,4,4,4]));
console.log('Should Be 1300: ', getScore([4,4,4,4,4,1]));
console.log('Should Be 2100: ', getScore([1,5,1,5,1,1]));
var time2 = performance.now();
console.log(`Time Elapsed: ${(time2 - time1) / 1000} seconds.`);

new Game;