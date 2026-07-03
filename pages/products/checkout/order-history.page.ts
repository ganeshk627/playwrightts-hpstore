import { type Locator, type Page, expect } from "@playwright/test";
import logger from "../../../utils/winston-logger/logger-util";

/**
 * OrderHistoryPage - Handles interactions with the orders/history page
 * Allows users to view their placed orders and access order details
 */
export class OrderHistoryPage {
    private readonly orderListContainer: Locator;
    private readonly orderRows: Locator;
    private readonly myOrdersHeading: Locator;
    private readonly MY_ORDERS_TITLE = "My Orders";

    constructor(private page: Page) {
        this.page = page;
        this.myOrdersHeading = page.locator('[auto-id="my-orders"]');
        this.orderListContainer = page.locator('[class*="order"], [class*="Order"], table, [role="table"]').first();
        this.orderRows = page.locator('div[auto-id="order-item"]');
    }

    /**
     * Navigate to the orders/history page
     */
    async navigateToOrders() {
        await this.page.goto('/orders');
        await expect(this.page).toHaveURL(/.*\/orders/);
        logger.info('Navigated to Orders page');
    }

    /**
     * Verify that the order history page has loaded successfully
     */
    async verifyOrderHistoryPageLoaded() {
        await expect(this.page).toHaveURL(/.*\/orders/);
        await expect(this.myOrdersHeading).toBeVisible();
        await expect(this.myOrdersHeading).toHaveText(this.MY_ORDERS_TITLE);
        logger.info('Order History page loaded successfully');
        return this;
    }

    async validateOrderSuccessMessage() {
        await expect(this.page.getByRole('dialog', { name: 'Success' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await expect(this.page.getByText('Order placed successfully!')).toBeVisible();
    }

    async closeSuccessDialog() {
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    /**
     * Get the total number of orders displayed
     */
    async getOrderCount(): Promise<number> {
        const count = await this.orderRows.count();
        logger.info(`Found ${count} orders in order history`);
        return count;
    }

    /**
     * Verify that there is at least one order
     */
    async verifyHasOrders() {
        const count = await this.getOrderCount();
        expect(count).toBeGreaterThan(0);
    }

    /**
     * Check if an order with specific ID exists in the list
     * @param orderId - The order ID to search for
     */
    async orderExists(orderId: string): Promise<boolean> {
        const orderFound = await this.page.locator(`text=${orderId}`).isVisible().catch(() => false);
        if (orderFound) {
            logger.info(`Order with ID '${orderId}' found in order history`);
        } else {
            logger.warn(`Order with ID '${orderId}' not found in order history`);
        }
        return orderFound;
    }

    /**
     * Get the most recent order (first in the list)
     * Useful for validating newly created orders
     */
    async getMostRecentOrder() {
        const firstOrderRow = this.orderRows.first();
        await expect(firstOrderRow).toBeVisible();
        const orderText = await firstOrderRow.textContent();
        logger.info(`Most recent order details: ${orderText}`);
        logger.info('Verified order appears in history');
        return firstOrderRow;
    }

    /**
     * Click on an order to view its details
     * @param orderId - The order ID to click
     */
    async clickOrderDetails(orderId: string) {
        const orderLink = this.page.locator(`a, button, [role="button"]`).filter({ hasText: orderId }).first();
        await expect(orderLink).toBeVisible();
        await orderLink.click();
        logger.info(`Clicked on order ID: ${orderId}`);
    }

    /**
     * Get order status for a specific order
     * @param orderId - The order ID to get status for
     */
    async getOrderStatus(orderId: string): Promise<string> {
        const orderRow = this.page.locator('tr, [class*="order-item"]').filter({ hasText: orderId });
        const statusElement = orderRow.locator('[class*="status"], td:nth-child(3)').first();
        const status = await statusElement.textContent();
        logger.info(`Order ${orderId} status: ${status}`);
        return status || '';
    }

    /**
     * Get order amount/total for a specific order
     * @param orderId - The order ID to get amount for
     */
    async getOrderAmount(orderId: string): Promise<string> {
        const orderRow = this.page.locator('tr, [class*="order-item"]').filter({ hasText: orderId });
        const amountElement = orderRow.locator('[class*="price"], [class*="amount"], td:nth-child(4)').first();
        const amount = await amountElement.textContent();
        logger.info(`Order ${orderId} amount: ${amount}`);
        return amount || '';
    }

    /**
     * Wait for an order to appear in the list
     * Useful for newly created orders that may take a moment to appear
     * @param orderId - The order ID to wait for
     * @param timeout - Maximum time to wait in milliseconds
     */
    async waitForOrderToAppear(orderId: string, timeout: number = 10000) {
        const orderElement = this.page.locator(`text=${orderId}`);
        await expect(orderElement).toBeVisible({ timeout });
        logger.info(`Order ${orderId} appeared in order history`);
    }
}
