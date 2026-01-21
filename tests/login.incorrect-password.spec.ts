// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Incorrect password handling', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Enter a registered email and an incorrect password.
    await page.getByRole('textbox', { name: 'Username' }).fill('Solon_Robel60');
    await page.getByRole('textbox', { name: 'Password' }).fill('incorrect-password');

    // 3. Submit the form.
    await page.locator('[data-test="signin-submit"]').click();

    // 4. Observe the error message and ensure no redirect occurs.
    const alert = page.locator('role=alert').first();
    await expect(alert).toBeVisible();
    await expect(page).toHaveURL(/signin/);

    // 5. Ensure account is not authenticated (protected pages return 401/redirect to login).
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');
    await expect(page.locator('[data-test="sidenav-signout"]')).toHaveCount(0);
  });
});
