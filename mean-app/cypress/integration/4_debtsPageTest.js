describe('Login',function (){
  it('Visit DebtCalculator', function(){
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('issaTest')
    cy.contains('Sign In!').click()
  })
})

describe('Debts Page Test',function(){
  it('Visit DebtCalculator',function(){
    cy.contains('Get Started').click()
    cy.url().should('include','/profile')
    cy.get('.form-control').first().type('1000')

    cy.get('input').eq(1).type('500')
    cy.get('input').eq(2).type('200')
    cy.get('input').eq(3).type('4000')
    cy.get('.mat-select').first().click({ force: true })
    cy.get('.mat-option').contains('California').click({ force: true })
    cy.get('.mat-select').last().click()
    cy.get('.mat-option').contains('Urban California').click({ force: true })
    cy.contains('Submit Profile').click({ force: true })

      //Debt Page
      cy.visit('http://localhost:4200/debt')
      //cy.url().should('include','/debt')
      cy.get('.form-control').first().type('College')
      cy.get('input').eq(1).type('5000')
      cy.get('input').eq(2).type('20')
      cy.get('input').eq(3).type('4')
      cy.get('input').eq(4).type('400')
      cy.get('.mat-select').first().click({ force: true })
      cy.get('.mat-option').contains('All Opportunities').click({ force: true })
      cy.contains('Add Debt').last().click({ force: true })
    })
  })
