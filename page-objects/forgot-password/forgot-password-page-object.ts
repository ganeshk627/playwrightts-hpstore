import { type Locator, type Page, expect } from "@playwright/test";
import logger from "../../utils/winston-logger/logger-util";


export class ForgotPasswordPage {

    //variables
    private readonly loginName: Locator;
    private readonly forgotEmail: Locator;
    private readonly backBtn: Locator;
    private readonly continueBtn: Locator;

    //constructor
    constructor(private page: Page) {
        this.page = page;
        this.loginName = page.locator('#forgottenFrm_loginname');
        this.forgotEmail = page.locator('#forgottenFrm_email');
        this.backBtn = page.getByRole('link', { name: ' Back' });
        this.continueBtn = page.getByRole('button', { name: ' Continue' });

    };

    // methods
    async resetPassword(username: string, email: string) {
        await this.loginName.fill(username);
        await expect(this.loginName).toHaveValue(username);
        await this.forgotEmail.fill(email);
        await expect(this.forgotEmail).toHaveValue(email);
        await this.continueBtn.click();
        await expect(this.page.locator('#maincontainer')).toContainText('Success: Password reset link has been sent to your e-mail address.');
        await expect(this.page).toHaveURL(/.*account\/login/);
        logger.info('Reset Password link sent successfully');
    }



};
