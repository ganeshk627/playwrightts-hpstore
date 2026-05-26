import { type Locator, type Page, expect} from "@playwright/test";
import { ProductBasketPage } from "./product-basket-page-object";


export class ProductViewPage {

    //variables
    private readonly addToCartButton: Locator;
  


    //constructor
    constructor (private page:Page) {
        this.page = page;
        this.addToCartButton = page.getByRole('link', { name: 'Add to Cart' });
    };   

    // methods
    async addProductToCart(productName:string) {
        await expect(this.page.locator('h1.productname')).toContainText(productName);
        await this.addToCartButton.click();
        return new ProductBasketPage(this.page);
    };


};
