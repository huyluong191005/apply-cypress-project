import React from 'react';
import ProductCard from '../../src/components/products/ProductCard.jsx';
import CartContext from '../../src/context/CartContext.jsx';

const product = {
  id: 101,
  name: 'Sony Wireless Noise-Canceling Headphones',
  description: 'Premium wireless headphones',
  price: 129.99,
  originalPrice: 159.99,
  primaryImage: 'https://placehold.co/400x400?text=Headphones',
  brand: 'Sony',
  rating: 4.7,
  reviewCount: 125,
  inStock: true,
  stockCount: 8,
};

const mountProductCard = (cartValue) => {
  cy.mount(
    <CartContext.Provider value={cartValue}>
      <ProductCard product={product} />
    </CartContext.Provider>
  );
};

describe('ProductCard component', () => {
  it('CT01: ProductCard render', () => {
    mountProductCard({ addToCart: cy.stub() });

    cy.get('[data-cy="product-card"]').should('be.visible');
    cy.get('[data-cy="product-name"]').should('contain.text', product.name);
    cy.get('[data-cy="product-price"]').should('contain.text', '$129.99');
    cy.get('[data-cy="product-image"]')
      .should('be.visible')
      .and('have.attr', 'src', product.primaryImage)
      .and('have.attr', 'alt', product.name);
  });

  it('CT02: ProductCard add to cart', () => {
    const addToCart = cy.stub().as('addToCart');
    mountProductCard({ addToCart });

    cy.get('[data-cy="add-to-cart-button"]').click();
    cy.get('@addToCart').should('have.been.calledOnceWith', product, 1);
    cy.contains('Product added to cart!').should('be.visible');
  });
});
