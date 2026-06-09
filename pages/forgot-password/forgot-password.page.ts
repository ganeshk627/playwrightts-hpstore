import { type Locator, type Page, expect } from "@playwright/test";
import logger from "../../utils/winston-logger/logger-util";


export class ForgotPasswordPage {

    //variables
    private readonly forgotEmail: Locator;
    private readonly resetBtn: Locator;

    //constructor
    constructor(private page: Page) {
        this.page = page;
        // In the Harry Potter app, forgot password is not fully implemented yet
        this.forgotEmail = page.locator('input[type="email"]');
        this.resetBtn = page.getByRole('button', { name: 'Reset Password' });
    };

    // methods
    async resetPassword(username: string, email: string) {
        logger.info('Forgot password flow is not implemented in the application yet.');
        await this.forgotEmail.fill(email);
        await this.resetBtn.click();
        logger.info('Reset Password simulated successfully');
    }



};
