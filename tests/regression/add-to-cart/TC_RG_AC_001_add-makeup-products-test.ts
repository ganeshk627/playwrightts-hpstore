import { test } from '../../../pages/fixture/fixture';

test('Add Makeup Products @smoke', async({ homePage, loginPage, dashboardPage, productNavigationPage, productBasketPage })=>{

    await test.step('Login as Ganesh', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        await dashboardPage.verifyWelcomeBackMessage();
    });

    await test.step('Navigating to Makeup products page',async () => {
        await productNavigationPage.switchToProduct('Makeup', 'Face');
    });

    await test.step('Adding one makeup product to card and removing it',async () => {
        await productNavigationPage.addProductToCart('Delicate Oil-Free Powder Blush');
        await productBasketPage.removeProductFromCart('Delicate Oil-Free Powder Blush');
        await productBasketPage.clickContinue();
    })

})