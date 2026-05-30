import { type Locator, type Page, expect} from "@playwright/test";
import { ProductViewPage } from "./product-view-page-object";
import { ProductBasketPage } from "./product-basket-page-object";


export class ProductNavigationPage {

    //variables
    private readonly sortDropdown: Locator;
    private readonly collectionNav: Locator;


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.sortDropdown = page.locator('select').first();
        this.collectionNav = page.locator('ul').getByRole('link', { name: 'COLLECTION' });
    };   

    // methods
    async switchToProduct(productCategory: 'Men'|'Women'|'Kids', productType?: 'Topwear'|'Bottomwear'|'Winterwear'){
        await this.collectionNav.click();
        await expect(this.page).toHaveURL(/.*\/collection/);
        
        // Select category
        await this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${productCategory}\\s*$`) }).locator('input[type="checkbox"]').check();
        
        if (productType) {
            // Select type
            await this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${productType}\\s*$`) }).locator('input[type="checkbox"]').check();
        }
    };

    async addProductToCart(productName: string) {
        await this.page.locator('p', { hasText: productName }).click();
        const productBasketPage = await new ProductViewPage(this.page).addProductToCart(productName);
        return productBasketPage;
    };

    async buyProduct(productName:string) {
       const productBasketPage = await this.addProductToCart(productName);
       const checkoutConfirmationPage = await productBasketPage.clickCheckoutProduct1();
       const checkoutSuccessPage = await checkoutConfirmationPage.clickConfirmOrderButton(); 
       await checkoutSuccessPage.validateOrderSuccessMessage();
       await checkoutSuccessPage.clickContinueButton();

    }

    async applyCouponCode(couponCode: string) {
        // Not available in HP app yet
