'use strict';

// Constant Score Matrix
var scoreMatrix = [
  [[1,1,1,1,1,1],4000],
  [[1,2,3,4,5,6],3200],
  [[2,2,2,2,2,2],3200],
  [[3,3,3,3,3,3],3200],
  [[4,4,4,4,4,4],3200],
  [[5,5,5,5,5,5],3200],
  [[6,6,6,6,6,6],3200],
  [[1,1,1,2,2,2],3200],
  [[1,1,1,3,3,3],3200],
  [[1,1,1,4,4,4],3200],
  [[1,1,1,5,5,5],3200],
  [[1,1,1,6,6,6],3200],
  [[2,2,2,3,3,3],3200],
  [[2,2,2,4,4,4],3200],
  [[2,2,2,5,5,5],3200],
  [[2,2,2,6,6,6],3200],
  [[3,3,3,4,4,4],3200],
  [[3,3,3,5,5,5],3200],
  [[3,3,3,6,6,6],3200],
  [[4,4,4,5,5,5],3200],
  [[4,4,4,6,6,6],3200],
  [[5,5,5,6,6,6],3200],
  [[1,1,2,2,3,3],3200],
  [[1,1,2,2,4,4],3200],
  [[1,1,2,2,5,5],3200],
  [[1,1,2,2,6,6],3200],
  [[1,1,3,3,4,4],3200],
  [[1,1,3,3,5,5],3200],
  [[1,1,3,3,6,6],3200],
  [[1,1,4,4,5,5],3200],
  [[1,1,5,5,6,6],3200],
  [[2,2,3,3,4,4],3200],
  [[2,2,3,3,5,5],3200],
  [[2,2,3,3,6,6],3200],
  [[2,2,4,4,5,5],3200],
  [[2,2,4,4,6,6],3200],
  [[2,2,5,5,6,6],3200],
  [[3,3,4,4,5,5],3200],
  [[3,3,4,4,6,6],3200],
  [[3,3,5,5,6,6],3200],
  [[4,4,5,5,6,6],3200],
  [[1,1,1,1,1], 3000],
  [[6,6,6,6,6], 1800],
  [[5,5,5,5,5], 1500],
  [[4,4,4,4,4], 1200],
  [[3,3,3,3,3], 900],
  [[2,2,2,2,2], 600],
  [[1,1,1,1], 2000],
  [[6,6,6,6], 1200],
  [[5,5,5,5], 1000],
  [[4,4,4,4], 800],
  [[3,3,3,3], 600],
  [[2,2,2,2], 400],
  [[1,1,5,5], 300],
  [[1,1,1], 1000],
  [[6,6,6], 600],
  [[5,5,5], 500],
  [[4,4,4], 400],
  [[3,3,3], 300],
  [[2,2,2], 200],
  [[1], 100],
  [[5], 50]
];

/***
 * Get Score and Return Remaining Dice
 * @param {array} rollToCheck A Numeric Array of Dice to Check.
 * @returns {array} [score, [diceEligibleToRollAgain]]
 */
function getScore(rollToCheck) {
  let score = 0;
  var remainingDiceString = rollToCheck.sort().toString();
  for (let i = 0; i < scoreMatrix.length; i++) {
    let scoreString = scoreMatrix[i][0].toString();
    if (remainingDiceString.includes(scoreString)) {
      // Do Some Regex to remove score strings already counted, duplicate, leading, and trailing commas
      remainingDiceString = remainingDiceString.replace(scoreString, '').replace(/,+/g,',').replace(/(^,)|(,$)/g, '');
      score += scoreMatrix[i][1];
    }
  }

  // Create Remaining Dice
  if (score) {
    if (remainingDiceString.length > 1) {
      remainingDiceString = remainingDiceString.split(',');
    } else {
      remainingDiceString = Array.from(remainingDiceString);
    }
  } else {
    remainingDiceString = [];
  }

  // Convert Remaining Dice to Numbers
  let diceEligibleToRollAgain = []
  remainingDiceString.forEach(dice => {
    diceEligibleToRollAgain.push(+dice);
  })
  // Return Score and Remaining Dice
  return [score, diceEligibleToRollAgain]
}

// Test Cases
console.log('Should Be 4000: ', getScore([1,1,1,1,1,1]));
console.log('Should Be 300: ', getScore([3,2,3,4,2,3]));
console.log('Should Be 300: ', getScore([1,1,5,5]));
console.log('Should Be 50: ', getScore([4,4,2,3,5,6]));
console.log('Should Be 150: ', getScore([4,3,1,1,5]));
console.log('Should Be 450: ', getScore([4,4,4,5]));
console.log('Should Be 400: ', getScore([4,4,4]));
console.log('Should Be 0: ', getScore([4,4]));
console.log('Should Be 50: ', getScore([5]));
console.log('Should Be 50: ', getScore([5,4]));
