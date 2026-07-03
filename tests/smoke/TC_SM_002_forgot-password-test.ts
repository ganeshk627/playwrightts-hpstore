import { test } from '../../pages/fixture/fixture';

test('Forgot Password @smoke', async ({ page, homePage, loginPage, forgotPasswordPage, testdata}) => {
    const test_name = 'reset password'
    const email = testdata[test_name].email;

    await test.step('Open application', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
    });

    await test.step('Click Forgot password link and Reset password', async () => {
        await loginPage.clickForgotPasswordLink();
        await forgotPasswordPage.resetPassword(email);
    });
});
