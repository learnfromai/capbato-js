import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly goBackButton: Locator;
  readonly messageElement: Locator;
  readonly navbarBrand: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.goBackButton = page.locator('#goBackBtn');
    this.messageElement = page.locator('#message');
    this.navbarBrand = page.locator('.navbar-brand');
    this.loginForm = page.locator('#loginForm');
  }

  async navigate() {
    await this.page.goto('/client/pages/login.html');
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickGoBack() {
    await this.goBackButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return await this.messageElement.textContent();
  }

  async isErrorMessageVisible() {
    return await this.messageElement.isVisible();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }
}