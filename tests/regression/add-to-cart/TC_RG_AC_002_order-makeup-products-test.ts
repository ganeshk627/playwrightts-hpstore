import {test, expect, type Page} from '@playwright/test';
import { HomePage } from "../../../pages/homepage/homepage-page-object";
import { LoginPage } from "../../../pages/login/login-page-object";
import logger from '../../../utils/winston-logger/logger-util';
import { DashboardPage } from '../../../pages/dashboard/dashboard-page-object';
import { ProductNavigationPage } from '../../../pages/products/product-navigation-page-object';
import { ProductBasketPage } from '../../../pages/products/product-basket-page-object';

const productCategory = 'Makeup';
const productType = 'Face';
const productName = 'Delicate Oil-Free Powder Blush';

test('Checkout Makeup Products @regression', async({page})=>{
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const productNavigationPage = new ProductNavigationPage(page);
    const productBasketPage = new ProductBasketPage(page);

    await test.step('Login as Default Login', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        logger.info('Entered username and password');
        dashboardPage.verifyWelcomeMessage();
    });

    await test.step('Navigating to Makeup products page', async () => {
        // await productNavigationPage.switchToProduct('Makeup');
        await productNavigationPage.switchToProduct(productCategory, productType)
        await productNavigationPage.toggleProductView('grid');
    });

    await test.step(`Adding ${productName} to cart`, async () => {
        await productNavigationPage.addProductToCart(productName);
    });

    await test.step(`Checkout and buy makeup products`, async()=>{
        const checkoutConfirmationPage = await productBasketPage.clickCheckoutProduct1();
        const checkoutSuccessPage = await checkoutConfirmationPage.clickConfirmOrderButton(); 
        await checkoutSuccessPage.validateOrderSuccessMessage();
        await checkoutSuccessPage.clickContinueButton();
    })

})