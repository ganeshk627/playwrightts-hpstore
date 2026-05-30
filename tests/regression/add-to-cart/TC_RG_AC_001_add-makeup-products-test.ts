import {test, expect, type Page} from '@playwright/test';
import { HomePage } from "../../../pages/homepage/homepage-page-object";
import { LoginPage } from "../../../pages/login/login-page-object";
import logger from '../../../utils/winston-logger/logger-util';

test('Add Makeup Products @smoke', async({page})=>{
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Login as Ganesh', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        logger.info('Entered username and password');
        await expect(await page.locator('#customer_menu_top')).toContainText('Welcome back');

    });

    await test.step('Navigating to Makeup products page',async () => {
        await page.locator('#categorymenu').getByRole('link', { name: 'Makeup' }).click();
        await page.locator('#maincontainer li').filter({ hasText: 'Face' }).click();  
    });

    await test.step('Adding one makeup product to card and removing it',async () => {
        await page.getByRole('link', { name: 'Delicate Oil-Free Powder Blush' }).click();
        await page.getByRole('link', { name: ' Add to Cart' }).click();
        await page.locator('//a[contains(@href, "remove")]').click();
        await page.getByRole('link', { name: ' Continue' }).click();
    })

})