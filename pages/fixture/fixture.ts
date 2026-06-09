import { test as base, expect, type Page } from '@playwright/test';
import logger from '../../utils/winston-logger/logger-util';
import { HomePage } from '../homepage/homepage.page';
import { LoginPage } from '../login/login.page';
import { DashboardPage } from '../dashboard/dashboard.page';
import { ProductNavigationPage } from '../products/product-navigation.page';
import { ProductBasketPage } from '../products/product-basket.page';
import { ProductViewPage } from '../products/product-view.page';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { OrderHistoryPage } from '../products/checkout/order-history.page';
import { OrderDetailsPage } from '../products/checkout/order-details.page';
import testdata from '../../test-data/json/testdata.json';

/**
 * Extended test fixtures for HP Store Automation Framework
 * Provides pre-configured page objects and common test setups
 */

export type TestFixtures = {
  /**
   * Playwright Page object - provides browser context for tests
   */
  page: Page;

  /**
   * Test data loaded from JSON file
   * Use for data-driven testing and test parameterization
   */
  testdata: typeof testdata;

  /**
   * HomePage instance - initialized with page context
   * Use for testing homepage interactions
   */
  homePage: HomePage;

  /**
   * LoginPage instance - initialized with page context
   * Use for testing login flows and authentication
   */
  loginPage: LoginPage;

  forgotPasswordPage: ForgotPasswordPage;

  /**
   * DashboardPage instance - initialized with page context
   * Use for post-login dashboard interactions
   */
  dashboardPage: DashboardPage;

  /**
   * ProductNavigationPage instance - initialized with page context
   * Use for product navigation and filtering
   */
  productNavigationPage: ProductNavigationPage;

  /**
   * ProductBasketPage instance - initialized with page context
   * Use for shopping cart interactions
   */
  productBasketPage: ProductBasketPage;

  /**
   * ProductViewPage instance - initialized with page context
   * Use for individual product page interactions
   */
  productViewPage: ProductViewPage;

  /**
   * OrderHistoryPage instance - initialized with page context
   * Use for viewing order history and accessing order details
   */
  orderHistoryPage: OrderHistoryPage;

  /**
   * OrderDetailsPage instance - initialized with page context
   * Use for viewing detailed information about a specific order
   */
  orderDetailsPage: OrderDetailsPage;

  /**
   * Authenticated user fixture
   * Automatically logs in a test user before test execution
   * Returns: { page, homePage, loginPage, dashboardPage }
   * Usage: test('my test', async ({ authenticatedUser }) => { ... })
   */
  authenticatedUser: {
    page: Page;
    homePage: HomePage;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
  };

  /**
   * Fresh application state fixture
   * Navigates to home page and clears any test data
   * Returns: { page, homePage }
   * Usage: test('my test', async ({ freshState }) => { ... })
   */
  freshState: {
    page: Page;
    homePage: HomePage;
  };
};

/**
 * Test fixture: Individual page objects
 * Provides page object instances for individual page interactions
 */
export const test = base.extend<TestFixtures>({
  testdata: async ({}, use) => {
    await use(testdata);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  productNavigationPage: async ({ page }, use) => {
    const productNavigationPage = new ProductNavigationPage(page);
    await use(productNavigationPage);
  },

  productBasketPage: async ({ page }, use) => {
    const productBasketPage = new ProductBasketPage(page);
    await use(productBasketPage);
  },

  productViewPage: async ({ page }, use) => {
    const productViewPage = new ProductViewPage(page);
    await use(productViewPage);
  },

  orderHistoryPage: async ({ page }, use) => {
    const orderHistoryPage = new OrderHistoryPage(page);
    await use(orderHistoryPage);
  },

  orderDetailsPage: async ({ page }, use) => {
    const orderDetailsPage = new OrderDetailsPage(page);
    await use(orderDetailsPage);
  },

  /**
   * Fixture: Authenticated User
   * Automatically logs in before test execution
   * Usage: test('my test', async ({ authenticatedUser }) => {
   *   const { page, dashboardPage } = authenticatedUser;
   * })
   */
  authenticatedUser: async ({ page }, use) => {
    try {

      // Navigate to home
      await page.goto('/');

      // Initialize page objects
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      // Open login page
      await homePage.openLoginOrRegistrationPage();

      // Perform login
      const username = process.env.USERNAME;
      const password = process.env.PASSWORD;

      if (!username || !password) {
        throw new Error('USERNAME and PASSWORD environment variables are required');
      }

      await loginPage.login(username, password);

      // Verify dashboard is loaded (look for URL to confirm login state)
      await expect(page).toHaveURL(/.*\/(home)?$/i, { timeout: 10000 });

      // Provide authenticated context to test
      await use({
        page,
        homePage,
        loginPage,
        dashboardPage,
      });

    } catch (error) {
      logger.error(`Authentication fixture failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  },

  /**
   * Fixture: Fresh Application State
   * Navigates to home page with clean session
   * Usage: test('my test', async ({ freshState }) => {
   *   const { page, homePage } = freshState;
   * })
   */
  freshState: async ({ page }, use) => {
    try {

      // Clear cookies and local storage to start fresh
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Navigate to home page
      await page.goto('/');

      // Initialize home page object
      const homePage = new HomePage(page);

      // Verify home page is loaded
      await expect(page).toHaveURL(/\//);

      // Provide fresh state to test
      await use({
        page,
        homePage,
      });

    } catch (error) {
      logger.error(`Fresh state fixture failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  },
});

/**
 * Export expect for use in tests with fixtures
 * Usage: import { test, expect } from '../../pages/fixture/fixture';
 */
export { expect };

/**
 * Usage Examples:
 *
 * 1. Using individual page objects:
 *    test('Homepage navigation', async ({ homePage, page }) => {
 *      await page.goto('/');
 *      await homePage.openLoginOrRegistrationPage();
 *    });
 *
 * 2. Using authenticated user fixture:
 *    test('Dashboard after login', async ({ authenticatedUser }) => {
 *      const { dashboardPage } = authenticatedUser;
 *      await dashboardPage.verifyWelcomeMessage();
 *    });
 *
 * 3. Using fresh state fixture:
 *    test('Fresh state test', async ({ freshState }) => {
 *      const { homePage, page } = freshState;
 *      await homePage.openLoginOrRegistrationPage();
 *    });
 *
 * 4. Combining multiple fixtures:
 *    test('Complete user flow', async ({ homePage, loginPage, dashboardPage, page }) => {
 *      await page.goto('/');
 *      await homePage.openLoginOrRegistrationPage();
 *      await loginPage.login('user@example.com', 'password123');
 *      await dashboardPage.verifyWelcomeMessage();
 *    });
 */
