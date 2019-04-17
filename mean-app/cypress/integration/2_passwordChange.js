describe('Password Change Test',function (){
  it('Visit DebtCalculator', function(){
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('TestPassword')
    cy.contains('Sign In!').click()
    cy.contains('Account').click()
    cy.url().should('include','/account')
    cy.get('input').eq(2).type('TestPassword')
    cy.get('input').eq(3).type('issaTest')
    cy.get('input').eq(4).type('issaTest')
    cy.get('button').eq(1).click({ force: true })
  //  cy.get('input[formControlName="oldPassword"]'),type('aaaaaaaaaaaaaa')

  //

  })
})
