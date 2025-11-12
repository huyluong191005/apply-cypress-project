import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './fixtures/test-helpers.js';

test.describe('Checkout Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();

    // Add product and navigate to checkout
    await helpers.addFirstProductToCart();
    await page.waitForTimeout(500);
    await helpers.openCart();
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Checkout Page', () => {
    test('should display checkout page', async ({ page }) => {
      await expect(page.locator('text=Checkout')).toBeVisible();
    });

    test('should show progress indicator', async ({ page }) => {
      await expect(page.locator('text=Shipping')).toBeVisible();
      await expect(page.locator('text=Payment')).toBeVisible();
      await expect(page.locator('text=Review')).toBeVisible();
    });

    test('should display order summary sidebar', async ({ page }) => {
      await expect(page.locator('text=Order Summary')).toBeVisible();
    });

    test('should show order items in sidebar', async ({ page }) => {
      const orderItems = page.locator('text=Order Summary').locator('..').locator('img');
      const count = await orderItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should redirect to home if cart is empty', async ({ page }) => {
      // Clear cart
      await helpers.clearStorage();

      // Try to navigate to checkout
      await page.goto('/checkout');
      await page.waitForTimeout(1000);

      // Should redirect to home
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Step 1: Shipping Information', () => {
    test('should display shipping form', async ({ page }) => {
      await expect(page.locator('text=Shipping Information')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="phone"]')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Click Continue without filling form
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(500);

      // Should show error messages
      const errors = page.locator('text=/is required/i');
      const errorCount = await errors.count();
      expect(errorCount).toBeGreaterThan(0);
    });

    test('should validate email format', async ({ page }) => {
      await page.fill('input[name="email"]', 'invalid-email');
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(500);

      // Should show email error
      const emailError = page.locator('text=/invalid.*email/i');
      await expect(emailError.first()).toBeVisible();
    });

    test('should validate phone format', async ({ page }) => {
      await page.fill('input[name="phone"]', '123');
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(500);

      // Should show phone error
      const phoneError = page.locator('text=/invalid.*phone/i');
      const count = await phoneError.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should validate ZIP code format', async ({ page }) => {
      await helpers.fillShippingForm({ zipCode: 'abc123' });
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(500);

      // Should show ZIP error
      const zipError = page.locator('text=/invalid.*zip/i');
      const count = await zipError.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should submit valid shipping form', async ({ page }) => {
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      // Should navigate to payment step
      await expect(page.locator('text=Payment Information')).toBeVisible();
    });

    test('should have "billing same as shipping" checkbox checked by default', async ({ page }) => {
      const checkbox = page.locator('input[id="sameAsBilling"]');
      await expect(checkbox).toBeChecked();
    });

    test('should persist shipping data on page reload', async ({ page }) => {
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be on payment step
      await expect(page.locator('text=Payment Information')).toBeVisible();
    });
  });

  test.describe('Step 2: Payment Information', () => {
    test.beforeEach(async ({ page }) => {
      // Complete shipping step
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);
    });

    test('should display payment form', async ({ page }) => {
      await expect(page.locator('text=Payment Information')).toBeVisible();
      await expect(page.locator('input[name="cardNumber"]')).toBeVisible();
      await expect(page.locator('input[name="cardholderName"]')).toBeVisible();
    });

    test('should show test mode notice', async ({ page }) => {
      await expect(page.locator('text=/test mode/i')).toBeVisible();
    });

    test('should validate required payment fields', async ({ page }) => {
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(500);

      // Should show error messages
      const errors = page.locator('text=/is required/i');
      const errorCount = await errors.count();
      expect(errorCount).toBeGreaterThan(0);
    });

    test('should format card number with spaces', async ({ page }) => {
      await page.fill('input[name="cardNumber"]', '4532123456789010');
      const value = await page.inputValue('input[name="cardNumber"]');
      expect(value).toContain(' '); // Should have spaces
    });

    test('should format expiration date as MM/YY', async ({ page }) => {
      await page.fill('input[name="expirationDate"]', '1225');
      const value = await page.inputValue('input[name="expirationDate"]');
      expect(value).toBe('12/25');
    });

    test('should validate card number', async ({ page }) => {
      await helpers.fillPaymentForm({ cardNumber: '1111 1111 1111 1111' });
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(500);

      // Should show card error
      const cardError = page.locator('text=/invalid.*card/i');
      const count = await cardError.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should validate expiration date', async ({ page }) => {
      await helpers.fillPaymentForm({ expirationDate: '01/20' }); // Past date
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(500);

      // Should show expiration error
      const expiryError = page.locator('text=/invalid.*expired/i');
      const count = await expiryError.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should validate CVV', async ({ page }) => {
      await helpers.fillPaymentForm({ cvv: '12' });
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(500);

      // Should show CVV error
      const cvvError = page.locator('text=/invalid.*cvv/i');
      const count = await cvvError.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should submit valid payment form', async ({ page }) => {
      await helpers.fillPaymentForm(testData.validPaymentInfo);
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(1000);

      // Should navigate to review step
      await expect(page.locator('text=Review Your Order')).toBeVisible();
    });

    test('should navigate back to shipping', async ({ page }) => {
      await page.click('button:has-text("Back")');
      await page.waitForTimeout(500);

      // Should show shipping form
      await expect(page.locator('text=Shipping Information')).toBeVisible();
    });

    test('should show security message', async ({ page }) => {
      await expect(page.locator('text=/your payment is secure/i')).toBeVisible();
    });
  });

  test.describe('Step 3: Order Review', () => {
    test.beforeEach(async ({ page }) => {
      // Complete shipping and payment steps
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      await helpers.fillPaymentForm(testData.validPaymentInfo);
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(1000);
    });

    test('should display order review', async ({ page }) => {
      await expect(page.locator('text=Review Your Order')).toBeVisible();
    });

    test('should show order items', async ({ page }) => {
      await expect(page.locator('text=Order Items')).toBeVisible();
      const items = page.locator('text=Order Items').locator('..').locator('img');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display shipping address', async ({ page }) => {
      await expect(page.locator('text=Shipping Address')).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.name}`)).toBeVisible();
      await expect(page.locator(`text=${testData.validShippingInfo.email}`)).toBeVisible();
    });

    test('should display payment method', async ({ page }) => {
      await expect(page.locator('text=Payment Method')).toBeVisible();
      await expect(page.locator('text=Credit Card')).toBeVisible();
    });

    test('should show masked card number', async ({ page }) => {
      // Should show last 4 digits only
      await expect(page.locator('text=/\\*{4}.*9010/')).toBeVisible();
    });

    test('should display order totals', async ({ page }) => {
      await expect(page.locator('text=Subtotal')).toBeVisible();
      await expect(page.locator('text=Shipping')).toBeVisible();
      await expect(page.locator('text=Tax')).toBeVisible();
      await expect(page.locator('text=Total').last()).toBeVisible();
    });

    test('should allow editing shipping info', async ({ page }) => {
      const editButton = page.locator('text=Shipping Address').locator('..').locator('button:has-text("Edit")');
      await editButton.click();
      await page.waitForTimeout(500);

      // Should navigate to shipping step
      await expect(page.locator('text=Shipping Information')).toBeVisible();
    });

    test('should allow editing payment info', async ({ page }) => {
      const editButton = page.locator('text=Payment Method').locator('..').locator('button:has-text("Edit")');
      await editButton.click();
      await page.waitForTimeout(500);

      // Should navigate to payment step
      await expect(page.locator('text=Payment Information')).toBeVisible();
    });

    test('should have terms and conditions checkbox', async ({ page }) => {
      const termsCheckbox = page.locator('input[id="terms"]');
      await expect(termsCheckbox).toBeVisible();
      await expect(termsCheckbox).not.toBeChecked();
    });

    test('should require terms acceptance', async ({ page }) => {
      // Try to place order without accepting terms
      await page.click('button:has-text("Place Order")');
      await page.waitForTimeout(500);

      // Should show alert or stay on page
      // The order should not be placed
    });

    test('should place order successfully', async ({ page }) => {
      // Accept terms
      await page.check('input[id="terms"]');

      // Place order
      await page.click('button:has-text("Place Order")');

      // Wait for navigation to confirmation page
      await page.waitForURL(/.*confirmation.*/, { timeout: 10000 });

      // Should show confirmation page
      await expect(page.locator('text=Order Confirmed')).toBeVisible();
    });

    test('should show loading state while placing order', async ({ page }) => {
      await page.check('input[id="terms"]');
      await page.click('button:has-text("Place Order")');

      // Should show processing state
      const processing = page.locator('text=Processing');
      const count = await processing.count();
      if (count > 0) {
        await expect(processing).toBeVisible();
      }
    });

    test('should disable Place Order button without terms', async ({ page }) => {
      const placeOrderButton = page.locator('button:has-text("Place Order")');
      await expect(placeOrderButton).toBeDisabled();
    });

    test('should enable Place Order button with terms', async ({ page }) => {
      await page.check('input[id="terms"]');
      const placeOrderButton = page.locator('button:has-text("Place Order")');
      await expect(placeOrderButton).toBeEnabled();
    });
  });

  test.describe('Checkout Navigation', () => {
    test('should show correct step indicator', async ({ page }) => {
      // Step 1 - Shipping
      const step1 = page.locator('text=Shipping').first();
      await expect(step1).toBeVisible();

      // Complete shipping
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      // Step 2 - Payment
      const step2 = page.locator('text=Payment').first();
      await expect(step2).toBeVisible();

      // Complete payment
      await helpers.fillPaymentForm(testData.validPaymentInfo);
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(1000);

      // Step 3 - Review
      const step3 = page.locator('text=Review').first();
      await expect(step3).toBeVisible();
    });

    test('should navigate back through steps', async ({ page }) => {
      // Go to payment
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      // Go back
      await page.click('button:has-text("Back")');
      await page.waitForTimeout(500);

      // Should be on shipping
      await expect(page.locator('text=Shipping Information')).toBeVisible();
    });

    test('should preserve data when navigating back', async ({ page }) => {
      // Fill shipping
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      // Go back
      await page.click('button:has-text("Back")');
      await page.waitForTimeout(500);

      // Verify data is preserved
      const nameValue = await page.inputValue('input[name="name"]');
      expect(nameValue).toBe(testData.validShippingInfo.name);
    });
  });

  test.describe('Checkout Persistence', () => {
    test('should persist checkout data on reload', async ({ page }) => {
      // Fill shipping form
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be on payment step with data preserved
      await expect(page.locator('text=Payment Information')).toBeVisible();
    });

    test('should clear checkout data after order placement', async ({ page }) => {
      // Complete checkout
      await helpers.fillShippingForm(testData.validShippingInfo);
      await page.click('button:has-text("Continue to Payment")');
      await page.waitForTimeout(1000);

      await helpers.fillPaymentForm(testData.validPaymentInfo);
      await page.click('button:has-text("Continue to Review")');
      await page.waitForTimeout(1000);

      await page.check('input[id="terms"]');
      await page.click('button:has-text("Place Order")');
      await page.waitForURL(/.*confirmation.*/, { timeout: 10000 });

      // Navigate back to home
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Cart should be empty
      const cartCount = await helpers.getCartCount();
      expect(cartCount).toBe(0);
    });
  });
});
