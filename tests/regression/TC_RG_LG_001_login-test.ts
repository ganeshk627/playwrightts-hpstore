import { test } from '../../pages/fixture/fixture';
import testdata from '../../test-data/json/testdata.json';

const registeredUsers = testdata['registered users'];

test.describe('Login Tests', () => {
    registeredUsers.forEach((user) => {
        test(`Validate Login Test for ${user.email}`, { tag: ["@regression"] }, async ({ homePage, loginPage, dashboardPage }) => {

            await test.step('Setup: Navigate to application and open login page', async () => {
                await homePage.openApplication();
                await homePage.openLoginOrRegistrationPage();
            });
            await test.step('Action: Enter credentials and submit login form', async () => {
                await loginPage.login(user.email, user.password);
            });
            await test.step('Assert: Verify successful login and dashboard display', async () => {
                await dashboardPage.verifyDashboardURL();
                await dashboardPage.verifyWelcomeMessage();
            });
        });
    });
});


