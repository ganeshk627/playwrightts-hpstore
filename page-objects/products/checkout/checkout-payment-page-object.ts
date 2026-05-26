import { type Locator, type Page, expect} from "@playwright/test";


export class CheckoutPaymentPage {

    //variables
    private readonly continueButton: Locator;
    private readonly backButton: Locator;
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.backButton = page.locator('#payment').getByRole('link', { name: 'Back' });
    };   

    // methods
    async clickContinueButton() {
        await expect(this.page).toHaveURL(/checkout\/payment/)
        await this.continueButton.click();
    };

    async clickBackButton(){
        await expect(this.page).toHaveURL(/checkout\/payment/)
        await this.backButton.click();
        await expect(this.page).toHaveURL(/checkout\/confirm/)
    }



};
