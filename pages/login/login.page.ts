import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';
import { DashboardPage } from "../dashboard/dashboard.page";
import { HomePage } from "../homepage/homepage.page";



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
        this.forgotPasswordLink = page.getByText('Forgot your password?');
        this.createAccountLink = page.getByText('Create an account');
    };

    async openLoginOrRegistrationPage() {
       await new HomePage(this.page).openLoginOrRegistrationPage();
    }

    async login(username: string, password: string) {
        logger.info(`Attempting login with username: ${username}`);
        await expect(this.page).toHaveURL(/.*\/login/);
        logger.info('Login page loaded, entering credentials');
        
        await this.emailInput.fill(username);
        logger.info('Email entered');
        
        await this.passwordInput.fill(password);
        logger.info('Password entered');
        
        await expect(this.passwordInput).toHaveValue(password);
        await this.signInBtn.click();
        logger.info('Sign In button clicked, waiting for redirect');
        
        // Wait for redirect after login
        await expect(this.page).not.toHaveURL(/.*\/login/);
        logger.info('Successfully logged in and redirected to dashboard');
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
