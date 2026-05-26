import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../page-objects/login/login-page-object';
import logger from '../../utils/winston-logger/logger-util';
import { ForgotPasswordPage } from '../../page-objects/forgot-password/forgot-password-page-object';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../page-objects/homepage/homepage-page-object';
// const { faker } = require('@faker-js/faker');


test('Forgot Password @smoke', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await test.step('Open application', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
        await homePage.openLoginOrRegistrationPage();
    });

    await test.step('Click Forgot password link and Reset password', async () => {
        await loginPage.clickForgotPasswordLink();
        await forgotPasswordPage.resetPassword(process.env.USERNAME!, process.env.EMAIL!);
    });

});
