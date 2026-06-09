import { test, expect } from '../../../pages/fixture/fixture';
import logger from '../../../utils/winston-logger/logger-util';

const productCategory = 'Makeup';
const productType = 'Face';
const productName = 'Delicate Oil-Free Powder Blush';

test('Checkout Makeup Products @regression', async({ page, homePage, loginPage, dashboardPage, productNavigationPage, productBasketPage })=>{

    await test.step('Login as Default Login', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        logger.info('Entered username and password');
        dashboardPage.verifyWelcomeMessage();
        await page.waitForLoadState('networkidle');
    });

    await test.step('Navigating to Makeup products page', async () => {
        await productNavigationPage.switchToProduct(productCategory, productType);
        await page.waitForLoadState('networkidle');
        logger.info(`Navigated to ${productCategory} > ${productType}`);
    });

    await test.step(`Adding ${productName} to cart`, async () => {
        await productNavigationPage.addProductToCart(productName);
        logger.info(`Added '${productName}' to cart`);
    });

    await test.step(`Checkout and buy makeup products`, async()=>{
        const checkoutConfirmationPage = await productBasketPage.clickCheckoutProduct1();
        const checkoutSuccessPage = await checkoutConfirmationPage.clickConfirmOrderButton();
        await checkoutSuccessPage.validateOrderSuccessMessage();
        await checkoutSuccessPage.clickContinueButton();
        logger.info('Order completed successfully');
    })

})