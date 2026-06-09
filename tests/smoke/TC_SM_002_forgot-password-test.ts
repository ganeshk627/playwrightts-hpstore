import { test } from '../../pages/fixture/fixture';
import { ForgotPasswordPage } from '../../pages/forgot-password/forgot-password.page';

test('Forgot Password @smoke', async ({ page, homePage, loginPage }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await test.step('Open application', async () => {
        await homePage.openApplication();
        await homePage.openLoginOrRegistrationPage();
    });

    await test.step('Click Forgot password link and Reset password', async () => {
        await loginPage.clickForgotPasswordLink();
        await forgotPasswordPage.resetPassword(process.env.USERNAME!, process.env.EMAIL!);
    });
});
