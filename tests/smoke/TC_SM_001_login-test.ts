import { test } from '../../pages/fixture/fixture';

test('Login Test @smoke', async({ homePage, loginPage, dashboardPage })=>{

    await test.step('Setup: Navigate to application and open login page', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
    });

    await test.step('Action: Enter credentials and submit login form', async () => {
        const username = process.env.USERNAME!;
        await loginPage.login(username, process.env.PASSWORD!);
    });

    await test.step('Assert: Verify successful login and dashboard display', async () => {
        await dashboardPage.verifyDashboardURL();
        await dashboardPage.verifyWelcomeMessage();
    });

})
