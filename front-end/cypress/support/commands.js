const API_URL = 'http://localhost:3001/api';

const getProductsFromResponse = (body) => {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.products)) return body.products;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.data?.products)) return body.data.products;
  return [];
};

Cypress.Commands.add('clearAppState', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.Commands.add('getTestProduct', (minStock = 1) => {
  cy.request(`${API_URL}/products?inStock=true&limit=100`).then(({ body }) => {
    const products = getProductsFromResponse(body);
    const product = products.find((item) => (
      item.inStock === true && Number(item.stockCount) >= minStock
    ));

    expect(product, `in-stock product with stockCount >= ${minStock}`).to.exist;
    return product;
  });
});

Cypress.Commands.add('visitCatalog', () => {
  cy.intercept('GET', `${API_URL}/products*`).as('getProducts');
  cy.visit('/');
  cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.get('[data-cy="product-list"]').should('be.visible');
});

Cypress.Commands.add('searchProductByName', (productName) => {
  cy.intercept('GET', `${API_URL}/products*`).as('searchProducts');
  cy.get('[data-cy="search-input"]').clear().type(`${productName}{enter}`);
  cy.wait('@searchProducts').its('response.statusCode').should('be.oneOf', [200, 304]);
});

Cypress.Commands.add('addProductToCartByName', (productName) => {
  cy.searchProductByName(productName);
  cy.contains('[data-cy="product-card"]', productName)
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="add-to-cart-button"]')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
    });

  cy.get('[data-cy="cart-count"]').should('contain.text', '1');
});

Cypress.Commands.add('openCart', () => {
  cy.get('[data-cy="cart-link"]').click();
  cy.get('[data-cy="cart-drawer"]').should('be.visible');
});

Cypress.Commands.add('startCheckoutWithProduct', (minStock = 1) => {
  cy.clearAppState();
  cy.getTestProduct(minStock).then((product) => {
    cy.visitCatalog();
    cy.addProductToCartByName(product.name);
    cy.openCart();
    cy.get('[data-cy="checkout-button"]').click();
    cy.location('pathname').should('eq', '/checkout');
    cy.get('[data-cy="checkout-page"]').should('be.visible');
  });
});

Cypress.Commands.add('fillShippingInfo', () => {
  cy.get('[data-cy="shipping-name"]').clear().type('Nguyen Van A');
  cy.get('[data-cy="shipping-email"]').clear().type('test@example.com');
  cy.get('[data-cy="shipping-phone"]').clear().type('0987654321');
  cy.get('[data-cy="shipping-address"]').clear().type('Ha Noi');
  cy.get('[data-cy="shipping-city"]').clear().type('Ha Noi');
  cy.get('[data-cy="shipping-state"]').select('CA');
  cy.get('[data-cy="shipping-zip"]').clear().type('90001');
});

Cypress.Commands.add('fillPaymentInfo', () => {
  cy.get('[data-cy="payment-card-number"]').clear().type('4532123456789010');
  cy.get('[data-cy="payment-cardholder-name"]').clear().type('Nguyen Van A');
  cy.get('[data-cy="payment-expiration"]').clear().type('1230');
  cy.get('[data-cy="payment-cvv"]').clear().type('123');
});

Cypress.Commands.add('completeCheckout', () => {
  cy.fillShippingInfo();
  cy.get('[data-cy="continue-to-payment"]').click();
  cy.get('[data-cy="payment-form"]').should('be.visible');

  cy.fillPaymentInfo();
  cy.get('[data-cy="continue-to-review"]').click();
  cy.get('[data-cy="order-review"]').should('be.visible');

  cy.intercept('POST', `${API_URL}/orders`).as('createOrder');
  cy.get('[data-cy="terms-checkbox"]').check();
  cy.get('[data-cy="place-order-button"]').should('not.be.disabled').click();
  cy.wait('@createOrder').its('response.statusCode').should('eq', 201);

  cy.location('pathname').should('include', '/confirmation/');
  cy.get('[data-cy="order-confirmation"]').should('be.visible');
});
