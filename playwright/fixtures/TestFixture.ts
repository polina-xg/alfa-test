import { test as base } from '@playwright/test';
import CartPage from '../pages/CartPage';

type Fixtures = {
  cleanCart: void;
};

export const test = base.extend<Fixtures>({
  cleanCart: async ({ page }, use) => {
    const cart = new CartPage(page);

    await cart.openCart();
    await cart.clearCart();
    await use();
  },
});
