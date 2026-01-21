// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Happy Path — valid credentials', async ({ page }) => {
    // 1. Navigate to the application root URL.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');

    // 2. Open the login page (click 'Login' or go to /login).
    // Ensure logged-out state by clicking signout if present, then navigate to signin.
    const signOut = page.locator('[data-test="sidenav-signout"]');
    if (await signOut.count()) await signOut.click();

    // 3. Enter registered email and password.
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    await username.fill('Solon_Robel60');
    await password.fill('s3cret');

    // 4. Click the primary 'Sign in' / 'Login' button.
    await page.locator('[data-test="signin-submit"]').click();

    // 5. Wait for navigation to the authenticated homepage or dashboard.
    await expect(page.locator('[data-test="sidenav-signout"]')).toBeVisible();

    // 6. Verify UI shows authenticated user (username, profile, or Logout button).
    await expect(page.locator('text=Logout')).toBeVisible();
  });
});
