import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';
import path from 'path';

// Configure Playwright with Clerk
setup('global setup', async ({}) => {
  await clerkSetup();
});

// Define the path to the storage file, which is `user.json`
const authFile = path.join(__dirname, './playwright/.clerk/user.json');

setup('authenticate and save state to storage', async ({ page }) => {
  // This will fail without real credentials, but it sets up the structure.
  // The user needs to provide the E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD
  // environment variables.
  if (!process.env.E2E_CLERK_USER_USERNAME || !process.env.E2E_CLERK_USER_PASSWORD) {
    console.warn("Skipping authentication step: E2E test user credentials are not set.");
    // Create an empty auth file to prevent Playwright from crashing.
    await page.context().storageState({ path: authFile });
    return;
  }

  // Perform authentication steps.
  await page.goto('/');
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_CLERK_USER_USERNAME,
      password: process.env.E2E_CLERK_USER_PASSWORD,
    },
  });

  // Wait for the user to be signed in.
  await page.waitForFunction(() => (window as any).Clerk?.user?.id);

  // Save the auth state to the file.
  await page.context().storageState({ path: authFile });
});
