import React from 'react';
import CartItem from '../../src/components/cart/CartItem.jsx';
import CartContext from '../../src/context/CartContext.jsx';

const item = {
  productId: 201,
  product: {
    id: 201,
    name: 'Apple Pro UltraBook Laptop',
    price: 899.99,
    primaryImage: 'https://placehold.co/400x400?text=Laptop',
    inStock: true,
    stockCount: 10,
  },
  quantity: 2,
  price: 899.99,
};

const mountCartItem = ({ updateQuantity = cy.stub(), removeFromCart = cy.stub() } = {}) => {
  cy.mount(
    <CartContext.Provider value={{ updateQuantity, removeFromCart }}>
      <CartItem item={item} />
    </CartContext.Provider>
  );
};

describe('CartItem component', () => {
  it('CT04: CartItem render', () => {
    mountCartItem();

    cy.get('[data-cy="cart-item"]').should('be.visible');
    cy.get('[data-cy="cart-item-name"]').should('contain.text', item.product.name);
    cy.get('[data-cy="cart-item-price"]').should('contain.text', '$899.99');
    cy.get('[data-cy="quantity-input"]').should('contain.text', '2');
  });

  it('CT05: CartItem quantity', () => {
    const updateQuantity = cy.stub().as('updateQuantity');
    mountCartItem({ updateQuantity });

    cy.get('[data-cy="quantity-increase"]').click();
    cy.get('@updateQuantity').should('have.been.calledWith', item.productId, 3);

    cy.get('[data-cy="quantity-decrease"]').click();
    cy.get('@updateQuantity').should('have.been.calledWith', item.productId, 1);
  });

  it('CT06: CartItem remove', () => {
    const removeFromCart = cy.stub().as('removeFromCart');
    mountCartItem({ removeFromCart });

    cy.get('[data-cy="remove-cart-item"]').click();
    cy.get('@removeFromCart').should('have.been.calledOnceWith', item.productId);
  });
});
