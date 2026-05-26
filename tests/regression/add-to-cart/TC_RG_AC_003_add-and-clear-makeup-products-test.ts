import { test, expect, type Page } from '@playwright/test';
import { HomePage } from "../../../page-objects/homepage/homepage-page-object";
import { LoginPage } from "../../../page-objects/login/login-page-object";
import logger from '../../../utils/winston-logger/logger-util';
import { DashboardPage } from '../../../page-objects/dashboard/dashboard-page-object';
import { ProductNavigationPage } from '../../../page-objects/products/product-navigation-page-object';
import { readJsonData } from '../../../utils/json-util/json-util'

// const productCategory = 'Makeup';
// const productType = 'Face';
// const productName = 'Delicate Oil-Free Powder Blush';

const TEST_DATA = 'test-data/json/products/makeup-products.json';
const rows = readJsonData(TEST_DATA)


for (let index in rows) {

    const productCategory = rows[index].productCategory;
    const productType = rows[index].productType;
    const productNames = rows[index].productNames;
        
    test.only(`Add Multiple Makeup Products @regression ${Number(index) + 1}'`, async ({ page }) => {
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

        for(let index in productNames) {
            const productName = productNames[index];
            await test.step('Navigating to Makeup products page', async () => {
                await productNavigationPage.switchToProduct(productCategory, productType)
                await productNavigationPage.toggleProductView('grid');
            });

            await test.step(`Adding '${productName}' to cart and removing`, async () => {
                await productNavigationPage.addProductToCart(productName);
                await page.locator('//a[contains(@href, "remove")]').click();
                await page.getByRole('link', { name: 'Continue' }).click();
            });
        }

    });
};

