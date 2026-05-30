import { type Locator, type Page, expect} from "@playwright/test";
import { CheckoutConfirmationPage } from "./checkout/checkout-confirmation-page-object";
import { DashboardPage } from "../dashboard/dashboard-page-object";
import logger from "../../utils/winston-logger/logger-util";


export class ProductBasketPage {

    //variables
    private readonly checkoutButton1: Locator;
    private readonly checkoutButton2: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly continueButton: Locator;
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.checkoutButton1 = page.locator('#cart_checkout1');
        this.checkoutButton2 = page.locator('#cart_checkout2');
        this.continueShoppingButton = page.getByRole('link', { name: 'Continue Shopping' });
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    };   

    // methods
    async clickCheckoutProduct1() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.checkoutButton1.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        return new CheckoutConfirmationPage(this.page);
    }

    async clickCheckoutProduct2() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.checkoutButton2.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        return new CheckoutConfirmationPage(this.page);
    }

    async clickContinueShopping() {
        await expect(this.page).toHaveURL(/checkout\/cart/);
        await this.continueShoppingButton.click();
        return new DashboardPage(this.page);
    }

    async clickContinue() {
        await this.continueButton.click();
        logger.info('Clicked Continue button');
    }
