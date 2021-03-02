/// <reference types="cypress" />

context('Smoke Tests', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should have correct app title', () => {
    cy.title().should('eq', 'Hot Dice');
  });
});
