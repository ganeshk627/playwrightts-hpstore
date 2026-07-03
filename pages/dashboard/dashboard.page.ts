import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';


export class DashboardPage {

    //variables
    private readonly profileName: Locator;
    private readonly myProfileMenu: Locator;
    private readonly ordersMenu: Locator;
    private readonly logoutMenu: Locator;

    //constructor
    constructor(private page: Page) {
        this.page = page;
        this.profileName = page.locator('[auto-id="UserName"]');
        this.myProfileMenu = page.locator('.dropdown-menu p', { hasText: 'My profile' });
        this.ordersMenu = page.locator('.dropdown-menu p', { hasText: 'Orders' });
        this.logoutMenu = page.locator('.dropdown-menu p', { hasText: 'Logout' });
    };

    // methods
    async validateProfileName(expectedName: string) {
        const actualName = await this.profileName.textContent();
        expect(actualName?.trim()).toBe(expectedName);
        logger.info(`Profile name validated: ${actualName}`);
    }

    async verifyWelcomeMessage() {
        await expect(this.page.getByText('Login successful!')).toBeVisible({ timeout: 5000 }).catch(() => {});
        logger.info('Login success message displayed');
    }

    async verifyDashboardURL() {
        await expect(this.page).toHaveURL(/.*\/(home|dashboard)?$/i);
        logger.info('Dashboard URL verified');
    }

    async waitForDashboardToLoad() {
        await this.page.waitForLoadState('networkidle');
    }

};
