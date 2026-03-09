import { Page, expect } from '@playwright/test';

export default class RecentlyViewed {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getViewedProducts(): Promise<string[]> {
    const links = this.page.locator('.list-horizontal a');
    const hrefs = await links.evaluateAll(el =>
      el.map(a => a.getAttribute('href') ?? ''),
    );

    return hrefs;
  }

  private toSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  async expectProducts(products: string[]) {
    const links = this.page.locator('.list-horizontal a');
    const hrefs = await links.evaluateAll(el =>
      el.map(a => a.getAttribute('href') ?? ''),
    );

    for (const product of products) {
      const slug = this.toSlug(product);
      const found = hrefs.some(href => href.includes(slug));
      expect(found).toBeTruthy();
    }
  }
}
