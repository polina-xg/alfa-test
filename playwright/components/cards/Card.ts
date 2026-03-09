import { Page, expect } from '@playwright/test';
import CardItem from './CardItem';

export default class Card {
  private readonly page: Page;

  private readonly SELECTORS = {
    CARD_ITEM: '.product',
    SALE: '.sale',
  };

  constructor(page: Page) {
    this.page = page;
  }

  // get all item cards
  public async getAllCards(): Promise<CardItem[]> {
    const locator = this.page.locator(this.SELECTORS.CARD_ITEM);
    await expect(locator.first()).toBeVisible({ timeout: 3000 });

    const count = await locator.count();
    return Array.from(
      { length: count },
      (_, i) => new CardItem(this.page, locator.nth(i)),
    );
  }

  // filter cards by sale
  private async filterBySale(
    cards: CardItem[],
    shouldHaveSale: boolean,
  ): Promise<CardItem[]> {
    const results = await Promise.all(
      cards.map(async card => ((await card.hasSale()) === shouldHaveSale ? card : null)),
    );
    return results.filter(Boolean) as CardItem[];
  }

  // filter cards by name
  private async filterByName(cards: CardItem[], name: string): Promise<CardItem[]> {
    const trimmedName = name.trim();
    const results = await Promise.all(
      cards.map(async card =>
        (await card.getCardName())?.trim() === trimmedName ? card : null,
      ),
    );
    return results.filter(Boolean) as CardItem[];
  }

  private getByIndex(cards: CardItem[], index: number): CardItem {
    if (index < 1 || index > cards.length) {
      throw new Error(`Index ${index} is out of range`);
    }
    return cards[index - 1];
  }

  // get card array according to the filters
  public async findCardsArray(options?: {
    sale?: boolean;
    name?: string;
  }): Promise<CardItem[]> {
    let cards = await this.getAllCards();
    if (options?.sale !== undefined) cards = await this.filterBySale(cards, options.sale);
    if (options?.name) cards = await this.filterByName(cards, options.name);
    return cards;
  }

  // get single card by filters
  public async findCard(
    options: { sale?: boolean; name?: string; index?: number } = {},
  ): Promise<CardItem> {
    let cards = await this.findCardsArray({ sale: options.sale });
    if (options.name) cards = await this.filterByName(cards, options.name);
    if (options.index !== undefined) return this.getByIndex(cards, options.index);
    return cards[0];
  }

  public async getPriceForCard(options?: {
    sale?: boolean;
    name?: string;
    index?: number;
  }): Promise<number> {
    const card = await this.findCard(options);
    return card.getPrice();
  }
}
