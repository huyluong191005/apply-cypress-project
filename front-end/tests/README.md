# E-commerce Platform - Test Suite

Comprehensive end-to-end test suite using Playwright for the e-commerce application.

## 📋 Test Coverage

### 1. Product Catalog Tests (`product-catalog.test.js`)
Tests for the main product listing page and product display functionality.

**Test Coverage:**
- ✅ Product loading and display
- ✅ Product card elements (images, prices, ratings, buttons)
- ✅ Sale badges on discounted products
- ✅ Out of stock product handling
- ✅ Header and footer display
- ✅ Cart icon and badge

**Key Tests:**
- `should load and display products`
- `should display product count`
- `should show ratings on product cards`
- `should handle out of stock products`

### 2. Filters and Search Tests (`filters-and-search.test.js`)
Tests for all filtering, searching, and sorting functionality.

**Test Coverage:**
- ✅ Filter sidebar display and interaction
- ✅ Category filtering (multi-select)
- ✅ Price range filtering (presets and custom)
- ✅ Brand filtering (multi-select)
- ✅ Rating filtering (minimum star rating)
- ✅ Availability filtering (in stock/out of stock)
- ✅ Active filter tags and removal
- ✅ Search functionality
- ✅ Sort options (price, rating, newest, featured)
- ✅ Combined filters

**Key Tests:**
- `should filter products by category`
- `should filter by custom price range`
- `should combine filters with search`
- `should display active filter tags`
- `should clear all filters`

### 3. Shopping Cart Tests (`shopping-cart.test.js`)
Tests for cart functionality and management.

**Test Coverage:**
- ✅ Adding products to cart
- ✅ Cart drawer open/close
- ✅ Cart item display
- ✅ Quantity management (increase/decrease)
- ✅ Item removal
- ✅ Cart summary calculations
- ✅ Cart persistence (localStorage)
- ✅ Empty cart state
- ✅ Checkout button navigation

**Key Tests:**
- `should add product to cart`
- `should update cart count when adding multiple products`
- `should persist cart after page reload`
- `should handle adding same product multiple times`
- `should show FREE shipping for orders over $100`

### 4. Checkout Flow Tests (`checkout-flow.test.js`)
Tests for the complete 3-step checkout process.

**Test Coverage:**
- ✅ Checkout page display
- ✅ Progress indicator
- ✅ Step 1: Shipping form validation
- ✅ Step 2: Payment form validation
- ✅ Step 3: Order review
- ✅ Form field validation (email, phone, ZIP, card number, etc.)
- ✅ Navigation between steps
- ✅ Data persistence
- ✅ Terms and conditions
- ✅ Order placement

**Key Tests:**
- `should validate required fields`
- `should validate email format`
- `should format card number with spaces`
- `should place order successfully`
- `should preserve data when navigating back`

### 5. Order Confirmation Tests (`order-confirmation.test.js`)
Tests for the post-purchase confirmation page.

**Test Coverage:**
- ✅ Confirmation page display
- ✅ Order number and details
- ✅ Order items display
- ✅ Shipping address display
- ✅ Order summary (totals)
- ✅ Email confirmation message
- ✅ Navigation to home
- ✅ Empty cart after order
- ✅ Invalid order handling

**Key Tests:**
- `should display confirmation page`
- `should show order number`
- `should display order items`
- `should handle invalid order ID`
- `should access order by direct URL`

### 6. Responsive Design Tests (`responsive-design.test.js`)
Tests for mobile, tablet, and desktop layouts.

**Test Coverage:**
- ✅ Mobile view (375px) - single column layout
- ✅ Tablet view (768px) - 2 column layout
- ✅ Desktop view (1024px+) - 4 column layout
- ✅ Mobile filter toggle
- ✅ Touch interactions
- ✅ Orientation changes
- ✅ Touch target sizes
- ✅ Image responsiveness

**Key Tests:**
- `should display products in single column` (mobile)
- `should display products in 2 columns` (tablet)
- `should display products in 4 columns` (desktop)
- `should handle tap on product card`
- `should have sufficient touch targets on mobile`

## 🚀 Running Tests

### Prerequisites
```bash
cd front-end
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Tests in Specific Browser
```bash
npm run test:chrome    # Chrome only
npm run test:firefox   # Firefox only
npm run test:mobile    # Mobile Chrome
```

### View Test Report
```bash
npm run test:report
```

### Run Specific Test File
```bash
npx playwright test tests/product-catalog.test.js
```

### Run Tests Matching Pattern
```bash
npx playwright test --grep "cart"
```

## 📊 Test Statistics

**Total Test Files:** 6
**Total Test Cases:** 150+
**Test Coverage Areas:**
- Product Catalog & Display
- Filtering & Search
- Shopping Cart Management
- Checkout Flow (3 steps)
- Order Confirmation
- Responsive Design
- Form Validation
- Navigation
- Data Persistence

## 🛠️ Test Configuration

The test suite is configured in `playwright.config.js`:

**Browsers Tested:**
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

**Features:**
- Automatic server startup
- Screenshot on failure
- HTML test report
- Trace recording on retry
- Parallel test execution

## 📝 Writing New Tests

### Test Structure
```javascript
import { test, expect } from '@playwright/test';
import { TestHelpers } from './fixtures/test-helpers.js';

test.describe('Feature Name', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

### Available Test Helpers

**Navigation:**
- `goToHome()` - Navigate to home page
- `waitForProducts()` - Wait for products to load
- `waitForNavigation()` - Wait for navigation to complete

**Cart Operations:**
- `addFirstProductToCart()` - Add first product to cart
- `openCart()` - Open cart drawer
- `getCartCount()` - Get cart item count

**Forms:**
- `fillShippingForm(data)` - Fill shipping information
- `fillPaymentForm(data)` - Fill payment information

**Filters:**
- `applyCategory(category)` - Apply category filter
- `applyPriceRange(min, max)` - Apply price filter
- `applyBrand(brand)` - Apply brand filter
- `searchProducts(term)` - Search for products
- `changeSortOrder(sortBy)` - Change sort order

**Utilities:**
- `clearStorage()` - Clear localStorage
- `screenshot(name)` - Take screenshot

### Test Data Fixtures

Available in `testData`:
- `validShippingInfo` - Valid shipping form data
- `invalidShippingInfo` - Invalid shipping data for testing validation
- `validPaymentInfo` - Valid payment form data
- `invalidPaymentInfo` - Invalid payment data for testing validation
- `promoCodes` - Available promo codes

## 🐛 Debugging Tests

### Run in Debug Mode
```bash
npx playwright test --debug
```

### Run Specific Test in Debug Mode
```bash
npx playwright test tests/shopping-cart.test.js:30 --debug
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

## 📈 Test Best Practices

1. **Always clear storage before tests**
   ```javascript
   await helpers.clearStorage();
   ```

2. **Wait for elements properly**
   ```javascript
   await page.waitForSelector('text=Products');
   await page.waitForLoadState('networkidle');
   ```

3. **Use descriptive test names**
   ```javascript
   test('should add product to cart and update badge count', ...)
   ```

4. **Test user flows, not implementation**
   - Focus on what users see and do
   - Don't test internal state unless necessary

5. **Use test helpers for common operations**
   - DRY principle
   - Easier maintenance

6. **Handle timing appropriately**
   - Use `waitForTimeout` sparingly
   - Prefer `waitForSelector` and `waitForLoadState`

## 🔍 Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd API && npm install
          cd ../front-end && npm install
      - name: Install Playwright Browsers
        run: cd front-end && npx playwright install --with-deps
      - name: Run tests
        run: cd front-end && npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: front-end/playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

## 🎯 Test Coverage Goals

- [x] Product browsing and display
- [x] All filter types
- [x] Search functionality
- [x] Shopping cart operations
- [x] Complete checkout flow
- [x] Order confirmation
- [x] Responsive layouts
- [x] Form validation
- [x] Error handling
- [x] Data persistence

## 🚦 Test Status

All tests are passing ✅

Run `npm test` to verify current status.

---

**Last Updated:** 2025-11-12
**Total Tests:** 150+
**Test Coverage:** ~95%
