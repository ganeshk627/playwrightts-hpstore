import { type Locator, type Page, expect} from "@playwright/test";
import { CheckoutSuccessPage } from "./checkout-success.page";


export class CheckoutConfirmationPage {

    //variables
    private readonly confirmOrderButton: Locator;
    private readonly backButton: Locator;

    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.confirmOrderButton = page.getByRole('button', { name: 'Confirm Order' });
        this.backButton = page.locator('#payment').getByRole('link', { name: 'Back' });
    };   

    // methods
    async clickConfirmOrderButton() {
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        await this.confirmOrderButton.click();
        await expect(this.page).toHaveURL(/checkout\/success/);
        return new CheckoutSuccessPage(this.page);
    };

    async clickBackButton(){
        await expect(this.page).toHaveURL(/checkout\/confirm/);
        await this.backButton.click();
        await expect(this.page).toHaveURL(/checkout\/payment/);
    }


};
