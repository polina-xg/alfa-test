import { expect } from '@playwright/test';
import ProducrPage from 'playwright/pages/ProductPage';
import MainPage from 'playwright/pages/MainPage';
import CartPage from 'playwright/pages/CartPage';
import { defaultCheckoutUser } from 'playwright/data/CheckoutUserData';
import UserBuilder from 'playwright/data/builders/UserBuilder';
import { test } from 'playwright/fixtures/TestFixture';

let main: MainPage;
let productPage: ProducrPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  main = new MainPage(page);
  productPage = new ProducrPage(page);
  cartPage = new CartPage(page);
  const user = new UserBuilder().fromEnv().build();

  await main.sidebar.openLink();
  await main.sidebar.login(user);
});

test('Order a single item with a discount', async ({ cleanCart }) => {
  await main.header.goHomePage();
  await main.header.checkNumberOfItemsInCart(0);
  const card = await main.card.findCard({
    sale: true,
    index: 1,
  });
  const price = await main.card.getPriceForCard({ sale: true, index: 1 });
  await card.click();
  await productPage.pageIsOpenForCard('Yellow Duck');
  await cartPage.selectSize('Small');
  await productPage.setQuantity(2);
  await productPage.addToCart();
  await main.header.checkNumberOfItemsInCart(2);
  await main.header.openCartPage();
  const rows = await cartPage.cartTable.getRowsData();

  await expect(rows[0]).toMatchObject({
    quantity: 2,
    product: 'Yellow Duck',
    SKU: 'RD001-S',
    unitCost: price,
    InclTax: 0,
    Total: 36,
  });
  await cartPage.fillCheckoutForm(defaultCheckoutUser());
  await cartPage.confirmOrder();
  await cartPage.messageOnSuccess();
});
