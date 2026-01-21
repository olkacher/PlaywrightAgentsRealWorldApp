import { test, expect } from './fixtures/loginPage';
import type { Page } from '@playwright/test';

test('seed - login flow smoke', async ({ loginPage }: { loginPage: Page }) => {
  const page: Page = loginPage;

});
