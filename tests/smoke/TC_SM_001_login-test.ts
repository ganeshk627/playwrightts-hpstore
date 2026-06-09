import { test, expect } from '../../pages/fixture/fixture';
import logger from '../../utils/winston-logger/logger-util';

test('Login Test @smoke', async({ page, homePage, loginPage })=>{

    await test.step('Setup: Navigate to application and open login page', async () => {
        logger.info('Starting smoke login test');
        logger.info(`Base URL: ${process.env.BASE_URL}`);
        
        await homePage.openApplication();
        logger.info('Application opened successfully');
        
        await homePage.openLoginOrRegistrationPage();
        logger.info('Login page opened successfully');
    });

    await test.step('Action: Enter credentials and submit login form', async () => {
        const username = process.env.USERNAME!;
        logger.info('Submitting login credentials');
        
        await loginPage.login(username, process.env.PASSWORD!);
        logger.info('Login completed successfully');
    });

    await test.step('Assert: Verify successful login and dashboard display', async () => {
        logger.info('Verifying login success');
        
        await expect(page).toHaveURL(/.*\/(home|dashboard)?$/i);
        logger.info('Dashboard URL verified');
        
        await expect(page.getByText('Login successful!', { exact: false })).toBeVisible();
        logger.info('Login success message displayed');
    });

    logger.info('✅ Smoke login test passed successfully');
})
