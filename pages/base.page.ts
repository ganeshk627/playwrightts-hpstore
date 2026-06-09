import { type Locator, type Page, expect } from "@playwright/test";


export class BasePage {


    constructor(private page: Page) {
        this.page = page;
    };

    async openApplication() {
        await this.page.goto(`${process.env.BASE_URL}`);
    }

};
