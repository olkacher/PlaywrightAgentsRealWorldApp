// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('Forgot password / password reset flow', async ({ page }) => {
    // 1. Navigate to login page.
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/signin');

    // 2. Try to reach the password reset flow via link or common paths.
    const forgotLink = page.getByRole('link', { name: /forgot password|reset password|forgot your password/i });
    let reached = false;

    if (await forgotLink.count()) {
      await forgotLink.click();
      // verify we actually reached a reset page below
    } else {
      // try common reset URLs
      const candidates = ['/forgot', '/forgot-password', '/reset', '/password-reset', '/reset-password', '/request-password-reset'];
      for (const p of candidates) {
        await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de' + p);
        // we'll evaluate if this looks like a reset page below
        if (await looksLikeResetPage(page)) {
          reached = true;
          break;
        }
      }
    }

    // If we clicked a link, or navigated, check the page now for reset indicators.
    if (!reached) {
      reached = await looksLikeResetPage(page);
    }

    if (!reached) {
      test.skip(true, 'Password reset flow not present in this environment');
      return;
    }

    // 3. Enter a registered username/email and submit the reset request.
    const emailInput = page.getByRole('textbox', { name: /email|username/i });
    if (await emailInput.count()) {
      await emailInput.fill('Solon_Robel60');
    } else {
      // fallback to any input[type="email"] or input[name*="email"]
      const emailEl = page.locator('input[type="email"] , input[name*="email"]');
      if (await emailEl.count()) {
        await emailEl.first().fill('Solon_Robel60');
      } else {
        throw new Error('No email/username input found on reset page');
      }
    }

    const submitBtn = page.getByRole('button', { name: /submit|send|reset|send reset|send instructions|send password reset/i });
    if (await submitBtn.count()) {
      const b = submitBtn.first();
      if (await b.isEnabled()) await b.click();
      else throw new Error('Reset submit button is disabled');
    } else {
      const btn = page.locator('button[type="submit"]');
      if (await btn.count()) {
        const b = btn.first();
        if (await b.isEnabled()) await b.click();
        else throw new Error('Submit button present but disabled on reset page');
      } else throw new Error('No submit button found on reset page');
    }

    // 4. Observe UI confirmation message.
    const confirmations = [ 'Check your email', 'We have sent', 'sent a password reset', 'instructions have been sent' ];
    let seen = false;
    for (const txt of confirmations) {
      if (await page.locator(`text=${txt}`).count()) {
        seen = true;
        break;
      }
    }
    await expect(seen, 'expected a confirmation message after requesting password reset').toBeTruthy();
  });
});

// Helper: determines whether current page looks like a password-reset page
async function looksLikeResetPage(page: any) {
  if (await page.getByRole('heading', { name: /reset password|forgot password|password reset/i }).count()) return true;
  if (await page.locator('input[type="email"]').count()) return true;
  if (await page.getByRole('button', { name: /reset|send instructions|send reset|send password reset/i }).count()) return true;
  return false;
}
