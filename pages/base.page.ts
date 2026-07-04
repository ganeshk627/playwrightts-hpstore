import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../utils/winston-logger/logger-util';

export class BasePage {
    //variables
    protected readonly page: Page;

    //constructor
    constructor(page: Page) {
        this.page = page;
    };

    async openApplication() {
        logger.info('Starting test setup and opening application');
        logger.info(`Base URL: ${process.env.BASE_URL}`);
        await this.page.goto(`${process.env.BASE_URL}`);
        logger.info('Application opened successfully');
    }

    async waitForPageLoad(loadState: 'load' | 'domcontentloaded' | 'networkidle' = 'load', timeout: number = 30000) {
        logger.info(`Waiting for page to load ${loadState} with timeout: ${timeout}`);
        await this.page.waitForLoadState(loadState, { timeout })
            .then(() => {
                logger.info(`Page loaded ${loadState} successfully`);
            })
            .catch((error) => {
                logger.error(`Error while waiting for page load: ${error}`);
            });
    }

};
