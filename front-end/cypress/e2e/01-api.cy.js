const API_URL = 'http://localhost:3001/api';

const getProductsFromResponse = (body) => {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.products)) return body.products;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.data?.products)) return body.data.products;
  return [];
};

describe('Backend API', () => {
  it('TC01: Backend health check hoạt động', () => {
    cy.request(`${API_URL}/health`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'ok');
    });
  });

  it('TC02: Backend trả về danh sách sản phẩm', () => {
    cy.request(`${API_URL}/products`).then((response) => {
      expect(response.status).to.eq(200);

      const products = getProductsFromResponse(response.body);
      expect(products).to.be.an('array');
      expect(products.length).to.be.greaterThan(0);
      expect(products[0]).to.include.keys(['id', 'name', 'price', 'primaryImage']);
    });
  });
});
