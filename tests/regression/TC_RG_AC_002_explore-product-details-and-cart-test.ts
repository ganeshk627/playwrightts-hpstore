import { test, expect } from '../../pages/fixture/fixture';
import logger from '../../utils/winston-logger/logger-util';

test('Explore product details and manage cart without checkout @regression', async ({ homePage, page, productNavigationPage, productBasketPage }) => {

    await test.step('Open the application and navigate to a product', async () => {
        await homePage.openApplication();
        await page.goto('/collection');
        await expect(page.getByRole('link', { name: /gryffindor quidditch jersey/i })).toBeVisible();
        await page.getByRole('link', { name: /gryffindor quidditch jersey/i }).click();
        await expect(page.getByRole('heading', { name: /gryffindor quidditch jersey/i })).toBeVisible();
        logger.info('Opened the product details page successfully');
    });

    await test.step('Add the product to the cart with a size selection', async () => {
        await page.getByRole('button', { name: 'S', exact: true }).click();
        await page.getByRole('button', { name: /add to cart/i }).click();
        await page.waitForLoadState('networkidle');
        logger.info('Product was added to the cart');
    });

    await test.step('Verify the cart contents', async () => {
        await productBasketPage.navigateToCart();
        await expect(page.getByText(/your cart/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /proceed to checkout/i })).toBeVisible();
        logger.info('Cart page loaded and shows the checkout action');
    });
});
