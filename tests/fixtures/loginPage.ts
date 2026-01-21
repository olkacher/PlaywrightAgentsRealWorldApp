import { test as base, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { testConfig } from 'config/testConfig';

type TestFixtures = {
  loginPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const { baseURL, testUsers, timeouts } = testConfig;

    await page.goto(baseURL);
    await page.fill('#username', testUsers.validUser.username);
    await page.fill('#password', testUsers.validUser.password);
    await page.click('[data-test="signin-submit"]');

    await page.waitForSelector('[data-test="sidenav-signout"]', {
      timeout: timeouts.medium
    });

    await use(page);
  },
});

export { expect };