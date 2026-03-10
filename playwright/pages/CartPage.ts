import Header from 'playwright/components/header/Header';
import SideBar from 'playwright/components/sidebar/SideBar';
import { Page, expect } from '@playwright/test';
import BasePage from 'playwright/base/BasePage';
import { CheckoutUser } from 'playwright/types/CheckOutTypes';
import CartTable from 'playwright/components/cart/СartTable';

export default class CartPage extends BasePage {
  public header: Header;
  public sidebar: SideBar;
  public cartTable: CartTable;

  private readonly SELECTORS = {
    DROPDOWN_ARROW: '.select2-selection__arrow',
    CART_WRAPPER: '.checkout-cart-wrapper',
    SUCESS_MESSAGE: '#box-order-success',
    CART_LINK: '.content',
    CART: '#cart',
  };

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.sidebar = new SideBar(page);
    this.cartTable = new CartTable(page);
  }

  public async openCart() {
    await this.page
      .locator(this.SELECTORS.CART)
      .locator(this.SELECTORS.CART_LINK)
      .click();
  }

  public async clearCart(): Promise<void> {
    const removeButtons = this.page.locator('button[name="remove_cart_item"]');

    while ((await removeButtons.count()) > 0) {
      const countBefore = await removeButtons.count();

      await removeButtons.first().click();

      await expect(removeButtons).toHaveCount(countBefore - 1);
    }
  }

  public async goBack(): Promise<void> {
    await this.page.locator('a', { hasText: 'Back' }).click();
  }

  public async fillCheckoutForm(user: CheckoutUser): Promise<void> {
    await this.page.locator('[name="tax_id"]').fill(user.taxId ?? '');
    await this.page.locator('[name="company"]').fill(user.company ?? '');
    await this.page.locator('[name="firstname"]').fill(user.firstName);
    await this.page.locator('[name="lastname"]').fill(user.lastName);
    await this.page.locator('[name="address1"]').fill(user.address1);
    await this.page.locator('[name="address2"]').fill(user.address2 ?? '');
    await this.page.locator('[name="postcode"]').fill(user.postCode);
    await this.page.locator('[name="city"]').fill(user.city);
    await this.page.locator(this.SELECTORS.DROPDOWN_ARROW).first().click();
    await this.page.getByRole('treeitem', { name: user.country }).click();
    await expect(this.page.locator('[type="email"]')).toHaveValue(user.email);
    await this.page.locator('[name="phone"]').fill(user.phone);
  }

  public async checkIfUserDataValuesEmpty(): Promise<void> {
    const emptyInputs = [
      '[name="tax_id"]',
      '[name="company"]',
      '[name="firstname"]',
      '[name="lastname"]',
      '[name="address1"]',
      '[name="address2"]',
      '[name="postcode"]',
      '[name="city"]',
      '[name="email"]',
    ];

    for (const selector of emptyInputs) {
      await expect(this.page.locator(selector)).toHaveValue('');
    }
  }

  public async confirmOrder(): Promise<void> {
    await this.page.evaluate(() => {
      const form = document.querySelector(
        'form[name="order_form"]',
      ) as HTMLFormElement | null;
      if (form) form.submit();
    });
    await expect(this.page.locator('h1.title')).toHaveText(/successfully completed/i, {
      timeout: 5000,
    });
  }

  public async messageOnSuccess(): Promise<void> {
    await this.page.waitForSelector(this.SELECTORS.SUCESS_MESSAGE);
    const successMessage = this.page.locator(this.SELECTORS.SUCESS_MESSAGE);
    await expect(successMessage).toContainText('Your order is successfully completed!');
  }

  private get sizeDropdown() {
    return this.page.locator('select[name="options[Size]"]');
  }

  public async selectSize(size: string) {
    await this.sizeDropdown.selectOption({ value: size });
  }
}
