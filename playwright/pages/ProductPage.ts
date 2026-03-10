import Header from 'playwright/components/header/Header';
import { Page, expect } from '@playwright/test';
import BasePage from 'playwright/base/BasePage';

export default class ProductPage extends BasePage {
  public header: Header;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
  }

  private readonly SELECTORS = {
    HEADER: 'h1.title',
  };

  public async pageIsOpenForCard(card: string): Promise<void> {
    await expect(await this.page.locator(this.SELECTORS.HEADER).textContent()).toBe(card);
  }

  public async setQuantity(quantity: number): Promise<void> {
    const input = this.page.locator('input[name="quantity"]');
    await input.fill(String(quantity));
  }

  public async addToCart() {
    const quantity = this.page.locator('#cart').locator('.quantity');
    const oldValue = await quantity.textContent();

    const button = this.page.locator('button', { hasText: 'Add To Cart' });

    await button.waitFor({ state: 'visible' });
    await button.waitFor({ state: 'attached' });
    await button.click();

    await this.page.waitForTimeout(500);
    await expect(quantity).not.toHaveText(oldValue!);
  }
}
