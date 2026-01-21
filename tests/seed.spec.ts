import { test } from './fixtures/loginPage';
import { expect } from '@playwright/test';
import { Page } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ loginPage }: { loginPage: Page }) => {
    const page = loginPage;
  });
});
