import { Page } from '@playwright/test';
import Sidebar from 'playwright/components/sidebar/SideBar';
import Header from 'playwright/components/header/Header';
import Card from 'playwright/components/cards/Card';
import BasePage from 'playwright/base/BasePage';

export default class MainPage extends BasePage {
  public sidebar: Sidebar;
  public header: Header;
  public card: Card;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.sidebar = new Sidebar(page);
    this.header = new Header(page);
    this.card = new Card(page);
  }

  public async openApplication(): Promise<void> {
    await this.sidebar.openLink();
  }
}
