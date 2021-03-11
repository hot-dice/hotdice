/// <reference types="cypress" />

const mockRoles = {
  hotDiceRoles: [
    [[1,1,1,1,1,1],4000],
    [[1,1,1,1,1,1],4000],
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
    [[1,1,1], 1000],
    [[6,6,6], 600],
    [[5,5,5], 500],
    [[4,4,4], 400],
    [[3,3,3], 300],
    [[2,2,2], 200],
    [[1,1], 200],
    [[5,5], 100],
    [[1], 100],
    [[5], 50],
  ],
  remainingDiceRoles: [
    [[3,2,3,4,2,3], [2,2,4]],
    [[1,1,5,4], [4]],
    [[4,4,2,3,5,6], [2,3,4,4,6]],
    [[4,3,1,1,5], [3,4]],
    [[4,4,4,5,3], [3]],
    [[4,4], []],
    [[5,4], [4]],
    [[3,1,5,4], [3,4]]
  ],
  scoringDiceRoles: [
    [[1,1,2], [1,1]],
    [[3,3,3,4], [3,3,3]],
    [[5,4,2,1,3,5], [5,5,1]],
    [[2,6,3,3,3], [3,3,3]],
    [[4,4,1,5,6,6], [1,5]]
  ]
};

context('Smoke Tests', () => {
  describe('UI Tests', () => {
    describe('Static Page Tests', () => {
      before(() => {
        cy.visit('');
      });
      it('should have correct app title', () => {
        cy.title().should('eq', 'Hot Dice');
      });
  
      it('should be able to roll on first round', () => {
        cy.get('#roll-dice').should('not.have.attr', 'disabled');
      });
  
      it('shouldn\'t be able to stay if no dice are rolled', () => {
        cy.get('#stay').should('have.attr', 'disabled');
      });

      it('should have correct attributes for settings gear', () => {
        cy.get('#gear').should('have.attr', 'src', 'assets/settings-gear.svg');
        cy.get('#gear').parent().should('have.attr', 'href', '/settings.html');
      });
    })


    describe('Roll and Stay Tests', () => {
      beforeEach(() => {
        localStorage.setItem('Player_List', '[{"name":"Player 1","id":"c23c0e6e-e564-4ccd-bdcb-2b723258c38a","totalScore":0,"roundScore":0,"diceHeld":[],"diceRolled":[1,3,4,5,5,6],"isTurn":true,"timesRolled":0,"timesHeld":0,"unsorted":[1,4,5,6,3,5],"totalTurns":0},{"name":"Player 2","id":"8296b1c0-9c46-4a24-9619-3e18ba868b7a","totalScore":0,"roundScore":0,"diceHeld":[],"diceRolled":[],"isTurn":false,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":0}]')
        localStorage.setItem('Game', '{"gameActive":true,"turnCount":0,"activePlayer":{"name":"Player 1","id":"c23c0e6e-e564-4ccd-bdcb-2b723258c38a","totalScore":0,"roundScore":0,"diceHeld":[],"diceRolled":[1,3,4,5,5,6],"isTurn":true,"timesRolled":0,"timesHeld":0,"unsorted":[1,4,5,6,3,5],"totalTurns":0}}');
        cy.visit('/');
      });

      it('should be able to roll again if a valid die is selected', () => {
        cy.get('[value="1"] > .die').click();
        cy.wait(100);
        cy.get('#roll-dice').should('not.be.disabled')
      });
  
      it('shouldn\'t be able to roll if no dice are held', () => {
        cy.wait(100);
        cy.get('#roll-dice').should('be.disabled')
      });
    });

    describe('Win Condition Tests', () => {
      it('should allow player1 to win');

      it.skip('should allow player2 to win', () => {
        localStorage.setItem('Player_List', '[{"name":"Player 1","id":"8e9931c0-6661-4a6c-b2fb-c8772417919e","totalScore":8850,"roundScore":0,"diceHeld":[],"diceRolled":[],"isTurn":false,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":20},{"name":"Player 2","id":"ffaf4d6a-be5b-43a8-a0ce-e202f157c62f","totalScore":9800,"roundScore":500,"diceHeld":[5,5,5],"diceRolled":[1,1,1],"isTurn":true,"timesRolled":2,"timesHeld":1,"unsorted":[1,1,1],"totalTurns":20}]');
        localStorage.setItem('Game', '{"gameActive":true,"turnCount":40,"activePlayer":{"name":"Player 2","id":"ffaf4d6a-be5b-43a8-a0ce-e202f157c62f","totalScore":9800,"roundScore":500,"diceHeld":[5,5,5],"diceRolled":[1,1,1],"isTurn":true,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":20}}')
        cy.visit('/')
        cy.get('#stay').click();
        cy.get('.modal-content').should('include.text', 'Congratulations you tied!');
        cy.get('#player1-score p').should('include.text', '10000');
        cy.get('#player2-score p').should('include.text', '10000');
      });

      it('should allow for a tie', () => {
        localStorage.setItem('Player_List', '[{"name":"Player 1","id":"2f262eed-cd61-4c8a-8252-edb95cb7c919","totalScore":10000,"roundScore":0,"diceHeld":[],"diceRolled":[],"isTurn":false,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":10},{"name":"Player 2","id":"539fb1c1-5573-46aa-a4be-3a07f596cafa","totalScore":10000,"roundScore":0,"diceHeld":[],"diceRolled":[],"isTurn":true,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":10}]')
        localStorage.setItem('Game', '{"gameActive":true,"turnCount":2,"activePlayer":{"name":"Player 1","id":"2f262eed-cd61-4c8a-8252-edb95cb7c919","totalScore":10000,"roundScore":0,"diceHeld":[],"diceRolled":[],"isTurn":true,"timesRolled":-1,"timesHeld":0,"unsorted":[],"totalTurns":10}}');
        cy.visit('/');
        cy.get('.modal-content').should('include.text', 'Congratulations you tied!');
        cy.get('#player1-score p').should('include.text', '10000');
        cy.get('#player2-score p').should('include.text', '10000');
      });
    });

    describe('Settings Page Tests', () => {
      beforeEach(() => {
        cy.visit('/settings');
      })

      it('should have correct title', () => {
        cy.title().should('eq', 'Hot Dice Settings');
      });

      it('should have correct header text', () => {
        cy.get('h1').should('include.text', 'Settings');
      });

      it('should have correct button text', () => {
        cy.get('button:nth-of-type(1n)').should('include.text', 'Restart Game');
        cy.get('button:nth-of-type(2n)').should('include.text', 'Rules');
        cy.get('button:nth-of-type(3n)').should('include.text', 'About Us');
        cy.get('button:nth-of-type(4n)').should('include.text', 'Return To Game');
      });
    });
  });

  describe('JavaScript Function Tests', () => {
    before(() => {
      cy.visit('');
    })
    it('should calculate roles resulting in hot dice roles correctly', () => {
      cy.log('Testing getScore() score');
      cy.window().then((win) => {
        mockRoles.hotDiceRoles.forEach(role => {
          let result = win.getScore(role[0]);
          assert.equal(result.score, role[1]);
          assert.equal(result.diceToRollAgain.length, 0);;
          assert.deepEqual(result.diceToScore, role[0]);
        });
      });
    });
    it('should return the remaining dice correctly', () => {
      cy.log('Testing getScore() diceToRollAgain');
      cy.window().then((win) => {
        mockRoles.remainingDiceRoles.forEach(role => {
          let result = win.getScore(role[0]);
          assert.deepEqual(result.diceToRollAgain, role[1]);
        });
      });
    });

    it('should return scoring dice correctly', () => {
      cy.log('Testing getScore() diceToScore');
      cy.window().then((win) => {
        mockRoles.scoringDiceRoles.forEach(role => {
          let result = win.getScore(role[0]);
          assert.deepEqual(result.diceToScore, role[1]);
        });
      });
    });

    it('should be able to roll 100,000 times in under 4 seconds', () => {
      cy.log('Testing getRandom() Performance');
      cy.window().then((win) => {
        let time1 = performance.now();
        for(let i = 0; i < 100000; i++) {
          win.getRandom(6);
        }
        let time2 = performance.now();
        let runTime = (time2 - time1) / 1000;
        expect(runTime).to.be.lessThan(4);
      });
    })

    it('should be able to calculate score for 100,000 roles under 1.5 seconds', () => {
      cy.log('Testing getScore() Performance');
      cy.window().then((win) => {
        const tempScores = [];
        for(let i = 0; i < 100000; i++) {
          tempScores.push(win.getRandom(6));
        }
        let time1 = performance.now();
        tempScores.forEach(roll => {
          win.getScore(roll);
        })
        let time2 = performance.now();
        let runTime = (time2 - time1) / 1000;
        expect(runTime).to.be.lessThan(1.5);
      });
    });
  })
});
