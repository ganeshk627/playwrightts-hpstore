import { test } from '../../pages/fixture/fixture';

test('Login and Logout Test @smoke', async ({ homePage, loginPage, dashboardPage, testdata }) => {
    const test_name = 'login'
    const email = testdata[test_name].email;
    const password = testdata[test_name].password;

    await test.step('Setup: Navigate to application and open login page', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
    });

    await test.step('Action: Enter credentials and submit login form', async () => {
        await loginPage.login(email, password);
    });

    await test.step('Assert: Verify successful login and dashboard display', async () => {
        await dashboardPage.verifyDashboardURL();
        await dashboardPage.verifyWelcomeMessage();
    });

    // TODO: Script to logout and verify logout success message and redirection to login page
    
})
