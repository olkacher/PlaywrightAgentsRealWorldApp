// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Remember Me / Persistent Login', async ({ page, context }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Enter valid credentials and enable 'Remember me'.
    await page.getByRole('textbox', { name: 'Username' }).fill('user@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    const remember = page.getByRole('checkbox', { name: 'Remember me' });
    if (await remember.count()) await remember.check();

    // 3. Click Login and verify successful authentication.
    await page.locator('[data-test="signin-submit"]').click();
    await expect(page.locator('[data-test="sidenav-signout"]')).toBeVisible();

    // 4. Persist storage state to simulate restart and verify persistence.
    const storage = await context.storageState();
    // New context simulates browser restart with same storage
    const newContext = await context.browser().newContext({ storageState: storage });
    const newPage = await newContext.newPage();
    await newPage.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');

    // 5. Revisit the application root and verify the user remains authenticated.
    await expect(newPage.locator('[data-test="sidenav-signout"]')).toBeVisible();
    await newContext.close();
  });
});
