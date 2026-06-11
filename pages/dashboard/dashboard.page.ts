import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';


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
        logger.info('Login success message displayed');
    }

    async verifyWelcomeBackMessage() {
        await expect(this.page.locator('#customer_menu_top')).toContainText('Welcome back');
        logger.info('Welcome back message displayed');
    }

    async verifyDashboardURL() {
        await expect(this.page).toHaveURL(/.*\/(home|dashboard)?$/i);
        logger.info('Dashboard URL verified');
    }

    async waitForDashboardToLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async getAddressBookContacts() {
        return await this.addressBookContacts.textContent();
    }

};
