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
  before(() => {
    cy.visit('');
  });

  describe('UI Tests', () => {
    it('should have correct app title', () => {
      cy.title().should('eq', 'Hot Dice');
    });
  })

  describe('JavaScript Function Tests', () => {
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

    it('should be able to calculate score for 100,000 roles under 1 seconds', () => {
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
        expect(runTime).to.be.lessThan(1);
      });
    });
  })
});
