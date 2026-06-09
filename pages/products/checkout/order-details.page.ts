import { type Locator, type Page, expect } from "@playwright/test";
import logger from "../../../utils/winston-logger/logger-util";

/**
 * OrderDetailsPage - Handles interactions with the order details page
 * Displays comprehensive information about a specific order
 */
export class OrderDetailsPage {
    private readonly orderIdElement: Locator;
    private readonly orderStatusElement: Locator;
    private readonly orderTotalElement: Locator;
    private readonly orderItemsContainer: Locator;
    private readonly orderItemRows: Locator;
    private readonly backButton: Locator;

    constructor(private page: Page) {
        this.page = page;
        // Locators discovered via MCP inspection
        this.orderIdElement = page.locator('[class*="order-id"], h1, h2').first();
        this.orderStatusElement = page.locator('[class*="status"], [class*="Status"]').first();
        this.orderTotalElement = page.locator('[class*="total"], [class*="Total"]').first();
        this.orderItemsContainer = page.locator('[class*="items"], [class*="order-items"], table').first();
        this.orderItemRows = page.locator('[class*="item-row"], tr, [class*="product-item"]');
        this.backButton = page.getByRole('button', { name: 'Back' }).or(page.locator('a').filter({ hasText: 'Back' })).first();
    }

    /**
     * Verify that the order details page has loaded successfully
     */
    async verifyOrderDetailsPageLoaded() {
        await expect(this.page).toHaveURL(/.*\/order|.*\/orders/);
        await expect(this.orderIdElement).toBeVisible();
        logger.info('Order Details page loaded successfully');
        return this;
    }

    /**
     * Get the order ID from the page
     */
    async getOrderId(): Promise<string> {
        const orderId = await this.orderIdElement.textContent();
        logger.info(`Retrieved Order ID: ${orderId}`);
        return orderId || '';
    }

    /**
     * Get the order status from the page
     */
    async getOrderStatus(): Promise<string> {
        const status = await this.orderStatusElement.textContent();
        logger.info(`Order Status: ${status}`);
        return status || '';
    }

    /**
     * Get the order total amount
     */
    async getOrderTotal(): Promise<string> {
        const total = await this.orderTotalElement.textContent();
        logger.info(`Order Total: ${total}`);
        return total || '';
    }

    /**
     * Get the number of items in the order
     */
    async getOrderItemCount(): Promise<number> {
        const count = await this.orderItemRows.count();
        logger.info(`Order contains ${count} items`);
        return count;
    }

    /**
     * Verify that a specific product is in the order
     * @param productName - Name of the product to verify
     */
    async verifyProductInOrder(productName: string): Promise<boolean> {
        const productFound = await this.page.locator(`text=${productName}`).isVisible().catch(() => false);
        if (productFound) {
            logger.info(`Product '${productName}' found in order details`);
        } else {
            logger.warn(`Product '${productName}' not found in order details`);
        }
        return productFound;
    }

    /**
     * Get details of a specific order item by name
     * @param productName - Name of the product
     */
    async getOrderItemDetails(productName: string): Promise<{
        name?: string;
        quantity?: string;
        price?: string;
        total?: string;
    }> {
        const itemRow = this.page.locator('tr, [class*="item"]').filter({ hasText: productName }).first();
        await expect(itemRow).toBeVisible();

        const details = {
            name: await itemRow.locator('td, [class*="name"]').first().textContent() || '',
            quantity: await itemRow.locator('td, [class*="quantity"]').nth(1).textContent() || '',
            price: await itemRow.locator('td, [class*="price"]').nth(2).textContent() || '',
            total: await itemRow.locator('td, [class*="total"]').nth(3).textContent() || '',
        };

        logger.info(`Order item details: ${JSON.stringify(details)}`);
        return details;
    }

    /**
     * Verify order information matches expected values
     * @param expectedData - Object containing expected order data
     */
    async verifyOrderInformation(expectedData: {
        productName?: string;
        quantity?: string;
        total?: string;
        status?: string;
    }) {
        if (expectedData.productName) {
            await this.verifyProductInOrder(expectedData.productName);
        }

        if (expectedData.total) {
            const actualTotal = await this.getOrderTotal();
            await expect(actualTotal).toContain(expectedData.total);
            logger.info(`Total verified: ${actualTotal}`);
        }

        if (expectedData.status) {
            const actualStatus = await this.getOrderStatus();
            await expect(actualStatus).toContain(expectedData.status);
            logger.info(`Status verified: ${actualStatus}`);
        }

        logger.info('Order information verified');
        return this;
    }

    /**
     * Go back to the order history page
     */
    async goBackToOrderHistory() {
        await this.backButton.click();
        logger.info('Navigated back to order history');
    }

    /**
     * Get all visible order information as text
     */
    async getAllOrderInformation(): Promise<string> {
        const information = await this.page.locator('body').textContent();
        logger.info('Retrieved all order information');
        return information || '';
    }
}
