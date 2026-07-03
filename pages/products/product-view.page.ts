import { type Locator, type Page, expect } from "@playwright/test";
import { ProductBasketPage } from "./product-basket.page";
import logger from "../../utils/winston-logger/logger-util";


export class ProductViewPage {

    //variables
    private readonly addToCartButton: Locator;



    //constructor
    constructor(private page: Page) {
        this.page = page;
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
    };

    // methods
    async addProductToCart(productName: string, size?: 'S' | 'M' | 'L' | 'XL' | 'XXL', color?: string) {
        await expect(this.page.locator('h1').filter({ hasText: productName }).first()).toBeVisible();
        logger.info(`Product page loaded for: ${productName}`);
        
        if (size) {
            await this.page.getByRole('button', { name: size, exact: true }).click({delay: 1000});
            logger.info(`Selected size: ${size}`);
        }
        
        if (color) {
            await this.page.locator('label').filter({ hasText: new RegExp(`^\\s*${color}\\s*$`) }).locator('input[type="radio"]').check();
            logger.info(`Selected color: ${color}`);
        }
        
        await this.addToCartButton.click({delay: 2000});
        logger.info(`Clicked 'Add To Cart' button for product: ${productName}`);
        return new ProductBasketPage(this.page);
    };


};
