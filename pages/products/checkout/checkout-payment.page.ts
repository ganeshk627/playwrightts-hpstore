import { type Locator, type Page, expect} from "@playwright/test";
import logger from "../../../utils/winston-logger/logger-util";


export class CheckoutPaymentPage {

    //variables
    private readonly continueButton: Locator;
    private readonly backButton: Locator;
    
    // Delivery Information Form Fields
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly streetInput: Locator;
    private readonly cityInput: Locator;
    private readonly stateInput: Locator;
    private readonly zipcodeInput: Locator;
    private readonly countryInput: Locator;
    private readonly phoneInput: Locator;
    private readonly placeOrderButton: Locator;
  

    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.backButton = page.locator('#payment').getByRole('link', { name: 'Back' });
        
        // Delivery Info locators
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.streetInput = page.locator('input[name="street"]');
        this.cityInput = page.locator('input[name="city"]');
        this.stateInput = page.locator('input[name="state"]');
        this.zipcodeInput = page.locator('input[name="zipcode"]');
        this.countryInput = page.locator('input[name="country"]');
        this.phoneInput = page.locator('input[name="phone"]');
        this.placeOrderButton = page.getByRole('button', { name: /Place Order/i });
    };   

    // methods
    async verifyCheckoutPaymentPageLoaded() {
        await expect(this.page).toHaveURL(/.*\/place-order/);
    }

    async clickContinueButton() {
        await expect(this.page).toHaveURL(/checkout\/payment/);
        await this.continueButton.click();
    };

    async clickBackButton(){
        await expect(this.page).toHaveURL(/checkout\/payment/);
        await this.backButton.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/);
    }

    async fillDeliveryInformation(details: {
        firstName: string,
        lastName: string,
        email: string,
        street: string,
        city: string,
        state: string,
        zipcode: string,
        country: string,
        phone: string
    }) {
        logger.info('Filling delivery information');
        await expect(this.page).toHaveURL(/.*\/place-order/);
        
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.emailInput.fill(details.email);
        await this.streetInput.fill(details.street);
        await this.cityInput.fill(details.city);
        await this.stateInput.fill(details.state);
        await this.zipcodeInput.fill(details.zipcode);
        await this.countryInput.fill(details.country);
        await this.phoneInput.fill(details.phone);
        
        logger.info('Successfully filled delivery information');
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
        logger.info('Clicked Place Order button');
        // Let caller wait for URL change or response
    }

};
