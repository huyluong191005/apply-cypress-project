describe('Shopping cart', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('TC07: Thêm sản phẩm vào giỏ hàng', () => {
    cy.getTestProduct().then((product) => {
      cy.visitCatalog();
      cy.addProductToCartByName(product.name);
      cy.openCart();

      cy.get('[data-cy="cart-item"]').should('have.length', 1);
      cy.get('[data-cy="cart-item-name"]').should('contain.text', product.name);
    });
  });

  it('TC08: Cập nhật số lượng sản phẩm trong giỏ', () => {
    cy.getTestProduct(2).then((product) => {
      cy.visitCatalog();
      cy.addProductToCartByName(product.name);
      cy.openCart();

      cy.get('[data-cy="cart-total"]').invoke('text').then((initialTotal) => {
        cy.get('[data-cy="quantity-increase"]').click();
        cy.get('[data-cy="quantity-input"]').should('contain.text', '2');
        cy.get('[data-cy="cart-total"]').invoke('text').should('not.eq', initialTotal);
      });
    });
  });

  it('TC09: Xóa sản phẩm khỏi giỏ', () => {
    cy.getTestProduct().then((product) => {
      cy.visitCatalog();
      cy.addProductToCartByName(product.name);
      cy.openCart();

      cy.get('[data-cy="remove-cart-item"]').click();
      cy.get('[data-cy="empty-cart-message"]').should('be.visible');
      cy.get('[data-cy="empty-cart-message"]').should('contain.text', 'Your cart is empty');
    });
  });
});
