describe('Login Test', function () {
  it('Visit DebtCalculator', function() {
    cy.visit('http://localhost:4200/')
    cy.contains('Register').click()
    cy.url().should('include', '/register')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('TestPassword')
    cy.contains('Register!').click()
  })
})
