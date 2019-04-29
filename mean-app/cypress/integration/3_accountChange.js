describe('Account Change Test', function () {
  it('Visit DebtCalculator', function() {
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('issaTest')
    cy.contains('Sign In!').click()
    cy.contains('Account').click({ force: true })
    cy.url().should('include', '/account')
    cy.get('.form-control').first().type('TestUser1')
    cy.get('input').eq(1).type('issaTest')
    cy.contains('Update').click({ force: true })

  })
})
