// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Session logout and protected-route enforcement', async ({ page }) => {
    // 1. Perform a successful login using valid credentials.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');
    await page.getByRole('textbox', { name: 'Username' }).fill('Solon_Robel60');
    await page.getByRole('textbox', { name: 'Password' }).fill('s3cret');
    await page.locator('[data-test="signin-submit"]').click();
    await expect(page.locator('[data-test="sidenav-signout"]')).toBeVisible();

    // 2. Navigate to a protected page to confirm access.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');
    await expect(page.locator('[data-test="sidenav-signout"]')).toBeVisible();

    // 3. Click 'Logout'.
    const logout = page.locator('text=Logout');
    await logout.click();

    // 4. Verify user is redirected to login screen and UI no longer shows authenticated elements.
    await expect(page).toHaveURL(/signin/);
    await expect(page.locator('[data-test="sidenav-signout"]')).toHaveCount(0);

    // 5. Attempt to access a protected route directly and confirm redirect to login.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

    // 6. Inspect cookies/localStorage to ensure session tokens are removed or invalidated.
    const cookies = await page.context().cookies();
    expect(cookies.filter(c => /auth|session|token/i.test(c.name)).length).toBe(0);
  });
});
