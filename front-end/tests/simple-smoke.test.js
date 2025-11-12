import { test, expect } from '@playwright/test';

test.describe('Simple Smoke Test', () => {
  test('should load homepage and render content', async ({ page }) => {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded, waiting for root div...');

    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('Root div found');

    // Wait for products to load
    await page.waitForSelector('text=Products', { timeout: 15000 });
    console.log('Products text found');

    // Check if header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    console.log('Header is visible');

    console.log('Test passed!');
  });
});
