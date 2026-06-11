import { type Locator, type Page, expect} from "@playwright/test";
import logger from "../../utils/winston-logger/logger-util";
import { BasePage } from "../base.page";


export class HomePage extends BasePage  {

    //variables
    private readonly loginLink: Locator;
    private readonly homeNav: Locator;
    private readonly collectionNav: Locator;
   

    //constructor
    constructor (private page:Page) {
        super(page);
        this.page = page;
        // LOGIN link in navigation (profile icon)
        this.loginLink = page.locator('img[src*="profile_icon"]');
        // Navigation links (desktop ul)
        this.homeNav = page.locator('ul').getByRole('link', { name: /home/i });
        this.collectionNav = page.locator('ul').getByRole('link', { name: /collection/i });
        
    };   

    // methods
    async openLoginOrRegistrationPage(){
        // Click LOGIN link to open login page
        logger.info('Opening login page');
        await this.loginLink.click();
        logger.info('Successfully clicked LOGIN link');
        await expect(this.page).toHaveURL(/.*\/login/i);
        logger.info('Login page opened successfully');
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
