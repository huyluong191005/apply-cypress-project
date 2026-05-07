describe('Checkout', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('TC10: Checkout thiếu thông tin thì báo lỗi', () => {
    cy.startCheckoutWithProduct();

    cy.get('[data-cy="continue-to-payment"]').click();
    cy.get('[data-cy="validation-error"]').should('have.length.greaterThan', 0);
    cy.location('pathname').should('eq', '/checkout');
    cy.get('[data-cy="shipping-form"]').should('be.visible');
  });

  it('TC11: Checkout hợp lệ và đặt hàng thành công', () => {
    cy.startCheckoutWithProduct(5);
    cy.completeCheckout();

    cy.get('[data-cy="order-confirmation"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain.text', 'Order #');
  });

  it('TC12: Sau khi đặt hàng, cart được làm rỗng hoặc chuyển sang order confirmation', () => {
    cy.startCheckoutWithProduct(5);
    cy.completeCheckout();

    cy.location('pathname').should('include', '/confirmation/');
    cy.get('[data-cy="order-confirmation"]').should('be.visible');

    cy.visit('/');
    cy.get('[data-cy="cart-link"]').click();
    cy.get('[data-cy="empty-cart-message"]').should('be.visible');
  });
});
