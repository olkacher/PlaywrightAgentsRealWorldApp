import { test, expect } from '@playwright/test';

test('seed - login flow smoke', async ({ page }) => {
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');
    await page.fill('#username', 'Solon_Robel60');
    await page.fill('#password', 's3cret');
    await page.click('[data-test="signin-submit"]');

    await page.waitForSelector('[data-test="sidenav-signout"]');

  });
