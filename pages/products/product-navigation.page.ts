import { type Locator, type Page, expect} from "@playwright/test";
import { ProductViewPage } from "./product-view.page";
import { ProductBasketPage } from "./product-basket.page";
import logger from "../../utils/winston-logger/logger-util";


export class ProductNavigationPage {

    //variables
    private readonly sortDropdown: Locator;
    private readonly collectionNav: Locator;
    private readonly categoryMenu: Locator;


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.sortDropdown = page.locator('select').first();
        this.collectionNav = page.locator('ul').getByRole('link', { name: 'COLLECTION' });
        this.categoryMenu = page.locator('#categorymenu');
    };   

    // methods
    async switchToProduct(productCategory: 'Men'|'Women'|'Kids'|'Makeup', productType?: 'Topwear'|'Bottomwear'|'Winterwear'|'Face'|'Eyes'|'Lips'|'Cheeks'){
        logger.info(`Navigating to ${productCategory} category with type: ${productType}`);
        
        if (productCategory === 'Makeup') {
            // For Makeup, navigate to collection page first, then use the menu
            // This ensures the category menu is fully loaded and available
            await this.collectionNav.first().click();
            await this.page.waitForLoadState('networkidle');
            logger.info('Navigated to collection page');
            
            // Now try to find and click Makeup link
            // Look for Makeup in any dropdown, menu, or navigation element
            let makeupLink = this.page.locator('a:has-text("Makeup")').first();
            if (await makeupLink.count() > 0) {
                await makeupLink.click();
                logger.info('Clicked Makeup link from menu');
                await this.page.waitForLoadState('networkidle');
                
                if (productType) {
                    // After navigating to Makeup, click on the product type
                    const typeElement = this.page.locator('#maincontainer li').filter({ hasText: new RegExp(`^${productType}$`) }).first();
                    if (await typeElement.count() > 0) {
                        await typeElement.click();
                        logger.info(`Selected Makeup type: ${productType}`);
                        await this.page.waitForLoadState('networkidle');
                    }
                }
            } else {
                logger.warn('Makeup link not found in menu, attempting direct category menu approach');
                // Fallback to direct #categorymenu approach
                try {
                    await this.categoryMenu.getByRole('link', { name: 'Makeup' }).click();
                    logger.info('Clicked Makeup from category menu');
                    
                    if (productType) {
                        await this.page.locator('#maincontainer li').filter({ hasText: new RegExp(`^${productType}$`) }).click();
                        logger.info(`Selected Makeup type: ${productType}`);
                    }
                } catch (e) {
                    logger.error(`Failed to navigate to Makeup category: ${e}`);
                    throw e;
                }
            }
        } else {
            // For Men/Women/Kids, use the Collection page with checkboxes
            await this.collectionNav.first().click();
            await expect(this.page).toHaveURL(/.*\/collection/);
            logger.info(`Navigating to ${productCategory} category`);
            
            // Select category
            await this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${productCategory}\\s*$`) }).locator('input[type="checkbox"]').check();
            logger.info(`Selected category: ${productCategory}`);
            
            if (productType) {
                // Select type
                await this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${productType}\\s*$`) }).locator('input[type="checkbox"]').check();
                logger.info(`Selected product type: ${productType}`);
            }
        }
    };

    async toggleProductView(viewType: 'grid' | 'list') {
        if (viewType === 'grid') {
            await this.page.locator('button').filter({ hasText: /grid/i }).click();
            logger.info('Toggled to grid view');
        } else {
            await this.page.locator('button').filter({ hasText: /list/i }).click();
            logger.info('Toggled to list view');
        }
    };

    async addProductToCart(productName: string, size?: 'S' | 'M' | 'L' | 'XL' | 'XXL', color?: string) {
        await this.page.locator('p', { hasText: productName }).click();
        logger.info(`Clicked on product: ${productName}`);
        const productBasketPage = await new ProductViewPage(this.page).addProductToCart(productName, size, color);
        return productBasketPage;
    };

    async buyProduct(productName:string) {
       const productBasketPage = await this.addProductToCart(productName);
       const checkoutConfirmationPage = await productBasketPage.clickCheckoutProduct1();
       const checkoutSuccessPage = await checkoutConfirmationPage.clickConfirmOrderButton(); 
       await checkoutSuccessPage.validateOrderSuccessMessage();
       await checkoutSuccessPage.clickContinueButton();

    }
}