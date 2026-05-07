const API_URL = 'http://localhost:3001/api';

const getProductsFromResponse = (body) => {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.products)) return body.products;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.data?.products)) return body.data.products;
  return [];
};

describe('Stock limit', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  it('TC13: khong cho them san pham that vuot qua so luong ton kho', () => {
    cy.request(`${API_URL}/products?inStock=true&limit=100`).then(({ body }) => {
      const products = getProductsFromResponse(body);
      const product = products
        .filter((item) => item.inStock === true && Number(item.stockCount) > 0)
        .sort((a, b) => Number(a.stockCount) - Number(b.stockCount))[0];

      expect(product, 'real in-stock product from API').to.exist;

      const stockCount = Number(product.stockCount);
      expect(stockCount, 'real product should have low stock for a visual test').to.be.within(1, 5);

      cy.visitCatalog();
      cy.searchProductByName(product.name);

      cy.contains('[data-cy="product-card"]', product.name)
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="product-stock"]').should('contain.text', `Stock: ${stockCount}`);

          Cypress._.times(stockCount + 1, () => {
            cy.get('[data-cy="add-to-cart-button"]').click();
          });
        });

      cy.get('[data-cy="cart-count"]').should('contain.text', `${stockCount}`);
    });
  });
});
