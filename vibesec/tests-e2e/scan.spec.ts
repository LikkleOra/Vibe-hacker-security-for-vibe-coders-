import { test, expect } from '@playwright/test';

test.describe('Vulnerability Scanning Flow', () => {
  // Use the global setup for authentication
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('should perform a scan and display results', async ({ page }) => {
    // Navigate to the scanner page
    await page.goto('/');

    // The URL of the public repository to be scanned
    const repoUrl = 'https://github.com/Plazmaz/leaky-repo';

    // Fill the input with the repository URL
    await page.getByPlaceholder('Enter a public repository URL').fill(repoUrl);

    // Click the scan button
    await page.getByRole('button', { name: 'Scan Repository' }).click();

    // Wait for the scan result card to appear for the given URL
    const resultCard = page.locator('.border', { hasText: repoUrl });
    await expect(resultCard).toBeVisible({ timeout: 20000 }); // Wait up to 20s for clone

    // Wait for the status to be "Completed"
    const completedPill = resultCard.locator('text=Completed');
    // The full scan including AI analysis might take a while
    await expect(completedPill).toBeVisible({ timeout: 60000 }); // Wait up to 60s for scan + AI

    // Assert that a specific, known vulnerability is found
    const findingCard = resultCard.locator('.border', { hasText: 'Hardcoded Secret: AWS Access Key' });
    await expect(findingCard).toBeVisible();

    // Further assert the details of the finding
    const pocText = findingCard.locator('p', { hasText: 'Proof of Concept' });
    await expect(pocText).toContainText('leaky-repo/secrets.yml');
  });
});
