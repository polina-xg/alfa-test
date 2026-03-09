import { expect } from '@playwright/test';
import ProducrPage from 'playwright/pages/ProductPage';
import MainPage from 'playwright/pages/MainPage';
import CartPage from 'playwright/pages/CartPage';
import UserBuilder from 'playwright/data/builders/UserBuilder';
import { test } from 'playwright/fixtures/TestFixture';
import { defaultCheckoutUser } from 'playwright/data/CheckoutUserData';

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

test('Order a single item without a discount', async ({ cleanCart }) => {
  await main.header.goHomePage();
  await main.header.checkNumberOfItemsInCart(0);
  const card = await main.card.findCard({
    sale: false,
    name: 'Red Duck',
  });
  const price = await main.card.getPriceForCard({ sale: false, name: 'Red Duck' });
  await card.click();
  await productPage.pageIsOpenForCard('Red Duck');
  await productPage.setQuantity(3);
  await productPage.addToCart();
  await main.header.checkNumberOfItemsInCart(3);
  await main.header.openCartPage();
  const rows = await cartPage.cartTable.getRowsData();
  await expect(rows[0]).toMatchObject({
    quantity: 3,
    product: 'Red Duck',
    SKU: 'RD003',
    unitCost: price,
    InclTax: 0,
    Total: 60,
  });
  await cartPage.fillCheckoutForm(defaultCheckoutUser());
  await cartPage.confirmOrder();
  await cartPage.messageOnSuccess();
});
