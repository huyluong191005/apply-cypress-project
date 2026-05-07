const API_URL = 'http://localhost:3001/api';

describe('Stock limit', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('TC13: khong cho them cung san pham vuot qua so luong ton kho', () => {
    const limitedStockProduct = {
      id: 999,
      name: 'Limited Stock Test Product',
      description: 'Only one unit is available',
      price: 50,
      originalPrice: null,
      currency: 'USD',
      primaryImage: 'https://placehold.co/400x400?text=Limited+Stock',
      images: ['https://placehold.co/400x400?text=Limited+Stock'],
      category: 'Test Category',
      brand: 'Test Brand',
      rating: 4.5,
      reviewCount: 10,
      inStock: true,
      stockCount: 1,
      attributes: {},
      featured: true,
    };

    cy.intercept('GET', `${API_URL}/filters/categories`, {
      success: true,
      data: ['Test Category'],
    });

    cy.intercept('GET', `${API_URL}/filters/brands`, {
      success: true,
      data: ['Test Brand'],
    });

    cy.intercept('GET', `${API_URL}/products*`, {
      success: true,
      data: {
        products: [limitedStockProduct],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          pages: 1,
        },
      },
    }).as('getProducts');

    cy.visit('/');
    cy.wait('@getProducts');

    cy.contains('[data-cy="product-card"]', limitedStockProduct.name)
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="add-to-cart-button"]').click();
      });

    cy.get('[data-cy="cart-count"]').should('contain.text', '1');

    cy.contains('[data-cy="product-card"]', limitedStockProduct.name)
      .within(() => {
        cy.get('[data-cy="add-to-cart-button"]').click();
      });

    cy.get('[data-cy="cart-count"]').should('contain.text', '1');
  });
});
