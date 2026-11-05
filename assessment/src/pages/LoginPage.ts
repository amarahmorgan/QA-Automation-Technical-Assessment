
import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Swag Labs Login page.
 */
export class LoginPage {

  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly pageTitle: Locator;

  /**
   * Constructs a new LoginPage instance.
   * @param page The Playwright Page instance.
   */
  public constructor(page: Page) {

    this.page = page;

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /**
   * Navigates to the Swag Labs login page.
   */
  public async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Logs into Swag Labs using the supplied credentials.
   * @param username The username.
   * @param password The password.
   */
  public async login(username: string, password: string): Promise<void> {

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Returns the login error message locator.
   * @returns The error message locator.
   */
  public getErrorMessage(): Locator {
    return this.errorMessage;
  }

  /**
   * Retrieves the login button.
   * @returns The login button locator.
   */
  public getLoginButton(): Locator {
    return this.loginButton;
  }

  /**
   * Returns the products page title locator.
   * @returns The page title locator.
   */
  public getPageTitle(): Locator {
    return this.pageTitle;
  }
}