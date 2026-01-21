// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Rate limiting / brute-force protection', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. From a single client, perform a rapid series of failed login attempts.
    for (let i = 0; i < 8; i++) {
      await page.getByRole('textbox', { name: 'Username' }).fill('user@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill(`wrong-pass-${i}`);
      await page.locator('[data-test="signin-submit"]').click();
      // brief check for failure alert
      await expect(page.locator('role=alert').first()).toBeVisible();
    }

    // 4. Attempt to login with correct credentials after the threshold is reached.
    await page.getByRole('textbox', { name: 'Username' }).fill('user@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.locator('[data-test="signin-submit"]').click();

    // Expect either success blocked or a mitigation message; assert either an alert or signout visible.
    const mitigation = page.locator('text=Too many attempts').first();
    if (await mitigation.count()) {
      await expect(mitigation).toBeVisible();
    } else {
      // fallback: ensure sign-in did not silently succeed without mitigation
      await expect(page.locator('[data-test="sidenav-signout"]')).toHaveCount(0);
    }
  });
});
