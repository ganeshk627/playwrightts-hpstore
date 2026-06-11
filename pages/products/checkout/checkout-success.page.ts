import { type Locator, type Page, expect} from "@playwright/test";
import { DashboardPage } from "../../dashboard/dashboard.page";
import logger from "../../../utils/winston-logger/logger-util";


export class CheckoutSuccessPage {

    //variables
    private readonly continueButton: Locator;
    private readonly successHeading: Locator;
    private readonly SUCCESS_HEADING_MESSAGE:string = "Your Order Has Been Processed!" 
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.continueButton = page.getByRole('link', { name: 'Continue' });
        this.successHeading = page.locator('h1.heading1');
    };   

    // methods
    async clickContinueButton() {
        await expect(this.page).toHaveURL(/checkout\/success/);
        await this.continueButton.click();
        logger.info('Order completed successfully');
        return new DashboardPage(this.page);
    };

    async validateOrderSuccessMessage(){
        await expect(this.successHeading).toContainText(this.SUCCESS_HEADING_MESSAGE);
        return this;
    }



};
