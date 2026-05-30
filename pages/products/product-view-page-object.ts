import { type Locator, type Page, expect} from "@playwright/test";
import { ProductBasketPage } from "./product-basket-page-object";


export class ProductViewPage {

    //variables
    private readonly addToCartButton: Locator;
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
    };   

    // methods
    async addProductToCart(productName:string) {
        await expect(this.page.locator('h1').filter({ hasText: productName }).first()).toBeVisible();
        await this.addToCartButton.click();
        return new ProductBasketPage(this.page);
    };


};
