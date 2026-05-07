import React from 'react';
import ShippingForm from '../../src/components/checkout/ShippingForm.jsx';

describe('ShippingForm checkout component', () => {
  it('CT07: CheckoutForm validation', () => {
    cy.mount(<ShippingForm onSubmit={cy.stub()} />);

    cy.get('[data-cy="continue-to-payment"]').click();
    cy.get('[data-cy="validation-error"]').should('have.length.greaterThan', 0);
  });

  it('CT08: CheckoutForm valid submit', () => {
    const onSubmit = cy.stub().as('onSubmit');
    cy.mount(<ShippingForm onSubmit={onSubmit} />);

    cy.get('[data-cy="shipping-name"]').type('Nguyen Van A');
    cy.get('[data-cy="shipping-email"]').type('test@example.com');
    cy.get('[data-cy="shipping-phone"]').type('0987654321');
    cy.get('[data-cy="shipping-address"]').type('Ha Noi');
    cy.get('[data-cy="shipping-city"]').type('Ha Noi');
    cy.get('[data-cy="shipping-state"]').select('CA');
    cy.get('[data-cy="shipping-zip"]').type('90001');
    cy.get('[data-cy="continue-to-payment"]').click();

    cy.get('[data-cy="validation-error"]').should('not.exist');
    cy.get('@onSubmit').should('have.been.calledOnce');
    cy.get('@onSubmit').its('firstCall.args.0').should('include', {
      name: 'Nguyen Van A',
      email: 'test@example.com',
      phone: '0987654321',
      address: 'Ha Noi',
    });
  });
});
