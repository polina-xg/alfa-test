import { Page, Locator, expect } from '@playwright/test';
import { CartRow } from 'playwright/types/CartRow';

export default class CartTable {
  private page: Page;
  private table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('.dataTable');
  }

  private parsePrice(text: string | null): number {
    if (!text) return 0;
    return Number(text.replace(/[^\d.]/g, ''));
  }

  private get productRows() {
    return this.table.locator('td.item').locator('..');
  }

  public async getRowsData(): Promise<CartRow[]> {
    await expect(this.productRows.first()).toBeVisible();

    const count = await this.productRows.count();
    const result: CartRow[] = [];

    for (let i = 0; i < count; i++) {
      const row = this.productRows.nth(i);

      result.push({
        quantity: Number((await row.locator('td').nth(0).textContent())?.trim()),
        product: (await row.locator('.item').textContent())?.trim() ?? '',
        SKU: (await row.locator('.sku').textContent())?.trim() ?? '',
        unitCost: this.parsePrice(await row.locator('.unit-cost').textContent()),
        InclTax: this.parsePrice(await row.locator('.tax').textContent()),
        Total: this.parsePrice(await row.locator('.sum').textContent()),
      });
    }

    return result;
  }
  public async validateTotals(): Promise<void> {
    const rows = await this.getRowsData();

    for (const row of rows) {
      expect(row.quantity * row.unitCost).toBe(row.Total);
    }
  }
}
