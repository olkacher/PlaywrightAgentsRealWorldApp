// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Validation — Empty fields', async ({ page }) => {
    // 1. Navigate to the login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Click the Login button with both fields empty and expect an alert.
    const submit = page.locator('[data-test="signin-submit"]');
    await submit.click();
    await expect(page.locator('role=alert').first()).toBeVisible();

    // 3-4. When only username is populated, submission should show validation alert.
    await page.getByRole('textbox', { name: 'Username' }).fill('Solon_Robel60');
    await submit.click();
    await expect(page.locator('role=alert').first()).toBeVisible();
    await page.getByRole('textbox', { name: 'Username' }).fill('');

    // When only password is populated, submission should show validation alert.
    await page.getByRole('textbox', { name: 'Password' }).fill('s3cret');
    await submit.click();
    await expect(page.locator('role=alert').first()).toBeVisible();
  });
});
