import { test, expect } from '@playwright/test';
import { testConfig } from 'config/testConfig';


test('seed - login flow smoke', async ({ page }) => {
const { baseURL, testUsers, timeouts } = testConfig;

    await page.goto(baseURL);
    await page.fill('#username', testUsers.validUser.username);
    await page.fill('#password', testUsers.validUser.password);
    await page.click('[data-test="signin-submit"]');

    await page.waitForSelector('[data-test="sidenav-signout"]', {
      timeout: timeouts.medium
    });
  });
