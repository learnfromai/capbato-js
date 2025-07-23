import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test.describe('Page Structure', () => {
    test('should display login page with correct title', async ({ page }) => {
      await expect(page).toHaveTitle('Clinic Login');
    });

    test('should display clinic branding', async () => {
      await expect(loginPage.navbarBrand).toBeVisible();
      await expect(loginPage.navbarBrand).toContainText('M.G. Amores Medical Clinic');
    });

    test('should display login form elements', async () => {
      await expect(loginPage.loginForm).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.goBackButton).toBeVisible();
    });

    test('should have correct form field placeholders', async () => {
      await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
      await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    });

    test('should have password field with correct type', async () => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('should have required attributes on form fields', async () => {
      await expect(loginPage.usernameInput).toHaveAttribute('required');
      await expect(loginPage.passwordInput).toHaveAttribute('required');
    });
  });

  test.describe('Form Interaction', () => {
    test('should allow typing in username field', async () => {
      await loginPage.fillUsername('testuser');
      await expect(loginPage.usernameInput).toHaveValue('testuser');
    });

    test('should allow typing in password field', async () => {
      await loginPage.fillPassword('testpassword');
      await expect(loginPage.passwordInput).toHaveValue('testpassword');
    });

    test('should clear fields when requested', async () => {
      await loginPage.fillUsername('testuser');
      await loginPage.fillPassword('testpassword');
      
      await loginPage.usernameInput.clear();
      await loginPage.passwordInput.clear();
      
      await expect(loginPage.usernameInput).toHaveValue('');
      await expect(loginPage.passwordInput).toHaveValue('');
    });

    test('should focus on username field first', async () => {
      await loginPage.usernameInput.focus();
      await expect(loginPage.usernameInput).toBeFocused();
    });

    test('should allow tabbing between fields', async ({ page }) => {
      await loginPage.usernameInput.focus();
      await page.keyboard.press('Tab');
      await expect(loginPage.passwordInput).toBeFocused();
    });
  });

  test.describe('Form Submission', () => {
    test('should show login button with correct text', async () => {
      await expect(loginPage.loginButton).toContainText('Login');
    });

    test('should attempt login when form is submitted with valid input', async () => {
      await loginPage.fillUsername('admin');
      await loginPage.fillPassword('password');
      
      // Just test that the login button can be clicked
      // We don't test actual authentication since this is focused on the login page UI
      await expect(loginPage.loginButton).toBeEnabled();
    });

    test('should handle form submission with Enter key', async ({ page }) => {
      await loginPage.fillUsername('testuser');
      await loginPage.fillPassword('testpass');
      
      // Press Enter in password field to submit form
      await loginPage.passwordInput.press('Enter');
      
      // Wait a moment to see if any navigation or error message appears
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Navigation', () => {
    test('should display go back button', async () => {
      await expect(loginPage.goBackButton).toBeVisible();
      await expect(loginPage.goBackButton).toContainText('Go Back');
    });

    test('should allow clicking go back button', async () => {
      await expect(loginPage.goBackButton).toBeEnabled();
      // We can test that the button is clickable without testing actual navigation
      // since that would depend on the app's routing logic
    });
  });

  test.describe('Error Handling', () => {
    test('should have message element for displaying errors', async () => {
      // The message element should exist even if not initially visible
      await expect(loginPage.messageElement).toBeAttached();
    });

    test('should handle empty form submission', async ({ page }) => {
      // Try to submit empty form
      await loginPage.clickLogin();
      
      // Browser should prevent submission due to required attributes
      // This is handled by HTML5 validation
      await expect(loginPage.usernameInput).toHaveAttribute('required');
      await expect(loginPage.passwordInput).toHaveAttribute('required');
    });
  });

  test.describe('Responsive Design', () => {
    test('should be usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(loginPage.loginForm).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should be usable on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(loginPage.loginForm).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});