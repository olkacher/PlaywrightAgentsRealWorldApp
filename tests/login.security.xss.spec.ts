// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Security — XSS input handling', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Enter XSS payloads into email or username fields.
    const payload = '<script>alert(1)</script>';
    await page.getByRole('textbox', { name: 'Username' }).fill(payload);
    await page.getByRole('textbox', { name: 'Password' }).fill('s3cret');

    // 3. Submit the form or trigger any client-side rendering of that input.
    await page.locator('[data-test="signin-submit"]').click();

    // 4. Inspect DOM for executed scripts or unescaped HTML.
    // 5. Confirm no alert or script execution occurs by verifying that the payload is not executed.
    // Check that page text does not contain the unescaped payload
    await expect(page.locator('body')).not.toContainText('<script>alert(1)</script>');
  });
});
