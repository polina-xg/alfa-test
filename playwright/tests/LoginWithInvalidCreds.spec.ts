import { test } from '@playwright/test';
import MainPage from 'playwright/pages/MainPage';
import UserBuilder from 'playwright/data/builders/UserBuilder';

let main: MainPage;

test.beforeEach(async ({ page }) => {
  main = new MainPage(page);
  const wrongUser = new UserBuilder().fromEnv().withPassword('wrongpass').build();

  await main.sidebar.openLink();
  await main.sidebar.login(wrongUser);
});

test('Login with incorrect user creds', async () => {
  await main.sidebar.loginForm.checkNoticeError();
});
