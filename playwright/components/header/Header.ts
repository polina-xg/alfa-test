import { Page, expect } from '@playwright/test';

export default class Header {
  private page: Page;

  private readonly SELECTORS = {
    CART: '#cart',
    ITEMS_IN_CART: '.quantity',
    CART_LINK: '.content',
    MENU: '#site-menu',
    HOME_ICON: '.general-0',
  };

  constructor(page: Page) {
    this.page = page;
  }

  public async checkNumberOfItemsInCart(number: number): Promise<void> {
    const itemNumber = await this.page
      .locator(this.SELECTORS.CART)
      .locator(this.SELECTORS.ITEMS_IN_CART)
      .textContent();
    await expect(Number(itemNumber)).toBe(number);
  }

  public async openCartPage(): Promise<void> {
    await this.page
      .locator(this.SELECTORS.CART)
      .locator(this.SELECTORS.CART_LINK)
      .click();
  }

  public async goHomePage(): Promise<void> {
    await this.page
      .locator(this.SELECTORS.MENU)
      .locator(`${this.SELECTORS.HOME_ICON} a`)
      .click();
  }
}
