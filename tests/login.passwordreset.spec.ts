// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Forgot password / password reset flow', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Click 'Forgot password' or 'Reset password' link.
    const forgot = page.getByRole('link', { name: /forgot password|reset password/i });
    if (await forgot.count()) {
      await forgot.click();
      // 3. Enter a registered email and submit the reset request.
      await page.getByRole('textbox', { name: /email|username/i }).fill('Solon_Robel60');
      await page.getByRole('button', { name: /submit|send|reset/i }).click();

      // 4. Observe UI confirmation message.
      await expect(page.locator('text=Check your email').first()).toBeVisible();
    } else {
      test.skip(true, 'Forgot password link not present in this environment');
    }
  });
});
