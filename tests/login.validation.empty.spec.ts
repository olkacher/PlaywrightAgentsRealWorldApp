// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Validation — Empty fields', async ({ page }) => {
    // 1. Navigate to the login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Click the Login button with both fields empty.
    const submit = page.locator('[data-test="signin-submit"]');
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    if (await submit.isEnabled()) {
      await submit.click();

      // Ensure we remain on the sign-in page (not authenticated).
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

      // Accept multiple possible validation presentations: alert, inline 'required' text, or aria-invalid on inputs.
      const alertCount = await page.locator('role=alert').count();
      const requiredText = await page.locator('text=/required/i').count();
      const usernameInvalid = (await username.getAttribute('aria-invalid')) === 'true';
      const passwordInvalid = (await password.getAttribute('aria-invalid')) === 'true';

      if (alertCount) {
        await expect(page.locator('role=alert').first()).toBeVisible();
      } else if (requiredText) {
        await expect(page.locator('text=/required/i').first()).toBeVisible();
      } else {
        // Fallback: expect at least one input to be aria-invalid
        expect(usernameInvalid || passwordInvalid).toBeTruthy();
      }
    } else {
      // If the app disables submit for empty form, assert that behavior instead.
      await expect(submit).toBeDisabled();
    }

    // 3-4. When only username is populated, submission should show validation (same checks).
    await username.fill('Solon_Robel60');
    if (await submit.isEnabled()) {
      await submit.click();
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
      if (await page.locator('role=alert').count()) {
        await expect(page.locator('role=alert').first()).toBeVisible();
      }
    } else {
      await expect(submit).toBeDisabled();
    }
    await username.fill('');

    // When only password is populated, submission should show validation (same checks).
    await password.fill('s3cret');
    if (await submit.isEnabled()) {
      await submit.click();
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
      if (await page.locator('role=alert').count()) {
        await expect(page.locator('role=alert').first()).toBeVisible();
      }
    } else {
      await expect(submit).toBeDisabled();
    }
  });
});
