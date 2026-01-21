// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Security — SQL injection attempt', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Enter SQL-like payload into email and password.
    await page.getByRole('textbox', { name: 'Username' }).fill("' OR '1'='1");
    await page.getByRole('textbox', { name: 'Password' }).fill("' OR '1'='1");

    // 3. Submit the form.
    await page.locator('[data-test="signin-submit"]').click();

    // 4-5. Observe response and verify no sensitive server error/stack trace is displayed.
    const alert = page.locator('role=alert').first();
    await expect(alert).toBeVisible();
    // Ensure page does not show stack traces or raw database errors by checking for common keywords.
    await expect(page.locator('body')).not.toContainText(/Exception|Stacktrace|SQL|syntax/i);
  });
});
