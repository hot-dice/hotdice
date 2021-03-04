'use strict';

// Constant Score Tuples - An Array of Nested Pairings
var scoreTuples = [
  ['1,1,1,1,1,1',4000],
  ['1,1,1,1,1,1',4000],
  ['1,1,1,1,1,1',4000],
  ['1,2,3,4,5,6',3200],
  ['2,2,2,2,2,2',3200],
  ['3,3,3,3,3,3',3200],
  ['4,4,4,4,4,4',3200],
  ['5,5,5,5,5,5',3200],
  ['6,6,6,6,6,6',3200],
  ['1,1,1,2,2,2',3200],
  ['1,1,1,3,3,3',3200],
  ['1,1,1,4,4,4',3200],
  ['1,1,1,5,5,5',3200],
  ['1,1,1,6,6,6',3200],
  ['2,2,2,3,3,3',3200],
  ['2,2,2,4,4,4',3200],
  ['2,2,2,5,5,5',3200],
  ['2,2,2,6,6,6',3200],
  ['3,3,3,4,4,4',3200],
  ['3,3,3,5,5,5',3200],
  ['3,3,3,6,6,6',3200],
  ['4,4,4,5,5,5',3200],
  ['4,4,4,6,6,6',3200],
  ['5,5,5,6,6,6',3200],
  ['1,1,2,2,3,3',3200],
  ['1,1,2,2,4,4',3200],
  ['1,1,2,2,5,5',3200],
  ['1,1,2,2,6,6',3200],
  ['1,1,3,3,4,4',3200],
  ['1,1,3,3,5,5',3200],
  ['1,1,3,3,6,6',3200],
  ['1,1,4,4,5,5',3200],
  ['1,1,5,5,6,6',3200],
  ['2,2,3,3,4,4',3200],
  ['2,2,3,3,5,5',3200],
  ['2,2,3,3,6,6',3200],
  ['2,2,4,4,5,5',3200],
  ['2,2,4,4,6,6',3200],
  ['2,2,5,5,6,6',3200],
  ['3,3,4,4,5,5',3200],
  ['3,3,4,4,6,6',3200],
  ['3,3,5,5,6,6',3200],
  ['4,4,5,5,6,6',3200],
  ['1,1,1,1,1', 3000],
  ['6,6,6,6,6', 1800],
  ['5,5,5,5,5', 1500],
  ['4,4,4,4,4', 1200],
  ['3,3,3,3,3', 900],
  ['2,2,2,2,2', 600],
  ['1,1,1,1', 2000],
  ['6,6,6,6', 1200],
  ['5,5,5,5', 1000],
  ['4,4,4,4', 800],
  ['3,3,3,3', 600],
  ['2,2,2,2', 400],
  ['1,1,1', 1000],
  ['6,6,6', 600],
  ['5,5,5', 500],
  ['4,4,4', 400],
  ['3,3,3', 300],
  ['2,2,2', 200],
  ['1,1', 200],
  ['5,5', 100],
  ['1', 100],
  ['5', 50]
];

/***
 * Calculates Score, Remaining Dice, and Scored Dice
 * @param {array} rollToCheck A Numeric Array of Dice to Check - [1,3,2,4,1]
 * @returns {array} [score, [diceToRollAgain], [diceToStore]]
 */
function getScore(rollToCheck) {
  let score = 0;
  let savedDiceString;
  let remainingDiceString = rollToCheck.sort().toString();
  for (let i = 0; i < scoreTuples.length; i++) {
    if (remainingDiceString.includes(scoreTuples[i][0])) {
      // Do Some Regex to remove score strings already counted, duplicate, leading, and trailing commas
      savedDiceString = scoreTuples[i][0];
      remainingDiceString = remainingDiceString.replace(scoreTuples[i][0], '').replace(/,+/g,',').replace(/(^,)|(,$)/g, '');
      score += scoreTuples[i][1];
    }
  }

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
}

// Test Cases
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