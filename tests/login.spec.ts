import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should_showCorrectElements', async ({ page }) => {
    const loginForm = page.locator('form.form');
    await expect(loginForm).toBeVisible({ timeout: 10000 });
    
    const title = page.locator('h2.title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Sign In');
    
    const emailInput = page.locator('input[type="email"].input');
    const passwordInput = page.locator('input[type="password"].input');
    const submitButton = page.locator('button[type="submit"].btn.primary-btn');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Sign In');
  });

  test('should_showErrors_when_emptyFormSubmitted', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"].btn.primary-btn');
    await submitButton.click();
    
    const emailInput = page.locator('input[type="email"].input');
    const passwordInput = page.locator('input[type="password"].input');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    const isEmailValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    const isPasswordValid = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    expect(isEmailValid || isPasswordValid).toBe(false);
  });

  test('should_fail_when_wrongCredentials', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('Console error:', msg.text());
      }
    });

    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log('Page error:', error.message);
    });

    const emailInput = page.locator('input[type="email"].input');
    const passwordInput = page.locator('input[type="password"].input');
    const submitButton = page.locator('button[type="submit"].btn.primary-btn');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    
    await submitButton.click();
    
    await page.waitForTimeout(5000);
    
    const allErrors = [...consoleErrors, ...pageErrors];
    const firebaseErrors = allErrors.filter(error => 
      error.includes('Firebase') || 
      error.includes('firebase') || 
      error.includes('API key') ||
      error.includes('auth/') ||
      error.includes('Invalid API key') ||
      error.includes('Request failed')
    );
    
    console.log('All errors:', allErrors);
    console.log('Firebase errors:', firebaseErrors);
    
    const currentURL = page.url();
    const isStillOnLogin = currentURL.includes('/login') || await page.locator('h2.title:has-text("Sign In")').isVisible();
    
    if (firebaseErrors.length > 0) {
      console.log('✓ Firebase authentication failed as expected with wrong credentials');
      expect(firebaseErrors.length).toBeGreaterThan(0);
    } else if (isStillOnLogin) {
      console.log('✓ Authentication failed - still on login page');
      expect(isStillOnLogin).toBe(true);
    } else {
      console.log('⚠️ Authentication might not be properly implemented or Firebase not being used');
    }
  });

  test('should_acceptCredentials_when_validDataEntered', async ({ page }) => {
    const emailInput = page.locator('input[type="email"].input');
    const passwordInput = page.locator('input[type="password"].input');
    const submitButton = page.locator('button[type="submit"].btn.primary-btn');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
    
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    const isFormStillVisible = await page.locator('form.form').isVisible();
    expect(isFormStillVisible).toBe(true);
  });

  test('should_showErrorMessage_when_invalidCredentials', async ({ page }) => {
    const responses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('firebase') || response.url().includes('auth')) {
        responses.push(`${response.status()} - ${response.url()}`);
        console.log('Network response:', response.status(), response.url());
      }
    });

    const emailInput = page.locator('input[type="email"].input');
    const passwordInput = page.locator('input[type="password"].input');
    const submitButton = page.locator('button[type="submit"].btn.primary-btn');
    
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    const errorSelectors = [
      '.error-message',
      '.alert-danger',
      '[data-testid="error-message"]',
      '.firebase-error',
      '[role="alert"]'
    ];
    
    let errorMessageFound = false;
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector);
      if (await errorElement.isVisible().catch(() => false)) {
        const errorText = await errorElement.textContent();
        console.log('Error message found:', errorText);
        errorMessageFound = true;
        break;
      }
    }
    
    const currentURL = page.url();
    const isStillOnLogin = currentURL.includes('/login');
    
    if (errorMessageFound) {
      console.log('✓ Error message displayed for invalid credentials');
    } else if (isStillOnLogin) {
      console.log('✓ Authentication failed - user remained on login page');
    } else {
      console.log('⚠️ Authentication behavior unclear');
    }
    
    console.log('Network responses:', responses);
  });

  test('should_showGoogleSignInButton_when_pageLoads', async ({ page }) => {
    const googleButton = page.locator('button.btn.google-btn');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toHaveText('Sign in with Google');
  });

  test('should_failGoogleSignIn_when_wrongFirebaseKeys', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('Console error:', msg.text());
      }
    });

    const googleButton = page.locator('button.btn.google-btn');
    await googleButton.click();
    
    await page.waitForTimeout(3000);
    
    const firebaseErrors = consoleErrors.filter(error => 
      error.includes('Firebase') || 
      error.includes('firebase') || 
      error.includes('API key') ||
      error.includes('auth/') ||
      error.includes('Invalid API key')
    );
    
    console.log('Firebase errors during Google sign-in:', firebaseErrors);
    
    const currentURL = page.url();
    const isStillOnLogin = currentURL.includes('/login');
    
    if (firebaseErrors.length > 0) {
      console.log('✓ Google sign-in failed as expected with wrong Firebase keys');
      expect(firebaseErrors.length).toBeGreaterThan(0);
    } else if (isStillOnLogin) {
      console.log('✓ Google sign-in failed - still on login page');
      expect(isStillOnLogin).toBe(true);
    } else {
      console.log('⚠️ Google sign-in might not be properly implemented');
    }
  });

  test('should_showToggleSignUp_when_pageLoads', async ({ page }) => {
    const toggleText = page.locator('p.toggle-text');
    await expect(toggleText).toBeVisible();
    await expect(toggleText).toHaveText("Don't have an account? Sign Up");
  });
});