import { test, expect } from '../../../pages/fixture/fixture';
import logger from '../../../utils/winston-logger/logger-util';
import { readJsonData } from '../../../utils/json-util/json-util'

const TEST_DATA = 'test-data/json/products/makeup-products.json';
const rows = readJsonData(TEST_DATA)


for (let index in rows) {

    const productCategory = rows[index].productCategory;
    const productType = rows[index].productType;
    const productNames = rows[index].productNames;
        
    test(`Add and Remove Makeup Products @regression ${Number(index) + 1}`, async ({ page, homePage, loginPage, dashboardPage, productNavigationPage, productBasketPage }) => {

        await test.step('Login as Default Login', async () => {
            await page.goto('/');
            logger.info(`Navigated to ${await page.url()}`);
            await homePage.openLoginOrRegistrationPage();
            await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
            logger.info('Entered username and password');
            dashboardPage.verifyWelcomeMessage();
            await page.waitForLoadState('networkidle');
        });

        for(let productIndex in productNames) {
            const productName = productNames[productIndex];
            
            await test.step(`Navigate to ${productType} products`, async () => {
                await productNavigationPage.switchToProduct(productCategory, productType);
                await page.waitForLoadState('networkidle');
                logger.info(`Navigated to ${productCategory} > ${productType}`);
            });

            await test.step(`Add '${productName}' to cart`, async () => {
                await productNavigationPage.addProductToCart(productName);
                logger.info(`Added '${productName}' to cart`);
            });

            await test.step(`Remove '${productName}' from cart`, async () => {
                await productBasketPage.removeProductFromCart(productName);
                logger.info(`Removed '${productName}' from cart`);
                await productBasketPage.clickContinue();
                logger.info('Clicked Continue button');
            });
        }

    });
};

