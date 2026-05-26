import { type Locator, type Page, expect } from "@playwright/test";


export class DashboardPage {

    //variables
    private readonly welcomeMessage: Locator;
    private readonly addressBookContacts: Locator;
    private readonly orderHistory: Locator;
    private readonly downloads: Locator;
    private readonly transactionHistory: Locator;

    //constructor
    constructor(private page: Page) {
        this.page = page;
        this.welcomeMessage = page.locator('#customer_menu_top');
        this.addressBookContacts = page.locator('.dash-tile-ocean .dash-tile-text');
        this.orderHistory = page.locator('.dash-tile-flower .dash-tile-text');
        this.downloads = page.locator('.dash-tile-oil .dash-tile-text');
        this.transactionHistory = page.locator('.dash-tile-balloon .dash-tile-text');
    };

    // methods
    async verifyWelcomeMessage() {
        await expect(this.welcomeMessage).toContainText('Welcome back', { timeout: 5000 });
    }

    async getAddressBookContacts() {
        return await this.addressBookContacts.textContent();
    }

};
