import { test, expect, type Page } from '@playwright/test';
import { HomePage } from "../../../pages/homepage/homepage-page-object";
import { LoginPage } from "../../../pages/login/login-page-object";
import logger from '../../../utils/winston-logger/logger-util';
import { DashboardPage } from '../../../pages/dashboard/dashboard-page-object';
import { ProductNavigationPage } from '../../../pages/products/product-navigation-page-object';
import { ProductBasketPage } from '../../../pages/products/product-basket-page-object';
import { readJsonData } from '../../../utils/json-util/json-util'

const TEST_DATA = 'test-data/json/products/makeup-products.json';
const rows = readJsonData(TEST_DATA)


for (let index in rows) {

    const productCategory = rows[index].productCategory;
    const productType = rows[index].productType;
    const productNames = rows[index].productNames;
        
    test(`Add and Remove Makeup Products @regression ${Number(index) + 1}`, async ({ page }) => {
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

        for(let index in productNames) {
            const productName = productNames[index];
            
            await test.step(`Navigate to ${productType} products`, async () => {
                await productNavigationPage.switchToProduct(productCategory, productType)
                await productNavigationPage.toggleProductView('grid');
            });

            await test.step(`Add '${productName}' to cart`, async () => {
                await productNavigationPage.addProductToCart(productName);
            });

            await test.step(`Remove '${productName}' from cart`, async () => {
                await productBasketPage.removeProductFromCart(productName);
                await productBasketPage.clickContinue();
            });
        }

    });
};

