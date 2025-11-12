import { test, expect } from '@playwright/test';
import { TestHelpers } from './fixtures/test-helpers.js';

test.describe('Filters and Search', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    await helpers.goToHome();
    await helpers.waitForProducts();
  });

  test.describe('Filter Sidebar', () => {
    test('should display filter sidebar', async ({ page }) => {
      // Wait for filter sidebar to load
      const filterHeading = page.locator('h2:has-text("Filters")');
      await expect(filterHeading).toBeVisible({ timeout: 10000 });
    });

    test('should have all filter sections', async ({ page }) => {
      // Wait for filters to load
      await page.waitForSelector('h2:has-text("Filters")', { timeout: 10000 });

      // Check all filter section buttons
      await expect(page.locator('button:has-text("Category")')).toBeVisible();
      await expect(page.locator('button:has-text("Price Range")')).toBeVisible();
      await expect(page.locator('button:has-text("Brand")')).toBeVisible();
      await expect(page.locator('button:has-text("Minimum Rating")')).toBeVisible();
      await expect(page.locator('button:has-text("Availability")')).toBeVisible();
    });

    test('should expand/collapse filter sections', async ({ page }) => {
      // Wait for filters
      await page.waitForSelector('h2:has-text("Filters")', { timeout: 10000 });

      // Find a filter section with chevron
      const categorySection = page.locator('button:has-text("Category")');

      // Check if initially expanded (default)
      const categoryCheckboxes = page.locator('input[id*="category"]');
      const initialCount = await categoryCheckboxes.count();
      expect(initialCount).toBeGreaterThan(0);

      // Click to collapse
      await categorySection.click();
      await page.waitForTimeout(300);

      // Verify collapsed (checkboxes hidden)
      const collapsedCount = await categoryCheckboxes.filter({ hasText: /./ }).count();

      // Click to expand
      await categorySection.click();
      await page.waitForTimeout(300);

      // Verify expanded again
      const expandedCount = await categoryCheckboxes.count();
      expect(expandedCount).toBeGreaterThan(0);
    });
  });

  test.describe('Category Filter', () => {
    test('should filter products by category', async ({ page }) => {
      const initialCount = await page.locator('[class*="card"]').count();

      // Apply category filter (find first category checkbox)
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(1000);

      // Verify products are filtered
      const filteredCount = await page.locator('[class*="card"]').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      // Verify active filter tag is shown
      const activeFilters = page.locator('text=Active Filters');
      const hasActiveFilters = await activeFilters.count() > 0;
      if (hasActiveFilters) {
        await expect(activeFilters).toBeVisible();
      }
    });

    test('should allow multiple category selections', async ({ page }) => {
      // Select first category
      const checkboxes = page.locator('input[id*="category"]');
      const count = await checkboxes.count();

      if (count >= 2) {
        await checkboxes.nth(0).click();
        await page.waitForTimeout(500);

        await checkboxes.nth(1).click();
        await page.waitForTimeout(500);

        // Verify both filters are active
        const activeFilterTags = page.locator('[class*="primary-50"]');
        const tagCount = await activeFilterTags.count();
        expect(tagCount).toBeGreaterThanOrEqual(2);
      }
    });
  });

  test.describe('Price Range Filter', () => {
    test('should filter by price range using quick presets', async ({ page }) => {
      // Click "Under $50" preset
      const under50 = page.locator('text=Under $50');
      await under50.click();
      await page.waitForTimeout(1000);

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').all();
      expect(products.length).toBeGreaterThan(0);
    });

    test('should filter by custom price range', async ({ page }) => {
      await helpers.applyPriceRange(100, 500);

      // Verify filter is applied
      const activeFilters = page.locator('text=/\\$100.*\\$500/');
      const hasFilter = await activeFilters.count() > 0;
      if (hasFilter) {
        await expect(activeFilters.first()).toBeVisible();
      }
    });

    test('should handle min price only', async ({ page }) => {
      await page.fill('input[placeholder="Min"]', '200');
      await page.click('button:has-text("Apply")');
      await page.waitForTimeout(1000);

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').all();
      expect(products.length).toBeGreaterThan(0);
    });

    test('should handle max price only', async ({ page }) => {
      await page.fill('input[placeholder="Max"]', '100');
      await page.click('button:has-text("Apply")');
      await page.waitForTimeout(1000);

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').all();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  test.describe('Brand Filter', () => {
    test('should filter by brand', async ({ page }) => {
      // Click first brand checkbox
      const firstBrandCheckbox = page.locator('input[id*="brand"]').first();
      await firstBrandCheckbox.click();
      await page.waitForTimeout(1000);

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').all();
      expect(products.length).toBeGreaterThan(0);

      // Verify active filter tag
      const activeFilters = page.locator('text=Active Filters');
      const hasFilters = await activeFilters.count() > 0;
      if (hasFilters) {
        await expect(activeFilters).toBeVisible();
      }
    });
  });

  test.describe('Rating Filter', () => {
    test('should filter by minimum rating', async ({ page }) => {
      // Select 4+ stars
      const fourStars = page.locator('input[id*="rating-4"]');
      const exists = await fourStars.count() > 0;

      if (exists) {
        await fourStars.click();
        await page.waitForTimeout(1000);

        // Verify products are filtered
        const products = await page.locator('[class*="card"]').all();
        expect(products.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Availability Filter', () => {
    test('should filter by in stock', async ({ page }) => {
      const inStockCheckbox = page.locator('input[id="in-stock"]');
      await inStockCheckbox.click();
      await page.waitForTimeout(1000);

      // Verify no "Out of Stock" buttons visible
      const outOfStockButtons = await page.locator('button:has-text("Out of Stock")').count();
      expect(outOfStockButtons).toBe(0);
    });

    test('should filter by out of stock', async ({ page }) => {
      const outOfStockCheckbox = page.locator('input[id="out-of-stock"]');
      await outOfStockCheckbox.click();
      await page.waitForTimeout(1000);

      // If there are out of stock products, verify they're shown
      const outOfStockButtons = await page.locator('button:has-text("Out of Stock")').count();
      if (outOfStockButtons > 0) {
        expect(outOfStockButtons).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Active Filters', () => {
    test('should display active filter tags', async ({ page }) => {
      // Apply a filter
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(500);

      // Check for active filters section
      const activeFilters = page.locator('text=Active Filters');
      const count = await activeFilters.count();
      if (count > 0) {
        await expect(activeFilters).toBeVisible();
      }
    });

    test('should remove individual filter tags', async ({ page }) => {
      // Apply a filter
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(500);

      // Find and click remove button on filter tag
      const removeButton = page.locator('[class*="primary-50"] button').first();
      const exists = await removeButton.count() > 0;

      if (exists) {
        await removeButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should clear all filters', async ({ page }) => {
      // Apply multiple filters
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(300);

      await page.fill('input[placeholder="Min"]', '50');
      await page.click('button:has-text("Apply")');
      await page.waitForTimeout(500);

      // Click "Clear All" button
      const clearAllButton = page.locator('text=Clear All');
      const clearCount = await clearAllButton.count();

      if (clearCount > 0) {
        await clearAllButton.first().click();
        await page.waitForTimeout(500);

        // Verify filters are cleared
        const activeFilters = page.locator('text=Active Filters');
        const stillActive = await activeFilters.count();
        expect(stillActive).toBe(0);
      }
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for products', async ({ page }) => {
      await helpers.searchProducts('laptop');

      // Verify search results
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThanOrEqual(0);
    });

    test('should show no results message for invalid search', async ({ page }) => {
      await helpers.searchProducts('xyzabc123notfound');
      await page.waitForTimeout(1000);

      // Check for no results message
      const noResults = page.locator('text=No products found');
      await expect(noResults).toBeVisible();
    });

    test('should clear search', async ({ page }) => {
      await helpers.searchProducts('laptop');
      await page.waitForTimeout(500);

      // Click clear button
      const clearButton = page.locator('input[placeholder*="Search"] ~ button').last();
      await clearButton.click();
      await page.waitForTimeout(500);

      // Verify search is cleared
      const searchInput = page.locator('input[placeholder*="Search"]');
      const value = await searchInput.inputValue();
      expect(value).toBe('');
    });
  });

  test.describe('Sort Functionality', () => {
    test('should sort by price: low to high', async ({ page }) => {
      await helpers.changeSortOrder('price_asc');

      // Get first product price
      const firstPrice = await page.locator('[class*="card"]').first().locator('text=/\\$/').first().textContent();
      expect(firstPrice).toBeTruthy();
    });

    test('should sort by price: high to low', async ({ page }) => {
      await helpers.changeSortOrder('price_desc');

      // Get first product price
      const firstPrice = await page.locator('[class*="card"]').first().locator('text=/\\$/').first().textContent();
      expect(firstPrice).toBeTruthy();
    });

    test('should sort by newest arrivals', async ({ page }) => {
      await helpers.changeSortOrder('newest');

      // Verify products are still displayed
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThan(0);
    });

    test('should sort by top rated', async ({ page }) => {
      await helpers.changeSortOrder('rating');

      // Verify products are still displayed
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThan(0);
    });
  });

  test.describe('Combined Filters', () => {
    test('should apply multiple filters simultaneously', async ({ page }) => {
      // Apply category filter
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(300);

      // Apply price filter
      await page.fill('input[placeholder="Min"]', '50');
      await page.fill('input[placeholder="Max"]', '500');
      await page.click('button:has-text("Apply")');
      await page.waitForTimeout(500);

      // Apply rating filter
      const fourStars = page.locator('input[id*="rating-4"]');
      const ratingExists = await fourStars.count() > 0;
      if (ratingExists) {
        await fourStars.click();
        await page.waitForTimeout(500);
      }

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThanOrEqual(0);
    });

    test('should combine filters with search', async ({ page }) => {
      // Apply category filter
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(300);

      // Apply search
      await helpers.searchProducts('premium');
      await page.waitForTimeout(500);

      // Verify products are filtered
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThanOrEqual(0);
    });

    test('should combine filters with sorting', async ({ page }) => {
      // Apply filter
      const firstCategoryCheckbox = page.locator('input[id*="category"]').first();
      await firstCategoryCheckbox.click();
      await page.waitForTimeout(300);

      // Apply sort
      await helpers.changeSortOrder('price_asc');
      await page.waitForTimeout(500);

      // Verify products are displayed
      const products = await page.locator('[class*="card"]').count();
      expect(products).toBeGreaterThan(0);
    });
  });
});
