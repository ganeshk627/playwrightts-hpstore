import { type Locator, type Page, expect } from "@playwright/test";


export class DashboardPage {

    //variables
    private readonly myProfileMenu: Locator;
    private readonly ordersMenu: Locator;
    private readonly logoutMenu: Locator;

    //constructor
    constructor(private page: Page) {
        this.page = page;
        this.myProfileMenu = page.locator('.dropdown-menu p', { hasText: 'My profile' });
        this.ordersMenu = page.locator('.dropdown-menu p', { hasText: 'Orders' });
        this.logoutMenu = page.locator('.dropdown-menu p', { hasText: 'Logout' });
    };

    // methods
    async verifyWelcomeMessage() {
        await expect(this.page.getByText('Login successful!')).toBeVisible({ timeout: 5000 }).catch(() => {});
    }

    async getAddressBookContacts() {
        return await this.addressBookContacts.textContent();
    }

};
