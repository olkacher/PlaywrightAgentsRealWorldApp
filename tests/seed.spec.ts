import { test, expect } from './fixtures/loginPage';
import type { Page } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ loginPage }: { loginPage: Page }) => {
    const page = loginPage;
    await page.waitForTimeout(10);
  });
});
