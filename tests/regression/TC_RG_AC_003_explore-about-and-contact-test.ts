import { test, expect } from '../../pages/fixture/fixture';
import logger from '../../utils/winston-logger/logger-util';

test('Explore about and contact content @regression', async ({ homePage, page }) => {

    await test.step('Open the homepage and navigate to the About page', async () => {
        await homePage.openApplication();
        await page.getByRole('link', { name: 'ABOUT', exact: true }).click();
        await expect(page).toHaveURL(/\/about/);
        await expect(page.getByText(/step into the wizarding world/i)).toBeVisible();
        logger.info('About page content is visible');
    });

    await test.step('Navigate to the Contact page and verify the contact details', async () => {
        await page.getByRole('link', { name: 'CONTACT', exact: true }).click();
        await expect(page).toHaveURL(/\/contact/);
        await expect(page.getByText(/contact@ganeshhub.com/i)).toBeVisible();
        logger.info('Contact page details are visible');
    });
});
