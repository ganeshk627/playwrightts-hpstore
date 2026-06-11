import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../utils/winston-logger/logger-util';

export class BasePage {


    constructor(private page: Page) {
        this.page = page;
    };

    async openApplication() {
        logger.info('Starting test setup and opening application');
        logger.info(`Base URL: ${process.env.BASE_URL}`);
        await this.page.goto(`${process.env.BASE_URL}`);
        logger.info('Application opened successfully');
    }

};
