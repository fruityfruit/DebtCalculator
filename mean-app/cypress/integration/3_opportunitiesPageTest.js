describe('Login',function (){
  it('Visit DebtCalculator', function(){
    cy.visit('http://localhost:4200/signin')
    cy.get('.form-control').first().type('TestUser')
    cy.get('.form-control').last().type('issaTest')
    cy.contains('Sign In!').click()
  })
})

describe('Opportunities Test',function(){
  it('Visit DebtCalculator',function(){
    cy.contains('Get Started').click()
    cy.url().should('include','/profile')
    cy.get('.form-control').first().type('1000')

    cy.get('input').eq(1).type('500')  //  cy.get('.form-control').first().type('2000')
    cy.get('input').eq(2).type('200')
    cy.get('input').eq(3).type('4000')
    cy.get('.mat-select').first().click({ force: true })
    cy.get('.mat-option').contains('California').click({ force: true })
    cy.get('.mat-select').last().click()
    cy.get('.mat-option').contains('Urban California').click({ force: true })
    cy.contains('Submit Profile').click({ force: true })

    //Opportunities Test
    cy.visit('http://localhost:4200/opportunity')
    cy.get('.form-control').first().type('Medical School')
    cy.get('.form-control').eq(1).type('San Diego')

    cy.get('.mat-select').first().click({ force: true })
    cy.get('.mat-option').contains('California').click({ force: true })

    //cy.get('.mat-select').eq(2).click({ force: true })
    //cy.get('.mat-option').contains('Urban California').click({ force: true })

    cy.get('input').eq(2).type('4000')  //  cy.get('.form-control').first().type('2000')
    cy.get('input').eq(3).type('2000')
    //cy.get('.mat-select').first().click({ force: true })
    //cy.get('.mat-option').contains('Graduate School').click({ force: true })
    cy.get('.mat-select').last().click({ force: true })
    cy.get('.mat-option').contains('Yes').click({ force: true })
    cy.contains('Add opportunity').click({ force: true })
  })
})
