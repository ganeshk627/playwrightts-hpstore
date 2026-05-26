import { type Locator, type Page, expect} from "@playwright/test";
import logger from "../../utils/winston-logger/logger-util";


export class HomePage {

    //variables
    private readonly loginLink: Locator;
    private readonly homeNav: Locator;
    private readonly collectionNav: Locator;
   

    //constructor
    constructor (private page:Page) {
        this.page = page;
        // LOGIN link in navigation
        this.loginLink = page.getByRole('link', { name: 'LOGIN' });
        // Navigation links
        this.homeNav = page.getByRole('link', { name: 'HOME' });
        this.collectionNav = page.getByRole('link', { name: 'COLLECTION' });
        
    };   

    // methods
    async openLoginOrRegistrationPage(){
        // Click LOGIN link to open login page
        await this.loginLink.click();
        logger.info('clicked LOGIN link');
        await expect(this.page).toHaveURL(/.*\/login/i);
    }

    async navigateToCollection(){
        await this.collectionNav.click();
        logger.info('navigated to collection');
    }

    async navigateHome(){
        await this.homeNav.click();
        logger.info('navigated to home');
    }

};
