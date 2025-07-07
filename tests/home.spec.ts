import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should_showCorrectContent', async ({ page }) => {
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    const mainContent = page.locator('main.home-wrapper');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
  });

  test('should_showHeaderNavigation_when_pageLoads', async ({ page }) => {
    const header = page.locator('header.header');
    await expect(header).toBeVisible({ timeout: 10000 });
    
    const logo = page.locator('header .logo');
    await expect(logo).toBeVisible({ timeout: 10000 });
    await expect(logo).toHaveText('JET App');
  });

  test('should_showSearchInput_when_pageLoads', async ({ page }) => {
    const searchInput = page.locator('input.search-input');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await expect(searchInput).toHaveAttribute('placeholder', 'Search by address or cuisine...');
  });

  test('should_showFilterDropdown_when_pageLoads', async ({ page }) => {
    const filterSelect = page.locator('select.filter-select');
    await expect(filterSelect).toBeVisible({ timeout: 10000 });
  });

  test('should_acceptInput_when_typingInSearchBox', async ({ page }) => {
    const searchInput = page.locator('input.search-input');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('pizza');
    await expect(searchInput).toHaveValue('pizza');
  });

  test('should_showSignInButton_when_userNotLoggedIn', async ({ page }) => {
    const signInButton = page.locator('button.signin-btn');
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    await expect(signInButton).toHaveText('Sign In');
  });
});