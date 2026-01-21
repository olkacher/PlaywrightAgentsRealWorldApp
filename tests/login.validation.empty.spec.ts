// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Validation — Empty fields', async ({ page }) => {
    // 1. Navigate to the login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Click the Login button with both fields empty.
    await page.locator('[data-test="signin-submit"]').click();

    // 3-4. Try submit with one field populated.
    await page.getByRole('textbox', { name: 'Username' }).fill('user@example.com');
    await page.locator('[data-test="signin-submit"]').click();
    await page.getByRole('textbox', { name: 'Username' }).fill('');

    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.locator('[data-test="signin-submit"]').click();

    // 5. Observe inline validation messages for each case.
    // Assert that an alert or inline validation exists (client-side or server-side).
    await expect(page.locator('role=alert').first()).toBeVisible();
  });
});
