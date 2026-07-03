import { test } from '../../pages/fixture/fixture';
import testdata from '../../test-data/json/testdata.json';

const registeredUsers = testdata['registered users'];

test.describe('Profile Name ', () => {
    registeredUsers.forEach((user) => {
        test(`Validate Profile Name for ${user.email}`, { tag: ["@regression"] }, async ({ homePage, loginPage, dashboardPage }) => {
            const email = user.email;
            const password = user.password;
            const profileName = user.name;

            await test.step('Setup: Navigate to application and open login page', async () => {
                await homePage.openApplication();
                await homePage.openLoginOrRegistrationPage();
            });
            await test.step('Action: Enter credentials and submit login form', async () => {
                await loginPage.login(email, password);
            });
            await test.step('Assert: Verify dashboard display and profile name', async () => {
                await dashboardPage.validateProfileName(profileName);
            });
        });
    });
});


