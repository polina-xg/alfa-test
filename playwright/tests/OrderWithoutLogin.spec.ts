import ProducrPage from 'playwright/pages/ProductPage';
import MainPage from 'playwright/pages/MainPage';
import CartPage from 'playwright/pages/CartPage';
import { expect, test } from '@playwright/test';

let main: MainPage;
let productPage: ProducrPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  main = new MainPage(page);
  productPage = new ProducrPage(page);
  cartPage = new CartPage(page);

  await main.openApplication();
});
test('Order without login', async ({ page }) => {
  await main.header.checkNumberOfItemsInCart(0);
  let card = await main.card.findCard({
    name: 'Red Duck',
  });
  const price1 = await main.card.getPriceForCard({ sale: false, name: 'Red Duck' });
  await card.click();
  await productPage.setQuantity(1);
  await productPage.addToCart();
  await main.header.checkNumberOfItemsInCart(1);
  await page.goBack();
  await page.waitForLoadState();
  card = await main.card.findCard({
    name: 'Blue Duck',
  });
  const price2 = await main.card.getPriceForCard({ sale: false, name: 'Blue Duck' });
  await card.click();
  await productPage.setQuantity(1);
  await productPage.addToCart();
  await main.header.checkNumberOfItemsInCart(2);
  await main.header.openCartPage();
  await cartPage.checkIfUserDataValuesEmpty();
  const rows = await cartPage.cartTable.getRowsData();

  const redDuckRow = rows.find(r => r.product === 'Red Duck');

  await expect(redDuckRow).toMatchObject({
    quantity: 1,
    product: 'Red Duck',
    SKU: 'RD003',
    unitCost: price1,
    InclTax: 0,
    Total: 20,
  });
  const blueDuckRow = rows.find(r => r.product === 'Blue Duck');
  await expect(blueDuckRow).toMatchObject({
    quantity: 1,
    product: 'Blue Duck',
    SKU: 'RD004',
    unitCost: price2,
    InclTax: 0,
    Total: 20,
  });

  await main.header.goHomePage();

  await main.sidebar.checkViewedProducts(['red-duck', 'blue duck']);
});
