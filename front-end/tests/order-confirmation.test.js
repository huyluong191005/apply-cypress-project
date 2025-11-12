import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './fixtures/test-helpers.js';

test.describe('Order Confirmation', () => {
  let helpers;
  let orderId;

  // Helper to complete a full checkout
  async function completeCheckout(page) {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();

    // Add product to cart
    await helpers.addFirstProductToCart();
    await page.waitForTimeout(500);

    // Go to checkout
    await helpers.openCart();
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForLoadState('networkidle');

    // Complete shipping
    await helpers.fillShippingForm(testData.validShippingInfo);
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForTimeout(1000);

    // Complete payment
    await helpers.fillPaymentForm(testData.validPaymentInfo);
    await page.click('button:has-text("Continue to Review")');
    await page.waitForTimeout(1000);

    // Place order
    await page.check('input[id="terms"]');
    await page.click('button:has-text("Place Order")');
    await page.waitForURL(/.*confirmation.*/, { timeout: 10000 });

    // Extract order ID from URL
    const url = page.url();
    const match = url.match(/confirmation\/([^/]+)/);
    if (match) {
      orderId = match[1];
    }
  }

  test.beforeEach(async ({ page }) => {
    await completeCheckout(page);
  });

  test.describe('Confirmation Page Display', () => {
    test('should display confirmation page', async ({ page }) => {
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
    });

    test('should show success icon', async ({ page }) => {
      // Look for checkmark icon or success indicator
      const successIcon = page.locator('[class*="CheckCircle"]');
      await expect(successIcon).toBeVisible();
    });

    test('should display thank you message', async ({ page }) => {
      await expect(page.locator('text=/thank you/i')).toBeVisible();
    });

    test('should display order number', async ({ page }) => {
      await expect(page.locator(`text=/Order #${orderId}/i`)).toBeVisible();
    });

    test('should show order date', async ({ page }) => {
      await expect(page.locator('text=/Placed on/i')).toBeVisible();
    });

    test('should display estimated delivery date', async ({ page }) => {
      await expect(page.locator('text=/Estimated Delivery/i')).toBeVisible();
    });

    test('should show order status', async ({ page }) => {
      await expect(page.locator('text=confirmed')).toBeVisible();
    });
  });

  test.describe('Order Details', () => {
    test('should display order items', async ({ page }) => {
      await expect(page.locator('text=Order Items')).toBeVisible();
      const items = page.locator('text=Order Items').locator('..').locator('img');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show item details', async ({ page }) => {
      // Should show product name, quantity, and price
      const orderItems = page.locator('text=Order Items').locator('..');

      // Check for quantity
      await expect(orderItems.locator('text=/Quantity:/i')).toBeVisible();

      // Check for price
      await expect(orderItems.locator('text=/\\$/').first()).toBeVisible();
    });

    test('should display shipping address', async ({ page }) => {
      await expect(page.locator('text=Shipping Address')).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.name}`)).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.city}`)).toBeVisible();
    });

    test('should show complete shipping address', async ({ page }) => {
      const shippingSection = page.locator('text=Shipping Address').locator('..');

      // Check for address components
      await expect(shippingSection.locator(`text=${testData.validShippingInfo.address}`)).toBeVisible();
      await expect(shippingSection.locator(`text=/${testData.validShippingInfo.city}/i`)).toBeVisible();
      await expect(shippingSection.locator(`text=/${testData.validShippingInfo.state}/i`)).toBeVisible();
      await expect(shippingSection.locator(`text=${testData.validShippingInfo.zipCode}`)).toBeVisible();
    });
  });

  test.describe('Order Summary', () => {
    test('should display subtotal', async ({ page }) => {
      await expect(page.locator('text=Subtotal')).toBeVisible();
      await expect(page.locator('text=Subtotal').locator('..').locator('text=/\\$/')).toBeVisible();
    });

    test('should display shipping cost', async ({ page }) => {
      await expect(page.locator('text=Shipping')).toBeVisible();
    });

    test('should display tax', async ({ page }) => {
      await expect(page.locator('text=Tax')).toBeVisible();
    });

    test('should display total', async ({ page }) => {
      await expect(page.locator('text=Total').last()).toBeVisible();
      const total = page.locator('text=Total').last().locator('..').locator('text=/\\$/');
      await expect(total).toBeVisible();
    });

    test('should show discount if applied', async ({ page }) => {
      // If discount was applied in order, it should be shown
      const discount = page.locator('text=Discount');
      const count = await discount.count();
      if (count > 0) {
        await expect(discount).toBeVisible();
      }
    });
  });

  test.describe('Email Confirmation', () => {
    test('should show email confirmation message', async ({ page }) => {
      await expect(page.locator('text=/confirmation email/i')).toBeVisible();
    });

    test('should display customer email', async ({ page }) => {
      await expect(page.locator(`text=${testData.validShippingInfo.email}`)).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should have Continue Shopping button', async ({ page }) => {
      const continueButton = page.locator('button:has-text("Continue Shopping")');
      await expect(continueButton).toBeVisible();
    });

    test('should navigate back to home', async ({ page }) => {
      const continueButton = page.locator('button:has-text("Continue Shopping")');
      await continueButton.click();
      await page.waitForLoadState('networkidle');

      // Should be on home page
      await expect(page).toHaveURL('/');
      await expect(page.locator('text=Products')).toBeVisible();
    });

    test('should have empty cart after order', async ({ page }) => {
      // Click continue shopping
      const continueButton = page.locator('button:has-text("Continue Shopping")');
      await continueButton.click();
      await page.waitForLoadState('networkidle');

      // Cart should be empty
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(0);
    });
  });

  test.describe('Order Not Found', () => {
    test('should handle invalid order ID', async ({ page }) => {
      await page.goto('/confirmation/INVALID-ORDER-ID-123');
      await page.waitForLoadState('networkidle');

      // Should show order not found message
      await expect(page.locator('text=/Order Not Found/i')).toBeVisible();
    });

    test('should show Back to Shop button for invalid order', async ({ page }) => {
      await page.goto('/confirmation/INVALID-ORDER-ID-123');
      await page.waitForLoadState('networkidle');

      const backButton = page.locator('button:has-text("Back to Shop")');
      await expect(backButton).toBeVisible();

      // Click button
      await backButton.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to home
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Direct URL Access', () => {
    test('should access order by direct URL', async ({ page }) => {
      // Navigate away
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate back to order confirmation
      await page.goto(`/confirmation/${orderId}`);
      await page.waitForLoadState('networkidle');

      // Should still show order details
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
      await expect(page.locator(`text=/Order #${orderId}/i`)).toBeVisible();
    });

    test('should load order details from API', async ({ page }) => {
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still show all order details
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
      await expect(page.locator('text=Order Items')).toBeVisible();
      await expect(page.locator('text=Shipping Address')).toBeVisible();
    });
  });

  test.describe('Order Information Accuracy', () => {
    test('should match ordered items', async ({ page }) => {
      // Verify order items match what was in cart
      const orderItems = page.locator('text=Order Items').locator('..');
      await expect(orderItems).toBeVisible();

      // Should have at least 1 item
      const itemCount = await orderItems.locator('img').count();
      expect(itemCount).toBeGreaterThan(0);
    });

    test('should show correct customer information', async ({ page }) => {
      // Verify customer info matches what was entered
      await expect(page.locator(`text=${testData.validShippingInfo.name}`)).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.email}`)).toBeVisible();
    });

    test('should show correct address information', async ({ page }) => {
      // Verify address matches
      await expect(page.locator(`text=${testData.validShippingInfo.address}`)).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.city}`)).toBeVisible();
    });
  });

  test.describe('Visual Elements', () => {
    test('should have proper page layout', async ({ page }) => {
      // Check for main container
      const mainContent = page.locator('text=Order Confirmed').locator('../..');
      await expect(mainContent).toBeVisible();
    });

    test('should display in card format', async ({ page }) => {
      // Order details should be in card/box format
      const orderDetailsCard = page.locator('text=Order #').locator('..');
      await expect(orderDetailsCard).toBeVisible();
    });

    test('should show estimated delivery in highlighted format', async ({ page }) => {
      // Delivery estimate should be prominent
      const deliveryNotice = page.locator('text=Estimated Delivery').locator('..');
      await expect(deliveryNotice).toBeVisible();
    });
  });
});
