import { Page, expect, Locator } from '@playwright/test';
import rawEnv from '@env/env.json';
import { Env } from 'playwright/types/EnvTypes';
import { User } from 'playwright/types/User';

const env = rawEnv as Env;

export default class LoginForm {
  private page: Page;
  private root: Locator;

  private readonly SELECTORS = {
    INPUT_EMAIL: 'input[type="text"]',
    INPUT_PASSWORD: 'input[type="password"]',
    SUCCESS_BAR: '.notice.errors',
    ERROR: '.notice',
  };

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }
  private async typeEmail(email: string): Promise<void> {
    const input = this.page.locator(this.SELECTORS.INPUT_EMAIL);
    await input.fill(email);
  }

  private async typePassword(password: string): Promise<void> {
    const LOCATOR = this.page
      .locator('#navigation')
      .locator(this.SELECTORS.INPUT_PASSWORD);
    await LOCATOR.waitFor();
    await LOCATOR.clear();
    await LOCATOR.fill(password);
  }
  private async clickLoginButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  public async getUser(userEmail: string = env.currentUser) {
    const user = env.users[userEmail];
    return { email: userEmail, ...user };
  }

  public async openApplication(): Promise<void> {
    await this.page.goto(env.url);
  }

  public async login(user: User) {
    await this.openApplication();

    await this.typeEmail(user.email);
    await this.typePassword(user.password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('networkidle');
  }

  public async checkValidLogin(userEmail: string = env.currentUser): Promise<void> {
    const user = env.users[userEmail];
    await expect(this.page.locator(this.SELECTORS.SUCCESS_BAR)).toHaveText(
      new RegExp(
        `^\\s*You are now logged in as ${user.name} ${user.surname}\\.\\s*$`,
        'i',
      ),
    );
  }

  public async checkNoticeError() {
    await expect(this.page.locator(this.SELECTORS.ERROR)).toBeVisible();
    await expect(this.page.locator(this.SELECTORS.ERROR)).toContainText(
      'Wrong password or the account is disabled, or does not exist',
    );
    await expect(this.page.locator(this.SELECTORS.ERROR)).toHaveCSS(
      'background-color',
      'rgb(255, 204, 204)',
    );
  }
}
