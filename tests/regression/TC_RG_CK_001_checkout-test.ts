import { test } from '../../pages/fixture/fixture';

test('Validate Checkout Flow for Authenticated User', { tag: ["@regression"] }, async ({ authenticatedUser, productNavigationPage, productBasketPage, checkoutPaymentPage, orderHistoryPage }) => {

    await test.step('Setup: Add item to cart', async () => {
        // Add a product to the cart to ensure a stable state
        await productNavigationPage.switchToProduct('Men'); // Navigate to Men category
        await productNavigationPage.addProductToCart('Gryffindor Quidditch Jersey', 'S');
    });

    await test.step('Review Cart', async () => {
        await productBasketPage.navigateToCart();
        // Validate cart has the item
        await productBasketPage.verifyProductInCart('Gryffindor Quidditch Jersey');
    });

    await test.step('Proceed to Checkout', async () => {
        await productBasketPage.clickProceedToCheckout();
        // Wait for place-order page to load
        await checkoutPaymentPage.verifyCheckoutPaymentPageLoaded();
    });

    await test.step('Complete Payment', async () => {
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
        // Wait for order success confirmation
        await orderHistoryPage.validateOrderSuccessMessage();
        await orderHistoryPage.closeSuccessDialog();
        // Verify navigation to order history or order success
        await orderHistoryPage.verifyOrderHistoryPageLoaded();
    });

    await test.step('Navigate to Order History and Verify Order', async () => {
        // We're already on /orders, but let's verify page loaded via page object
        await orderHistoryPage.verifyOrderHistoryPageLoaded();
        // Validate that there is an order 
        await orderHistoryPage.verifyHasOrders();
        // Verify the most recent order
        const mostRecentOrder = await orderHistoryPage.getMostRecentOrder();
    });

});

test('Validate Checkout Flow for Guest User', { tag: ["@regression"] }, async ({ homePage, productNavigationPage, productBasketPage, checkoutPaymentPage, orderHistoryPage }) => {

    await test.step('Setup: Add item to cart', async () => {
        // Add a product to the cart to ensure a stable state
        await homePage.openApplication();
        await productNavigationPage.switchToProduct('Men'); // Navigate to Men category
        await productNavigationPage.addProductToCart('Gryffindor Quidditch Jersey', 'S');
    });

    await test.step('Review Cart', async () => {
        await productBasketPage.navigateToCart();
        // Validate cart has the item
        await productBasketPage.verifyProductInCart('Gryffindor Quidditch Jersey');
    });

    await test.step('Proceed to Checkout', async () => {
        await productBasketPage.clickProceedToCheckout();
        // Wait for place-order page to load
        await checkoutPaymentPage.verifyCheckoutPaymentPageLoaded();
    });

    await test.step('Complete Payment', async () => {
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
        // Wait for order success confirmation
        await orderHistoryPage.validateOrderSuccessMessage();
        await orderHistoryPage.closeSuccessDialog();
        // Verify navigation to order history or order success
        await orderHistoryPage.verifyOrderHistoryPageLoaded();
    });

    await test.step('Navigate to Order History and Verify Order', async () => {
        // We're already on /orders, but let's verify page loaded via page object
        await orderHistoryPage.verifyOrderHistoryPageLoaded();
        // Validate that there is an order 
        await orderHistoryPage.verifyHasOrders();
        // Verify the most recent order
        const mostRecentOrder = await orderHistoryPage.getMostRecentOrder();
    });

});