import { test, expect } from '../../../pages/fixture/fixture';
import logger from '../../../utils/winston-logger/logger-util';
import { CheckoutPaymentPage } from '../../../pages/products/checkout/checkout-payment.page';

test('Complete Checkout Flow @regression', async ({ page, authenticatedUser, productNavigationPage, productBasketPage, orderHistoryPage }) => {

    // Unpack authenticatedUser to ensure we're logged in
    const { dashboardPage } = authenticatedUser;

    await test.step('Setup: Add item to cart', async () => {
        logger.info('Starting checkout test setup');
        // Add a product to the cart to ensure a stable state
        await productNavigationPage.switchToProduct('Men'); // Navigate to Men category
        await productNavigationPage.addProductToCart('Gryffindor Quidditch Jersey', 'S');
        logger.info('Added Gryffindor Quidditch Jersey to cart');
    });

    await test.step('Review Cart', async () => {
        await page.goto('/cart');
        logger.info('Navigated to /cart');

        // Validate cart has the item
        await expect(page.locator('text=Gryffindor Quidditch Jersey').first()).toBeVisible();
    });

    await test.step('Proceed to Checkout', async () => {
        await productBasketPage.clickProceedToCheckout();
        // Wait for place-order page to load
        await expect(page).toHaveURL(/.*\/place-order/);
    });

    await test.step('Complete Payment', async () => {
        const checkoutPaymentPage = new CheckoutPaymentPage(page);

        // Fill delivery information
        await checkoutPaymentPage.fillDeliveryInformation({
            firstName: 'Harry',
            lastName: 'Potter',
            email: 'harry@hogwarts.com',
            street: '4 Privet Drive',
            city: 'Little Whinging',
            state: 'Surrey',
            zipcode: '12345',
            country: 'UK',
            phone: '1234567890'
        });

        // Click Place Order
        await checkoutPaymentPage.clickPlaceOrder();

        // Verify navigation to order history or order success
        // Based on our MCP test, it navigates to /orders
        await expect(page).toHaveURL(/.*\/orders/);
        logger.info('Order placed successfully, navigated to orders page');

        // Wait for order success confirmation
        await orderHistoryPage.validateOrderSuccessMessage();
        await orderHistoryPage.closeSuccessDialog();
    });

    await test.step('Navigate to Order History and Verify Order', async () => {
        // We're already on /orders, but let's verify page loaded via page object
        await orderHistoryPage.verifyOrderHistoryPageLoaded();

        // Validate that there is an order 
        const orderCount = await orderHistoryPage.getOrderCount();
        expect(orderCount).toBeGreaterThan(0);

        // Verify the most recent order
        const mostRecentOrder = await orderHistoryPage.getMostRecentOrder();
        await expect(mostRecentOrder).toBeVisible();
        logger.info('Verified order appears in history');
    });

});
