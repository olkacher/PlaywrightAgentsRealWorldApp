// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Validation — Invalid email format', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Enter invalid email format and a password.
    await page.getByRole('textbox', { name: 'Username' }).fill('not-an-email');
    await page.getByRole('textbox', { name: 'Password' }).fill('s3cret');

    // 3. Submit the form.
    await page.locator('[data-test="signin-submit"]').click();

    // 4. Observe validation message (expect client-side or server-side error indicator).
    await expect(page.locator('role=alert').first()).toBeVisible();
  });
});
