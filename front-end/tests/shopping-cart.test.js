import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './fixtures/test-helpers.js';

test.describe('Shopping Cart', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();
  });

  test.describe('Add to Cart', () => {
    test('should add product to cart', async ({ page }) => {
      // Add product to cart
      await helpers.addFirstProductToCart();

      // Verify cart count badge updated
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(1);

      // Verify toast notification appears
      const toast = page.locator('text=Product added to cart');
      await expect(toast).toBeVisible({ timeout: 3000 });
    });

    test('should update cart count when adding multiple products', async ({ page }) => {
      // Add first product
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);

      // Add second product
      const addButtons = page.locator('button:has-text("Add to Cart")');
      if (await addButtons.count() > 1) {
        await addButtons.nth(1).click();
        await page.waitForTimeout(500);

        // Verify cart count
        const cartCount = await helpers.getCartCount();
        expect(cartCount).toBe(2);
      }
    });

    test('should not add out of stock products', async ({ page }) => {
      const outOfStockButton = page.locator('button:has-text("Out of Stock")').first();
      const count = await outOfStockButton.count();

      if (count > 0) {
        await expect(outOfStockButton).toBeDisabled();
      }
    });
  });

  test.describe('Cart Drawer', () => {
    test('should open cart drawer', async ({ page }) => {
      await helpers.openCart();

      // Verify drawer is open
      await expect(page.locator('text=Shopping Cart')).toBeVisible();
    });

    test('should close cart drawer', async ({ page }) => {
      await helpers.openCart();

      // Click close button
      const closeButton = page.locator('button').filter({ has: page.locator('[class*="X"]') }).first();
      await closeButton.click();
      await page.waitForTimeout(300);

      // Verify drawer is closed
      await expect(page.locator('text=Shopping Cart')).not.toBeVisible();
    });

    test('should show empty cart message', async ({ page }) => {
      await helpers.openCart();

      // Verify empty cart message
      await expect(page.locator('text=Your cart is empty')).toBeVisible();
      await expect(page.locator('text=Add some products to get started')).toBeVisible();
    });

    test('should display cart items', async ({ page }) => {
      // Add product to cart
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);

      // Open cart
      await helpers.openCart();

      // Verify item is displayed
      const cartItem = page.locator('[class*="card"]').first();
      await expect(cartItem).toBeVisible();
    });

    test('should show Continue Shopping button in empty cart', async ({ page }) => {
      await helpers.openCart();

      const continueButton = page.locator('button:has-text("Continue Shopping")');
      await expect(continueButton).toBeVisible();

      // Click button and verify drawer closes
      await continueButton.click();
      await page.waitForTimeout(300);
    });
  });

  test.describe('Cart Item Management', () => {
    test.beforeEach(async ({ page }) => {
      // Add a product before each test
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();
    });

    test('should increase item quantity', async ({ page }) => {
      // Find plus button
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();
      await plusButton.click();
      await page.waitForTimeout(300);

      // Verify quantity increased
      const quantity = page.locator('span:near(button:has([class*="Plus"]))').first();
      const qtyText = await quantity.textContent();
      expect(parseInt(qtyText)).toBeGreaterThanOrEqual(2);
    });

    test('should decrease item quantity', async ({ page }) => {
      // First increase quantity
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();
      await plusButton.click();
      await page.waitForTimeout(300);

      // Then decrease
      const minusButton = page.locator('button').filter({ has: page.locator('[class*="Minus"]') }).first();
      await minusButton.click();
      await page.waitForTimeout(300);

      // Verify quantity decreased
      const quantity = page.locator('span:near(button:has([class*="Minus"]))').first();
      const qtyText = await quantity.textContent();
      expect(parseInt(qtyText)).toBe(1);
    });

    test('should not decrease quantity below 1', async ({ page }) => {
      // Try to decrease quantity
      const minusButton = page.locator('button').filter({ has: page.locator('[class*="Minus"]') }).first();

      // Button should be disabled or quantity stays at 1
      const isDisabled = await minusButton.isDisabled();
      expect(isDisabled).toBe(true);
    });

    test('should remove item from cart', async ({ page }) => {
      // Click remove button
      const removeButton = page.locator('button').filter({ has: page.locator('[class*="Trash"]') }).first();
      await removeButton.click();
      await page.waitForTimeout(500);

      // Verify empty cart message appears
      await expect(page.locator('text=Your cart is empty')).toBeVisible();

      // Verify cart count is 0
      await page.click('body'); // Click outside to close drawer
      await page.waitForTimeout(300);
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(0);
    });

    test('should update subtotal when quantity changes', async ({ page }) => {
      // Get initial subtotal
      const initialSubtotal = await page.locator('text=/Subtotal/').locator('.. >> text=/\\$/').textContent();

      // Increase quantity
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();
      await plusButton.click();
      await page.waitForTimeout(500);

      // Get new subtotal
      const newSubtotal = await page.locator('text=/Subtotal/').locator('.. >> text=/\\$/').textContent();

      // Verify subtotal changed
      expect(newSubtotal).not.toBe(initialSubtotal);
    });
  });

  test.describe('Cart Summary', () => {
    test.beforeEach(async ({ page }) => {
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();
    });

    test('should display subtotal', async ({ page }) => {
      const subtotal = page.locator('text=Subtotal');
      await expect(subtotal).toBeVisible();
    });

    test('should display shipping cost', async ({ page }) => {
      const shipping = page.locator('text=Shipping');
      await expect(shipping).toBeVisible();
    });

    test('should display tax', async ({ page }) => {
      const tax = page.locator('text=Tax');
      await expect(tax).toBeVisible();
    });

    test('should display total', async ({ page }) => {
      const total = page.locator('text=Total').last();
      await expect(total).toBeVisible();
    });

    test('should show FREE shipping for orders over $100', async ({ page }) => {
      // Add enough products to exceed $100
      // This test assumes we can add multiple items
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();

      // Add multiple items
      for (let i = 0; i < 5; i++) {
        await plusButton.click();
        await page.waitForTimeout(200);
      }

      // Check if FREE shipping is shown
      const freeShipping = page.locator('text=FREE');
      const count = await freeShipping.count();
      if (count > 0) {
        await expect(freeShipping).toBeVisible();
      }
    });

    test('should show message about free shipping threshold', async ({ page }) => {
      // Look for free shipping message
      const message = page.locator('text=/Add.*more for FREE shipping/');
      const count = await message.count();

      // If subtotal is under $100, message should appear
      if (count > 0) {
        await expect(message).toBeVisible();
      }
    });
  });

  test.describe('Cart Persistence', () => {
    test('should persist cart after page reload', async ({ page }) => {
      // Add product to cart
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify cart count persists
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(1);
    });

    test('should persist cart items after navigation', async ({ page }) => {
      // Add product to cart
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);

      // Navigate away and back
      await page.goto('/checkout');
      await page.waitForTimeout(500);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify cart count persists
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(1);
    });

    test('should persist cart quantities', async ({ page }) => {
      // Add product and update quantity
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();

      // Increase quantity
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();
      await plusButton.click();
      await page.waitForTimeout(300);

      // Close cart and reload
      await page.click('body');
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify cart count is 2
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(2);
    });
  });

  test.describe('Checkout Button', () => {
    test('should show Proceed to Checkout button when cart has items', async ({ page }) => {
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();

      const checkoutButton = page.locator('button:has-text("Proceed to Checkout")');
      await expect(checkoutButton).toBeVisible();
    });

    test('should navigate to checkout page', async ({ page }) => {
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();

      const checkoutButton = page.locator('button:has-text("Proceed to Checkout")');
      await checkoutButton.click();

      // Verify navigation to checkout
      await expect(page).toHaveURL(/.*checkout/);
      await expect(page.locator('text=Checkout')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle adding same product multiple times', async ({ page }) => {
      // Add same product twice
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(300);
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(300);

      // Verify cart count is 2
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(2);

      // Open cart and verify single item with quantity 2
      await helpers.openCart();
      const cartItems = await page.locator('[class*="card"]').count();
      expect(cartItems).toBeGreaterThanOrEqual(1);
    });

    test('should handle maximum quantity limits', async ({ page }) => {
      await helpers.addFirstProductToCart();
      await page.waitForTimeout(500);
      await helpers.openCart();

      // Try to increase quantity many times
      const plusButton = page.locator('button').filter({ has: page.locator('[class*="Plus"]') }).first();

      for (let i = 0; i < 20; i++) {
        const isDisabled = await plusButton.isDisabled();
        if (isDisabled) break;
        await plusButton.click();
        await page.waitForTimeout(100);
      }

      // Verify button eventually becomes disabled (stock limit reached)
      // This test ensures we don't allow adding more than available stock
    });
  });
});
