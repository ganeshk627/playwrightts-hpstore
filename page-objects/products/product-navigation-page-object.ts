import { type Locator, type Page, expect} from "@playwright/test";
import { ProductViewPage } from "./product-view-page-object";
import { ProductBasketPage } from "./product-basket-page-object";


export class ProductNavigationPage {

    //variables
    private readonly sort: Locator;
    private readonly listViewButton: Locator;
    private readonly gridViewButton: Locator;
    private readonly addToCartButton: Locator;
    private readonly couponTextBox: Locator;
    private readonly applyCouponButton: Locator;


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.sort = page.locator('#sort');
        this.listViewButton = page.locator('#list');
        this.gridViewButton = page.locator('#grid');
        this.addToCartButton = page.getByRole('link', { name: 'Add to Cart' });
        this.couponTextBox = page.locator('#coupon_coupon');
        this.applyCouponButton = page.getByRole('button', { name: 'Apply Coupon' });
    };   

    // methods
    async switchToProduct(productCategory: 'Apparel & accessories'|'Makeup'|'Skincare'|'Fragrance'|'Men'|'Hair Care'|'Books', productType?:string){
        await this.page.locator('#categorymenu').getByRole('link', { name: productCategory }).click();
        await expect(this.page).toHaveTitle(productCategory);
        if(productType && productCategory === 'Makeup' && ['Cheeks', 'Eyes', 'Face', 'Lips', 'Nails', 'Value Sets'].includes(productType)) {
            await this.page.locator('#maincontainer li').getByRole('link', { name: productType }).click();
            await expect(this.page).toHaveTitle(productType);
        }
        await expect(this.page).toHaveURL(/product\/category/);
    };

    async addProductToCart(productName: string) {
        await this.page.getByRole('link', { name: productName }).click();
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
        await this.couponTextBox.pressSequentially(couponCode);
        await this.applyCouponButton.click();
    };

    async toggleProductView(view: 'list'|'grid') {
        view === 'list' ? await this.listViewButton.click() : await this.gridViewButton.click();
    };
   

    



};
