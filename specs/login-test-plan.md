# Login Page Test Plan

## Application Overview

Test plan covering functionality, validation, security, and error handling for the RealWorldApp login page. Assumes a clean browser state for each scenario. Designed for manual QA and to seed automated Playwright tests.

## Test Scenarios

### 1. Login Page

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy Path — valid credentials

**File:** `tests/login.spec.ts`

**Steps:**
  1. Assumptions: browser cleared, test account exists (user@example.com / P@ssw0rd).
  2. 1. Navigate to the application root URL.
  3. 2. Open the login page (click 'Login' or go to /login).
  4. 3. Enter registered email and password.
  5. 4. Click the primary 'Sign in' / 'Login' button.
  6. 5. Wait for navigation to the authenticated homepage or dashboard.
  7. 6. Verify UI shows authenticated user (username, profile, or Logout button).

**Expected Results:**
  - Assumptions: fresh state and valid credentials present.
  - Success criteria: user is redirected to the authenticated area; Logout (or account menu) is visible; session cookie/localStorage token is set; protected endpoints return 200.
  - Failure conditions: authentication page remains with an error message; no protected content visible; HTTP 4xx response from auth endpoint.

#### 1.2. Remember Me / Persistent Login

**File:** `tests/login.remember.spec.ts`

**Steps:**
  1. Assumptions: test account exists and browser profile can be restarted/kept between steps.
  2. 1. Navigate to login page.
  3. 2. Enter valid credentials and enable 'Remember me' (checkbox) if present.
  4. 3. Click Login and verify successful authentication.
  5. 4. Close and reopen the browser (or simulate by clearing only session state while keeping persistent storage).
  6. 5. Revisit the application root.
  7. 6. Verify the user remains authenticated without re-entering credentials.

**Expected Results:**
  - Assumptions: browser supports persistent localStorage/cookies.
  - Success criteria: user remains logged in after restart; persistent cookie or token exists and protected pages are accessible.
  - Failure conditions: user is prompted to login again; no persistent token stored.

#### 1.3. Validation — Empty fields

**File:** `tests/login.validation.empty.spec.ts`

**Steps:**
  1. 1. Navigate to the login page.
  2. 2. Click the Login button with both fields empty.
  3. 3. Enter email only, submit.
  4. 4. Enter password only, submit.
  5. 5. Observe inline validation messages for each case.

**Expected Results:**
  - Assumptions: client-side validation is expected.
  - Success criteria: appropriate 'required' messages shown for empty email/password; no auth request is made when client validation blocks submission; form highlights invalid fields.
  - Failure conditions: form submits to server with empty fields; server returns unclear error or stack trace.

#### 1.4. Validation — Invalid email format

**File:** `tests/login.validation.emailformat.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. Enter invalid email format (e.g., 'not-an-email') and a password.
  3. 3. Submit the form.
  4. 4. Observe validation message and focus/ARIA announcement for the email field.

**Expected Results:**
  - Assumptions: HTML5 or JS email validation expected.
  - Success criteria: inline format validation shown; form not submitted to authentication endpoint; accessible error message present.
  - Failure conditions: backend receives invalid email; generic error shown without field guidance.

#### 1.5. Incorrect password handling

**File:** `tests/login.incorrect-password.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. Enter a registered email and an incorrect password.
  3. 3. Submit the form.
  4. 4. Observe the error message and ensure no redirect occurs.
  5. 5. Ensure account is not authenticated (protected pages return 401/redirect to login).

**Expected Results:**
  - Assumptions: account exists for email used.
  - Success criteria: clear, non-sensitive error (e.g., 'Invalid username or password'); no leakage of which part is incorrect; no authenticated state is set.
  - Failure conditions: ambiguous or overly verbose error; successful login despite wrong password.

#### 1.6. Security — SQL injection attempt

**File:** `tests/login.security.sqlinjection.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. Enter SQL-like payload into email and/or password (e.g., "' OR '1'='1").
  3. 3. Submit the form.
  4. 4. Observe response and UI behavior.
  5. 5. Verify no sensitive server error/stack trace is displayed.

**Expected Results:**
  - Assumptions: app should be resilient to injection in inputs.
  - Success criteria: input treated as literal string, authentication fails, generic error message shown, no server error or data exposure.
  - Failure conditions: query succeeds and grants access; server returns stack trace or database error.

#### 1.7. Security — XSS input handling

**File:** `tests/login.security.xss.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. Enter XSS payloads into email or username fields (e.g., <script>alert(1)</script>) where applicable.
  3. 3. Submit the form or trigger any client-side rendering of that input (e.g., error echo).
  4. 4. Inspect DOM for executed scripts or unescaped HTML.
  5. 5. Confirm no alert or script execution occurs.

**Expected Results:**
  - Assumptions: any displayed inputs should be escaped.
  - Success criteria: input is sanitized/escaped before rendering; no script executes; error messages are plain text.
  - Failure conditions: DOM contains executable injected script; XSS payload is rendered unescaped.

#### 1.8. Rate limiting / brute-force protection

**File:** `tests/login.security.bruteforce.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. From a single client, perform a rapid series of failed login attempts (e.g., 10 attempts) using the same username with different incorrect passwords.
  3. 3. Observe server responses and UI messages after successive failures.
  4. 4. Attempt to login with correct credentials after the threshold is reached.

**Expected Results:**
  - Assumptions: system implements some anti-brute force mechanism (rate limit, lockout, captcha).
  - Success criteria: after threshold, system introduces delay, captcha, or temporary lockout and shows an explanatory message; correct credentials are blocked until lockout period elapses or account-unlock flow.
  - Failure conditions: unlimited rapid attempts allowed; no user-facing mitigation; no audit/logging entry for excessive failures.

#### 1.9. Forgot password / password reset flow

**File:** `tests/login.passwordreset.spec.ts`

**Steps:**
  1. 1. Navigate to login page.
  2. 2. Click 'Forgot password' or 'Reset password' link.
  3. 3. Enter a registered email and submit the reset request.
  4. 4. Observe UI confirmation message (e.g., 'Check your email for reset instructions').
  5. 5. If accessible in test env, verify that a reset email artifact is generated (or a test hook indicates an outgoing reset token).

**Expected Results:**
  - Assumptions: email delivery may be mocked in test environment.
  - Success criteria: user sees clear acknowledgement; flow exposes no sensitive info; reset request creates a token and triggers email/send-hook.
  - Failure conditions: no confirmation shown; error discloses whether an email is registered in an unsafe manner; reset token leaks.

#### 1.10. Session logout and protected-route enforcement

**File:** `tests/login.logout.spec.ts`

**Steps:**
  1. 1. Perform a successful login using valid credentials.
  2. 2. Navigate to a protected page to confirm access.
  3. 3. Click 'Logout'.
  4. 4. Verify user is redirected to login screen and UI no longer shows authenticated elements.
  5. 5. Attempt to access a protected route directly (bookmark) and confirm redirect to login or 401.
  6. 6. Inspect cookies/localStorage to ensure session tokens are removed or invalidated.

**Expected Results:**
  - Assumptions: logout endpoint invalidates session server-side and clears client tokens.
  - Success criteria: logout returns user to unauthenticated state; protected routes are blocked; no residual session tokens remain.
  - Failure conditions: protected page still accessible after logout; session token persists; logout fails silently.
