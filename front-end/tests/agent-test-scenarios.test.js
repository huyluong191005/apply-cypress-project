import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './fixtures/test-helpers.js';

/**
 * This test file contains intentionally broken tests for agent testing
 * DO NOT run in normal test suite - only for agent evaluation
 */

test.describe('Agent Test Scenarios', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();
  });

  // ============================================================
  // SCENARIO 1.1: Ambiguous Selector (Multiple Elements Match)
  // ============================================================
  test('SCENARIO 1.1: should add product to cart - BROKEN: ambiguous button selector', async ({ page }) => {
    // Fixed: Use role-based selector with .first() to select the first product's button
    const addButton = page.getByRole('button', { name: 'Add to Cart' }).first();
    await addButton.click();

    const cartCount = await helpers.getCartCount();
    expect(cartCount).toBe(1);
  });

  // ============================================================
  // SCENARIO 1.2: Missing Element (Element Removed)
  // ============================================================
  test('SCENARIO 1.2: should display promotional banner - BROKEN: element removed', async ({ page }) => {
    // INTENTIONAL BUG: This element doesn't exist in the UI
    await expect(page.locator('text=Special Promotion: 50% Off!')).toBeVisible();
  });

  // ============================================================
  // SCENARIO 1.3: Dynamic Class Name (Icon Library)
  // ============================================================
  test('SCENARIO 1.3: should open cart - BROKEN: dynamic icon class', async ({ page }) => {
    // Fixed: Use semantic selector scoped to header with SVG (icon libraries render as SVG)
    // Avoids brittle class names from Lucide React which are dynamically generated
    const cartButton = page.locator('header button:has(svg)');
    await cartButton.click();

    await expect(page.locator('text=Shopping Cart')).toBeVisible();
  });

  // ============================================================
  // SCENARIO 1.4: Incorrect Scoping
  // ============================================================
  test.skip('SCENARIO 1.4: should have logo in header - BROKEN: matches footer too', async ({ page }) => {
    // INTENTIONAL BUG: "E-Shop" appears in both header and footer
    const logo = page.locator('text=E-Shop');
    await expect(logo).toBeVisible(); // May fail with strict mode if in both places
  });

  // ============================================================
  // SCENARIO 1.5: Timing-Dependent Selector
  // ============================================================
  test.skip('SCENARIO 1.5: should load products - BROKEN: missing wait', async ({ page }) => {
    await page.goto('/');
    // INTENTIONAL BUG: No wait for products to load
    const products = page.locator('[class*="card"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  // ============================================================
  // SCENARIO 2.1: Wrong Expected Value
  // ============================================================
  test.skip('SCENARIO 2.1: should show correct product count - BROKEN: wrong assertion', async ({ page }) => {
    const products = page.locator('[class*="card"]');
    const count = await products.count();
    // INTENTIONAL BUG: Wrong expected count
    expect(count).toBe(999); // Should be ~10-20
  });

  // ============================================================
  // SCENARIO 2.2: Flaky Timing Assertion
  // ============================================================
  test.skip('SCENARIO 2.2: should add to cart and show toast - BROKEN: timing issue', async ({ page }) => {
    await helpers.addFirstProductToCart();
    // INTENTIONAL BUG: Checking toast immediately without proper wait
    const toast = page.locator('text=Product added to cart');
    const isVisible = await toast.isVisible(); // May already be gone
    expect(isVisible).toBe(true);
  });

  // ============================================================
  // SCENARIO 2.3: Type Mismatch
  // ============================================================
  test.skip('SCENARIO 2.3: should display product price - BROKEN: type mismatch', async ({ page }) => {
    const firstProduct = page.locator('[class*="card"]').first();
    const priceText = await firstProduct.locator('[class*="price"]').first().textContent();
    // INTENTIONAL BUG: Comparing string to number
    expect(priceText).toBe(19.99); // Should be "$19.99" or similar string
  });

  // ============================================================
  // SCENARIO 3.1: Missing Wait for Navigation
  // ============================================================
  test('SCENARIO 3.1: should navigate to checkout - FIXED', async ({ page }) => {
    await helpers.addFirstProductToCart();
    await helpers.openCart();

    await page.click('button:has-text("Proceed to Checkout")');
    // Fixed: Wait for navigation to checkout page to complete
    await page.waitForURL(/\/checkout/);

    const heading = await page.locator('text=Checkout').textContent();
    expect(heading).toBe('Checkout');
  });

  // ============================================================
  // SCENARIO 3.2: Insufficient Timeout
  // ============================================================
  test.skip('SCENARIO 3.2: should load slow element - BROKEN: timeout too short', async ({ page }) => {
    // INTENTIONAL BUG: Timeout way too short for network-dependent element
    await page.waitForSelector('[class*="grid"]', { timeout: 100 });
    expect(true).toBe(true);
  });

  // ============================================================
  // SCENARIO 4.1: Test Interdependence
  // ============================================================
  test.skip('SCENARIO 4.1a: first test adds item', async ({ page }) => {
    // This test adds to cart
    await helpers.addFirstProductToCart();
    const count = await helpers.getCartCount();
    expect(count).toBe(1);
  });

  test.skip('SCENARIO 4.1b: second test depends on first - BROKEN: interdependent', async ({ page }) => {
    // INTENTIONAL BUG: Assumes cart already has item from previous test
    const count = await helpers.getCartCount();
    expect(count).toBe(1); // Will fail if run alone
  });

  // ============================================================
  // SCENARIO 4.2: Incomplete Cleanup
  // ============================================================
  test.skip('SCENARIO 4.2: should start with empty cart - BROKEN: no cleanup', async ({ page }) => {
    // First, pollute the state
    await helpers.addFirstProductToCart();

    // Now in a "new" test (simulated)
    // INTENTIONAL BUG: beforeEach doesn't clear storage in this scenario
    await page.reload();
    const count = await helpers.getCartCount();
    expect(count).toBe(0); // Will fail because cart persists
  });

  // ============================================================
  // SCENARIO 5.1: Incorrect URL
  // ============================================================
  test.skip('SCENARIO 5.1: should navigate to checkout - BROKEN: wrong URL', async ({ page }) => {
    await helpers.addFirstProductToCart();
    // INTENTIONAL BUG: Wrong route path
    await page.goto('/cart/checkout'); // Should be just '/checkout'
    await expect(page.locator('text=Checkout')).toBeVisible();
  });

  // ============================================================
  // SCENARIO 5.3: Route Guard
  // ============================================================
  test('SCENARIO 5.3: should access checkout - FIXED: respects guard', async ({ page }) => {
    // Test that accessing checkout without items in cart triggers route guard
    // The app should redirect to home page when cart is empty
    await page.goto('/checkout');

    // Wait for redirect to complete
    await page.waitForURL('/');

    // Verify we're on the home page, not checkout
    expect(page.url()).toMatch(/\/$|\/$/);
    await expect(page.locator('text=Products')).toBeVisible();
  });

  // ============================================================
  // SCENARIO 6.1: Missing Form Fill
  // ============================================================
  test('SCENARIO 6.1: should submit checkout form - FIXED', async ({ page }) => {
    await helpers.addFirstProductToCart();
    await helpers.openCart();
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForLoadState('networkidle');

    // Fixed: Fill all required shipping form fields before submitting
    await helpers.fillShippingForm(testData.validShippingInfo);
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForTimeout(1000);

    // Should navigate to payment step
    await expect(page.locator('text=Payment Information')).toBeVisible();
  });

  // ============================================================
  // SCENARIO 7.1: Conditional Rendering
  // ============================================================
  test.skip('SCENARIO 7.1: should show out of stock badge - BROKEN: not conditional', async ({ page }) => {
    // INTENTIONAL BUG: Assumes all products have "Out of Stock" badge
    const badge = page.locator('text=Out of Stock').first();
    await expect(badge).toBeVisible(); // Will fail if no products are out of stock
  });

  // ============================================================
  // SCENARIO 8.1: Viewport Issue
  // ============================================================
  test.skip('SCENARIO 8.1: should show mobile menu button - BROKEN: desktop viewport', async ({ page }) => {
    // INTENTIONAL BUG: Looking for mobile element in desktop viewport
    const mobileMenuButton = page.locator('button[aria-label="Open menu"]');
    await expect(mobileMenuButton).toBeVisible(); // Will fail in desktop viewport
  });
});
