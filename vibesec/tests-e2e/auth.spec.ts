import { test, expect } from '@playwright/test';

test.describe('Authentication and Authorization', () => {
  test('should redirect unauthenticated user from dashboard to sign-in page', async ({ page }) => {
    // Start from the dashboard page.
    await page.goto('/dashboard');

    // Wait for the redirect to the sign-in page.
    await page.waitForURL('**/sign-in**');

    // Assert that the URL is now the sign-in page.
    expect(page.url()).toContain('/sign-in');
  });
});
