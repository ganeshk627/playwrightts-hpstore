import { type Locator, type Page, expect} from "@playwright/test";
import { CheckoutConfirmationPage } from "./checkout/checkout-confirmation.page";
import { DashboardPage } from "../dashboard/dashboard.page";
import logger from "../../utils/winston-logger/logger-util";


export class ProductBasketPage {

    //variables
    private readonly checkoutButton1: Locator;
    private readonly checkoutButton2: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly continueButton: Locator;
    private readonly proceedToCheckoutButton: Locator;
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.checkoutButton1 = page.locator('#cart_checkout1');
        this.checkoutButton2 = page.locator('#cart_checkout2');
        this.continueShoppingButton = page.getByRole('link', { name: 'Continue Shopping' });
        this.continueButton = page.getByRole('link', { name: 'Continue' });
        this.proceedToCheckoutButton = page.getByRole('button', { name: /PROCEED TO CHECKOUT/i });
    };   

    // methods
    async clickCheckoutProduct1() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.checkoutButton1.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        logger.info('Clicked checkout button and navigated to confirmation page');
        return new CheckoutConfirmationPage(this.page);
    }

    async clickCheckoutProduct2() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.checkoutButton2.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        logger.info('Clicked checkout button 2 and navigated to confirmation page');
        return new CheckoutConfirmationPage(this.page);
    }

    async clickContinueShopping() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.continueShoppingButton.click();
        logger.info('Clicked continue shopping button');
        return new DashboardPage(this.page);
    }

    async clickContinue() {
        await this.continueButton.click();
        logger.info('Clicked Continue button');
    }

    async removeProductFromCart(productName: string) {
        // Find the remove link for the specific product
        const productRow = this.page.locator('tr').filter({ has: this.page.locator('td').filter({ hasText: productName }).first() });
        const removeLink = productRow.locator('a[href*="remove"]');
        
        if (await removeLink.isVisible()) {
            await removeLink.click();
            logger.info(`Removed product '${productName}' from cart`);
        } else {
            logger.warn(`Remove link not found for product '${productName}'`);
        }
    }

    async clickProceedToCheckout() {
        await expect(this.page).toHaveURL(/.*\/cart/);
        await this.proceedToCheckoutButton.click();
        logger.info('Clicked proceed to checkout button and navigated to place order page');
    }
}
