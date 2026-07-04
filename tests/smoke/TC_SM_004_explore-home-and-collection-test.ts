import { test, expect } from '../../pages/fixture/fixture';
import logger from '../../utils/winston-logger/logger-util';

test('Explore homepage and collection navigation @smoke', async ({ homePage, page, productNavigationPage }) => {

    await test.step('Open the homepage and verify the hero content', async () => {
        await homePage.openApplication();
        await expect(page.getByRole('heading', { name: /the magic awaits/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /enter the wizarding world/i })).toBeVisible();
        logger.info('Homepage hero content is visible');
    });

    await test.step('Navigate to the collection page from the homepage', async () => {
        await page.getByRole('link', { name: /enter the wizarding world/i }).click();
        await expect(page).toHaveURL(/\/collection/);
        await expect(page.getByRole('link', { name: /gryffindor quidditch jersey/i })).toBeVisible();
        logger.info('Collection page loaded with products visible');
    });

    await test.step('Apply category and type filters from the collection page', async () => {
        await productNavigationPage.switchToProduct('Men', 'Topwear');
        await expect(page.getByRole('link', { name: /gryffindor quidditch jersey/i })).toBeVisible();
        logger.info('Product category and type filters were applied successfully');
    });
});
