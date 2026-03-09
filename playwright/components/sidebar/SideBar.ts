import { Page, Locator } from '@playwright/test';
import LoginForm from './Login';
import RecentlyViewed from './RecentlyViewed';
import { User } from 'playwright/types/User';

export default class Sidebar {
  private page: Page;
  private root: Locator;
  public recentlyViewed: RecentlyViewed;
  public loginForm: LoginForm;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('#navigation');
    this.recentlyViewed = new RecentlyViewed(page);
    this.loginForm = new LoginForm(page, this.root);
  }

  async login(user: User): Promise<void> {
    await this.loginForm.login(user);
  }

  async openLink(): Promise<void> {
    await this.loginForm.openApplication();
  }

  async checkViewedProducts(products: string[]) {
    await this.recentlyViewed.expectProducts(products);
  }
}
