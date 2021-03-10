'use strict';

function aiTurn () {
  let delayInMilliseconds = 1000;

  if (players[1].isTurn === true && players[1].roundScore >= 500) {
    setTimeout(function() {
      //your code to be executed after 1 second
      game.activePlayer.holdDice();
    }, delayInMilliseconds);
  } else if (players[1].isTurn === true && players[1].roundScore < 500) {
    setTimeout(function() {
      //your code to be executed after 1 second
      game.activePlayer.rollDice();
    }, delayInMilliseconds);
  } else if (players[1].isTurn === true && players[1].roundScore >= 500 && players[1].diceHeld.length >= 6) {
    setTimeout(function() {
      //your code to be executed after 1 second
      game.activePlayer.rollDice();
    }, delayInMilliseconds);
  }
}






AI logic

Iterate down through const scores and select the dice that gives the highest score. 
I believe Tom's getScore() function already does this.
 
if (round score >== 500)
hold() to pass turn

else
roll


if HOT DICE! (e.g. box car or all dice saved for score)
repeat above, roll until >== 500

AI never attempts to go for Hot Dice but if it gets it by chance before it can score 500 points, 
it will continue as if it is in a new round and try to score 500 again
Alternatively, to play it even safer, we can have it attempt to immediately check for score and then hold to secure points by using a boolean flag for HOT DICE!

I believe we may need a 2nd variable that tracks round score but resets to 0 after HOT DICE! to allow the AI to make decisions based on that score rather
than the inflated round score. Something like this.tempRoundScore or this.subRoundScore that resets to 0 every time (this.diceHeld.length >= 6).

if bust
auto run bust() function to pass turn


AI setTimeout for delayed function calling: 

 //1 second

setTimeout(function() {
  //your code to be executed after 1 second
}, delayInMilliseconds);