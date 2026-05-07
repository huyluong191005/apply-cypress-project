import React from 'react';
import SearchBar from '../../src/components/products/SearchBar.jsx';

describe('SearchBar component', () => {
  it('CT03: SearchBar', () => {
    const onSearch = cy.stub().as('onSearch');

    cy.mount(<SearchBar onSearch={onSearch} />);

    cy.get('[data-cy="search-input"]')
      .type('headphones')
      .should('have.value', 'headphones')
      .type('{enter}');

    cy.get('@onSearch').should('have.been.calledOnceWith', 'headphones');
  });
});
