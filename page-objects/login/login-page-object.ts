import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';
import { DashboardPage } from "../dashboard/dashboard-page-object";



export class LoginPage {

    //variables
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInBtn: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly createAccountLink: Locator;


    //constructor
    constructor(private page: Page) {
        this.page = page;
        // Input fields - using type selectors since they don't have IDs
        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
        this.signInBtn = page.getByRole('button', { name: 'Sign In' });
        // Links on login page
        this.forgotPasswordLink = page.getByText('Forget your password');
        this.createAccountLink = page.getByText('Create an account');
    };

    // methods
    async login(username: string, password: string) {
        await expect(this.page).toHaveURL(/.*\/login/);
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).toHaveValue(password);
        await this.signInBtn.click();
        // Wait for redirect after login
        await expect(this.page).not.toHaveURL(/.*\/login/);
        logger.info('Successfully logged in');
        return new DashboardPage(this.page);
    };

    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
        logger.info('Navigated to password reset page');
    }

    async clickCreateAccountLink() {
        await this.createAccountLink.click();
        logger.info('Navigated to create account page');
    }

    



};
