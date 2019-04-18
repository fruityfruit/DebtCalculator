describe('Delete Account Test',function (){
  it('Visit DebtCalculator', function(){
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('issaTest')
    cy.contains('Sign In!').click()
    cy.contains('Account').click({ force: true })
    cy.url().should('include','/account')
    cy.get('input').eq(5).type('issaTest')
    cy.get('button').eq(2).click({ force: true })
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('issaTest')
    cy.contains('Sign In!').click()
  })
})
