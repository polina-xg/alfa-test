import { Page } from '@playwright/test';
import { Locator } from '@playwright/test';

export default class CardItem {
  private page: Page;
  element: Locator;

  private readonly SELECTORS = {
    ITEM_NAME: '.name',
    SALE: '.sale',
    PRICE: '.price',
  };

  constructor(page: Page, element: Locator) {
    this.element = element;
    this.page = page;
  }

  async getCardName(): Promise<string | null> {
    return await this.element.locator(this.SELECTORS.ITEM_NAME).textContent();
  }

  public async click(): Promise<void> {
    await this.element.click();
  }

  public async hasSale(): Promise<boolean> {
    return (await this.element.locator(this.SELECTORS.SALE).count()) > 0;
  }

  public async getPrice(): Promise<number> {
    const salePrice = this.element.locator('.campaign-price');

    if (await salePrice.count()) {
      await this.page.waitForSelector('.campaign-price');
      const text = await salePrice.innerText();
      return Number(text.replace(/[^\d.]/g, ''));
    }
    await this.page.waitForSelector(this.SELECTORS.PRICE);
    const regularPrice = await this.element.locator(this.SELECTORS.PRICE).innerText();

    return Number(regularPrice.replace(/[^\d.]/g, ''));
  }
}
