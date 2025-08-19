import { test, expect } from '@playwright/test';

test.describe('Authenticated user flows', () => {
  test('should be able to access the dashboard', async ({ page }) => {
    // The user is already authenticated by the global setup.
    await page.goto('/dashboard');

    // Wait for the dashboard to load.
    await page.waitForURL('/dashboard');

    // Assert that the dashboard heading is visible.
    const heading = page.getByRole('heading', { name: /welcome to the dashboard/i });
    await expect(heading).toBeVisible();
  });
});
