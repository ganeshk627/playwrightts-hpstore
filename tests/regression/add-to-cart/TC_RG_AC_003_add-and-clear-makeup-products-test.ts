import { test } from '../../../pages/fixture/fixture';
import { readJsonData } from '../../../utils/json-util/json-util'

const TEST_DATA = 'test-data/json/products/makeup-products.json';
const rows = readJsonData(TEST_DATA)


for (let index in rows) {

    const productCategory = rows[index].productCategory;
    const productType = rows[index].productType;
    const productNames = rows[index].productNames;
        
    test(`Add and Remove Makeup Products @regression ${Number(index) + 1}`, async ({ homePage, loginPage, dashboardPage, productNavigationPage, productBasketPage }) => {

        await test.step('Login as Default Login', async () => {
            await homePage.openApplication();
            await homePage.openLoginOrRegistrationPage();
            await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
            dashboardPage.verifyWelcomeMessage();
            await dashboardPage.waitForDashboardToLoad();
        });

        for(let productIndex in productNames) {
            const productName = productNames[productIndex];
            
            await test.step(`Navigate to ${productType} products`, async () => {
                await productNavigationPage.switchToProduct(productCategory, productType);
                await dashboardPage.waitForDashboardToLoad();
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

