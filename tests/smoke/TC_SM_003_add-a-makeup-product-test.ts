import {test, expect, type Page} from '@playwright/test';
import { HomePage } from "../../pages/homepage/homepage-page-object";
import { LoginPage } from "../../pages/login/login-page-object";
import logger from '../../utils/winston-logger/logger-util';
import { DashboardPage } from '../../pages/dashboard/dashboard-page-object';
import { ProductNavigationPage } from '../../pages/products/product-navigation-page-object';

const productCategory = 'Men';
const productType = 'Topwear';
const productName = 'Gryffindor Quidditch Jersey';

test('Add Product Test @smoke', async({page})=>{
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const productNavigationPage = new ProductNavigationPage(page);

    await test.step('Login as Default Login', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        logger.info('Entered username and password');
        dashboardPage.verifyWelcomeMessage();
    });

    await test.step('Navigating to Men Topwear products page',async () => {
        await productNavigationPage.switchToProduct(productCategory, productType);
    });

    await test.step(`Adding ${productName} to cart`,async () => {
        await productNavigationPage.addProductToCart(productName);
    });

})