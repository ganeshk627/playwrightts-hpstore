import { test } from '../../pages/fixture/fixture';

const productCategory = 'Men';
const productType = 'Topwear';
const productName = 'Gryffindor Quidditch Jersey';

test('Add Product Test @smoke', async ({ homePage, loginPage, dashboardPage, productNavigationPage }) => {

    await test.step('Login as Default Login', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        dashboardPage.verifyWelcomeMessage();
    });

    await test.step('Navigating to Men Topwear products page', async () => {
        await productNavigationPage.switchToProduct(productCategory, productType);
    });

    await test.step(`Adding ${productName} to cart`, async () => {
        await productNavigationPage.addProductToCart(productName);
    });

})