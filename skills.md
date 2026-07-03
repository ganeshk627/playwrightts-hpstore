# Playwright TypeScript Automation Framework - Reusable Skills

## Skill 1: Page Object Model Implementation

### Description
Create and maintain page objects following the framework's Page Object Model pattern. Each page has two potential files: a page class (in `pages/`) with Playwright interactions, and a page object class (in `pages/`) with business logic.

### When to Use
- Creating new page objects for new features
- Updating existing page objects with new methods
- Extracting locators from tests into page objects
- Refactoring page interactions for maintainability

### Key Files
- `pages/` - Locator definitions and direct Playwright operations (optional, for complex pages)
- Example: `pages/login/login.page.ts` contains LoginPage class

### Implementation Pattern
```typescript
// pages/[feature]/[feature].page.ts
import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';

export class [FeatureName]Page {
    private readonly [locatorName]: Locator;
    private readonly [anotherLocator]: Locator;
    
    constructor(private page: Page) {
        this.[locatorName] = page.getByRole('button', { name: 'Action' });
        this.[anotherLocator] = page.locator('input[type="email"]');
    }
    
    async [actionMethod](param: string) {
        await this.[locatorName].click();
        logger.info('Action completed');
        return new NextPage(this.page);  // Support chaining
    }
    
    async [validationMethod]() {
        await expect(this.[locatorName]).toBeVisible();
        logger.info('Validation passed');
    }
}
```

### Key Patterns
- Use `page.getByRole()` for accessible locators (preferred)
- Use `page.locator()` for complex CSS/XPath selectors
- Always use Winston logger for significant actions
- Return page objects from methods to support method chaining
- Export concrete classes (not interfaces)
- Use `expect()` from @playwright/test for assertions
- Keep methods focused and single-purpose

### Directory Structure
```
pages/
├── dashboard/
│   └── dashboard.page.ts
├── login/
│   └── login.page.ts
├── homepage/
│   └── homepage.page.ts
├── forgot-password/
│   └── forgot-password.page.ts
└── products/
    ├── product-view.page.ts
    ├── product-basket.page.ts
    ├── product-navigation.page.ts
    └── checkout/
        ├── checkout-payment.page.ts
        ├── checkout-confirmation.page.ts
        └── checkout-success.page.ts
```

---

## Skill 2: Test Creation and Organization

### Description
Create new test files following the framework's naming and organizational conventions. Tests are organized by type: smoke, regression, and inspections.

### When to Use
- Adding new smoke tests for critical paths
- Creating regression test suites for features
- Adding inspection/validation tests
- Expanding test coverage

### Naming Convention
- Format: `TC_{TYPE}_{FEATURE}_{NUMBER}_descriptive-name-test.ts`
- Types: 
  - `SM` = Smoke tests (critical path validation)
  - `RG` = Regression tests (full feature testing)
  - `IN` = Inspection tests (validation & checks)
- Example: 
  - `TC_SM_001_login-test.ts` 
  - `TC_RG_AC_002_order-makeup-products-test.ts`
  - `inspect-homepage-test.ts` (inspections don't need TC prefix)

### File Organization
```
tests/
├── smoke/                              # Quick smoke/critical path tests
│   ├── TC_SM_001_login-test.ts
│   ├── TC_SM_002_forgot-password-test.ts
│   └── TC_SM_003_add-a-makeup-product-test.ts
│
├── regression/                         # Full feature regression suites
│   └── add-to-cart/
│       ├── TC_RG_AC_001_add-makeup-products-test.ts
│       ├── TC_RG_AC_002_order-makeup-products-test.ts
│       └── TC_RG_AC_003_add-and-clear-makeup-products-test.ts
│
└── inspections/                        # Validation & inspection tests
    ├── inspect-homepage-test.ts
    ├── inspect-login-test.ts
    └── inspect-forgot-password-test.ts
```

### Test Structure Pattern
```typescript
import { test, expect, type Page } from '@playwright/test';
import { HomePage } from '../../pages/homepage/homepage.page';
import { LoginPage } from '../../pages/login/login.page';
import { AddMakeupProductsPage } from '../../pages/add-to-cart/add-makeup-products.page';
import logger from '../../utils/winston-logger/logger-util';

test('Descriptive test name explaining what is tested @smoke', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const addMakeupProductsPage = new AddMakeupProductsPage(page);
    
    await test.step('Setup: Navigate to application', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
    });
    
    await test.step('Setup: Perform login', async () => {
        await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        logger.info('Successfully logged in');
    });
    
    await test.step('Action: Perform main action', async () => {
        await addMakeupProductsPage.performAction();
        logger.info('Action completed');
    });
    
    await test.step('Assert: Verify results', async () => {
        await expect(page).toHaveURL(/.*\/expected.page/);
        await expect(page.locator('selector')).toBeVisible();
    });
});
```

### Best Practices
- Use `test.step()` to organize test flow into logical sections
- Include descriptive tags: `@smoke`, `@regression`, `@inspection`
- Use `logger.info()` for all significant actions
- One logical test scenario per file
- Use `expect()` from @playwright/test for assertions
- Reference environment variables: `process.env.USERNAME`, `process.env.PASSWORD`, etc.
- Use page objects instead of inline selectors
- Avoid hardcoded test data (use environment variables or test-data files)
- Keep test flow clear and easy to follow

---

## Skill 3: Test Data Management

### Description
Manage and utilize JSON-based test data for parameterized tests and fixtures. Test data is centralized in `test-data/json/` directories and loaded as needed by tests.

### When to Use
- Creating parameter-driven tests
- Storing product/entity test data
- Managing test fixtures and scenarios
- Using fake/generated data with faker-js

### Test Data Structure
```
test-data/
└── json/
    ├── products/
    │   └── makeup-products.json
    └── [other-data]/
        └── [data-file].json
```

### JSON Format Example for Products
```json
[
    {
        "productCategory": "Makeup",
        "productType": "Face",
        "productNames": ["Delicate Oil-Free Powder Blush"]
    },
    {
        "productCategory": "Makeup",
        "productType": "Cheeks",
        "productNames": ["Skinsheen Bronzer Stick", "Benefit Bella Bamba"]
    },
    {
        "productCategory": "Makeup",
        "productType": "Eyes",
        "productNames": ["Waterproof Protective Undereye Concealer"]
    }
]
```

### Usage Pattern - Static Test Data
```typescript
import * as productsData from '../../test-data/json/products/makeup-products.json';
import logger from '../../utils/winston-logger/logger-util';

test('Product iteration test', async ({ page }) => {
    const products = productsData;
    
    await test.step('Loop through products', async () => {
        for (const product of products) {
            logger.info(`Testing product type: ${product.productType}`);
            // Use product.productCategory, product.productNames[0], etc.
        }
    });
});
```

### Faker-js Integration - Dynamic Test Data
```typescript
import { faker } from '@faker-js/faker';
import logger from '../../utils/winston-logger/logger-util';

test('Registration with fake data', async ({ page }) => {
    const testEmail = faker.internet.email();
    const testPassword = faker.internet.password({ length: 12 });
    const testName = faker.person.fullName();
    
    await test.step('Generate and use test data', async () => {
        logger.info(`Generated email: ${testEmail}`);
        logger.info(`Generated name: ${testName}`);
        // Register with generated data
    });
});
```

### Test Data Best Practices
- Store static data in JSON files in `test-data/json/`
- Use faker-js for random/dynamic data
- Document data structure with comments
- Keep sensitive data (passwords) in .env files, not JSON
- Organize data by category (products/, users/, orders/)
- Use descriptive filenames matching data content
- Avoid hardcoded test data in test files

---

## Skill 4: Environment Configuration Management

### Description
Manage multi-environment testing through dotenv configuration files. Supports different environments (dev, qa, automation) with environment-specific settings.

### When to Use
- Running tests against different environments
- Managing credentials securely
- Configuring base URLs per environment
- Setting up environment-specific parameters
- CI/CD pipeline testing

### Environment Files Location & Setup
```
environments/
├── .env.local        # Local development environment
├── .env.qa           # QA/staging environment
└── .env.automation   # Automation/CI environment
```

### Supported Environment Variables
```
# Application URL
URL=https://target-url.com

# User credentials
USERNAME=test@example.com
PASSWORD=testpassword123
EMAIL=alternative@example.com

# Additional environment-specific settings
[ADD_MORE_AS_NEEDED]=value
```

### Environment File Examples

**.env.dev** (Development)
```
URL=http://localhost:3000
USERNAME=dev-user@example.com
PASSWORD=dev-password123
EMAIL=dev-email@example.com
```

**.env.qa** (QA/Staging)
```
URL=https://qa.target-app.com
USERNAME=qa-user@example.com
PASSWORD=qa-password123
EMAIL=qa-email@example.com
```

**.env.automation** (CI/Automation)
```
URL=https://automation.target-app.com
USERNAME=automation-user@example.com
PASSWORD=automation-password123
EMAIL=automation-email@example.com
```

### Running Tests by Environment
```bash
npm run test                    # Default (uses .env.local)
npm run test:env:dev            # Explicit dev environment
npm run test:env:qa             # QA environment
npm run test:env:automation     # Automation environment - use in CI
```

### Loading Environment Variables in Tests
```typescript
// Automatically loaded from .env based on ENV variable
// No manual loading needed - available in process.env

const username = process.env.USERNAME;
const baseUrl = process.env.BASE_URL;
const password = process.env.PASSWORD;

await loginPage.login(username!, password!);
await page.goto('/');  // Uses baseURL from playwright.config
```

### Configuration in playwright.config.ts
The framework automatically loads the correct .env file:
```typescript
// playwright.config.ts
if (!process.env.ENV) {
  require("dotenv").config({
    override: true,
    path: `${__dirname}//environments//.env.local`
  });
} else {
  require("dotenv").config({
    override: true,
    path: `${__dirname}//environments//.env.${process.env.ENV}`
  });
}

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,  // Automatically set from .env
  }
});
```

### Best Practices
- Never commit .env files with real credentials
- Add `environments/.env*` to `.gitignore`
- Document required environment variables
- Use different credentials per environment
- Validate environment variables are set at test startup
- Use environment-specific URLs and test accounts
- Securely manage CI/CD environment variables

---

## Skill 5: Logging and Reporting

### Description
Use Winston logger for consistent logging throughout tests and page objects. Allure and HTML reporters capture test execution details for analysis.

### When to Use
- Logging test execution flow and actions
- Debugging complex test failures
- Generating comprehensive test reports
- Adding context to test execution
- Tracking test performance

### Winston Logger Usage

**Import Logger in Tests and Page Objects**
```typescript
import logger from '../../utils/winston-logger/logger-util';
```

**Logger Methods**
```typescript
// Information level - for important actions
logger.info('User logged in successfully');
logger.info(`Navigated to ${await page.url()}`);

// Error level - for failures and exceptions
logger.error('Login failed - invalid credentials');
logger.error(`Element not found: ${error.message}`);

// Warning level - for potential issues
logger.warn('Element not found, retrying with fallback selector');
logger.warn('Slow page load detected');
```

**Logger in Page Objects**
```typescript
export class LoginPage {
    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        logger.info('Entered email address');
        
        await this.passwordInput.fill(password);
        logger.info('Entered password');
        
        await this.signInBtn.click();
        logger.info('Clicked sign in button');
    }
}
```

**Logger in Tests**
```typescript
test('Login test', async ({ page }) => {
    await test.step('Navigate to login', async () => {
        await page.goto('/');
        logger.info(`Navigated to ${await page.url()}`);
    });
    
    await test.step('Perform login', async () => {
        const loginPage = new LoginPage(page);
        await loginPage.login('user@example.com', 'password');
        logger.info('Login completed successfully');
    });
});
```

### Allure Reporter Integration

**Configuration (in playwright.config.ts)**
```typescript
reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ["allure-playwright"]
]
```

**Features**
- Automatic test execution logging
- Logs preserved in Allure reports
- Screenshots captured on test failure
- Traces collected on first retry
- Video recording available (currently disabled)
- Test categorization and filtering

**Viewing Reports**
```bash
npm test                    # Runs tests and generates reports
# Opens: playwright-report/index.html (local)
# Generates: allure-results/ (for Allure dashboard)
```

### HTML Report
- Generated automatically in `playwright-report/`
- Contains test execution details
- Screenshots and traces for failed tests
- Test duration and status
- Open with: `npx playwright show-report`

### Best Practices for Logging
- Log at the start of significant actions
- Include relevant context (URLs, values, identifiers)
- Use appropriate log levels (info, warn, error)
- Avoid logging sensitive information (passwords, tokens)
- Keep log messages concise and descriptive
- Use logger in both tests and page objects
- Include logger calls in custom utilities

---

## Skill 6: Multi-Browser and Multi-Environment Testing

### Description
Configure and run tests across multiple browsers and environments. Framework supports Chrome, Chromium, Firefox, and WebKit browsers with unified test execution.

### Browser Projects Configuration
The framework supports testing on these browsers:

**Available Browsers**
- `chrome` - Chrome browser channel (latest)
- `chromium` - Chromium browser (open source)
- `firefox` - Firefox browser
- `webkit` - Safari/WebKit browser

### Configuration in playwright.config.ts
```typescript
projects: [
    {
        name: 'chrome',
        use: {
            ...devices['Desktop Chrome'],
            channel: 'chrome'  // Uses installed Chrome
        },
    },
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
    },
    {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
    },
]
```

### Running Tests by Browser
```bash
npm test                                  # All browsers
npm run test:chrome                      # Chrome only
npx playwright test --project=firefox    # Firefox only
npx playwright test --project=webkit     # WebKit only
npx playwright test --project=chromium   # Chromium only

# Multiple specific browsers
npx playwright test --project=chrome --project=firefox
```

### Running with Environment and Browser
```bash
ENV=qa npm run test:chrome               # QA environment, Chrome browser
ENV=automation npx playwright test       # Automation environment, all browsers
```

### Parallel Execution Configuration (from playwright.config.ts)
```typescript
fullyParallel: true,        // Tests run in parallel
workers: process.env.CI ? 1 : undefined,  // Serial on CI, parallel locally

timeout: 60000,             // 60 second test timeout

retries: process.env.CI ? 2 : 0,  // 2 retries on CI, 0 locally
```

### Screenshots and Trace Configuration
```typescript
use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',      // Trace on retry
    screenshot: 'only-on-failure', // Screenshot on failure
    video: 'off'                   // Video disabled (set to 'retain-on-failure' to enable)
}
```

### Cross-Browser Best Practices
- Test critical paths on all major browsers
- Use accessible selectors (getByRole()) for better cross-browser compatibility
- Handle browser-specific behaviors with feature detection
- Test on different screen sizes / viewports
- Document browser-specific issues
- Use CI/CD for automated cross-browser testing
- Run smoke tests on all browsers, regressions on primary browser

---

## Skill 7: Test Failure Diagnosis and Healing

### Description
Diagnose and fix common test failures and flakiness issues. Includes strategies for element locators, timing, environment configuration, and test stability.

### Common Issues & Solutions

#### Issue: Element Not Found
**Symptoms:** Error: "locator.click: Target page, context or browser has been closed"

**Solution Steps:**
```typescript
// STEP 1: Use more stable selectors
// Avoid: CSS selectors that depend on structure
await page.locator('.btn-123').click();  // Bad

// Prefer: Accessible role-based selectors
await page.getByRole('button', { name: 'Login' }).click();  // Good

// Fallback: XPath with text content
await page.locator('//button[contains(text(), "Login")]').click();

// STEP 2: Add visibility check before interaction
await expect(element).toBeVisible();
await element.click();

// STEP 3: Use page.waitForLoadState()
await page.goto('/');
await page.waitForLoadState('networkidle');
await component.click();
```

#### Issue: Timing and Flakiness
**Symptoms:** Test passes sometimes, fails randomly

**Solution Strategy:**
```typescript
// AVOID: Explicit waits (bad practice)
await page.waitForTimeout(2000);  // Don't do this!

// PREFER: Playwright's auto-waiting
// Playwright waits up to 30 seconds by default for elements
await element.click();  // Waits for element to be ready
await expect(element).toBeVisible();  // Waits for visibility

// For AJAX/network waits:
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => /* condition */);

// For navigation waits:
await page.waitForNavigation();  // or combined:
await Promise.all([
    page.waitForNavigation(),
    page.click('button')
]);
```

**Increase Timeout for Slow Tests**
```typescript
test('Slow test', { timeout: 120000 }, async ({ page }) => {
    // Test with 120 second timeout (instead of default 60)
});

// Or in playwright.config.ts:
timeout: 120000,  // Set globally
```

#### Issue: Selectors Changed After UI Update
**Symptoms:** "locator.click: No element matches the selector"

**Solution:**
```typescript
// Identify the changed selector by:
// 1. Running: npx playwright codegen [URL]
// 2. Inspecting element in browser
// 3. Using Playwright Inspector: npx playwright test --debug

// Update page object with new selector:
export class UpdatedPage {
    private readonly submitBtn: Locator;
    
    constructor(private page: Page) {
        // OLD: this.submitBtn = page.locator('#old-submit-id');
        // NEW: Use new accessible selector
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
    }
}
```

#### Issue: Environment URL or Credentials Wrong
**Symptoms:** Tests navigate to wrong URL, login fails

**Solution:**
```bash
# Verify environment variable is set
echo $ENV
# Should output: dev | qa | automation | (blank for default)

# Check .env file content:
cat environments/.env.${ENV:-dev}
# Verify URL and credentials are correct

# Run with explicit environment:
ENV=qa npm test
```

#### Issue: Test Only Fails on CI
**Symptoms:** Test passes locally, fails in CI/GitHub Actions

**Solution Steps:**
```typescript
// 1. Check parallel execution differences:
// CI runs: workers: 1 (serial)
// Local: workers: undefined (parallel)

// 2. Add explicit waits for CI:
await page.waitForLoadState('domcontentloaded');

// 3. Increase timeout for CI:
test('CI-stable test', { timeout: 120000 }, async ({ page }) => {
    // Longer timeout for CI environments
});

// 4. Debug with trace:
// Enabled in config: trace: 'on-first-retry'
// View with: npx playwright show-trace trace.zip
```

#### Issue: Cross-Browser Failure
**Symptoms:** Test fails only on Firefox/Safari

**Solution:**
```typescript
// Detect browser and use browser-specific handling:
test('Cross-browser test', async ({ page, browserName }) => {
    if (browserName === 'firefox') {
        // Firefox-specific workaround
        await page.locator('css-selector-firefox').click();
    } else {
        // Chrome/Safari
        await page.locator('css-selector-default').click();
    }
});

// Or add browser-specific selectors to page object:
private getSelectElement(): Locator {
    if (this.page.context().browser?.browserType.name() === 'firefox') {
        return this.page.locator('.firefox-select');
    }
    return this.page.locator('.default-select');
}
```

### Diagnosis Process
1. **Read error message** - Often clearly indicates the problem
2. **Check selector** - Verify element exists with `npx playwright codegen`
3. **Review timing** - Add `waitForLoadState()` if needed
4. **Validate environment** - Confirm .env file and URL correct
5. **Test in isolation** - Run single test to eliminate flakiness
6. **Add logging** - Insert logger.info() to track execution
7. **View trace** - Use `npx playwright show-trace` for detailed replay

---

## Skill 8: Page Object Verification and Refactoring

### Description
Verify page object health, identify issues, and refactor for better maintainability and stability.

### Verification Checklist for Page Objects
- [ ] All locators are defined in page object (not in tests)
- [ ] All public methods have logger.info() calls
- [ ] Method names use verb + noun pattern (login(), fillEmail(), submitForm())
- [ ] Locators use getByRole() as primary selector
- [ ] No hardcoded waits (test.step(), expect() instead)
- [ ] Methods return page objects when appropriate for chaining
- [ ] Expect statements for validations have descriptive messages
- [ ] No duplicate methods or logic
- [ ] Private locators are readonly
- [ ] Constructor properly initializes all locators

### Health Check Commands
```bash
# Run all tests to verify page object behavior
npm test

# Debug specific page object in Chrome
npm run test:chrome

# Generate new selectors interactively
npx playwright codegen https://target-app.com

# Debug test with inspector
npx playwright test --debug

# Show trace from last failure
npx playwright show-trace trace.zip
```

### Refactoring Example

**BEFORE: Test with inline selectors (bad)**
```typescript
test('Product purchase', async ({ page }) => {
    await page.locator('input[name="email"]').fill('user@test.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('button#submit').click();
    await page.locator('//div[@class="success-message"]').waitFor();
    
    await page.locator('text=Products').click();
    await page.locator('[data-product-id="123"]').click();
    await page.locator('button:has-text("Add to Cart")').click();
    
    await page.locator('text=Checkout').click();
});
```

**AFTER: Using page objects (good)**
```typescript
test('Product purchase', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await test.step('Login', async () => {
        await loginPage.login('user@test.com', 'password123');
    });
    
    await test.step('Add product to cart', async () => {
        await productsPage.searchProduct('Product Name');
        await productsPage.addProductToCart(123);
    });
    
    await test.step('Proceed to checkout', async () => {
        await cartPage.proceedToCheckout();
    });
});
```

### Refactoring Anti-Patterns

**Anti-Pattern 1: Methods too large**
```typescript
// BEFORE: Too much in one method
async purchaseProduct(productId: number, quantity: number) {
    await this.navigateToProducts();
    await this.searchProduct('name');
    await this.addProductToCart(productId, quantity);
    await this.navigateToCart();
    await this.fillShippingAddress();
    await this.selectShippingMethod();
    await this.fillPaymentDetails();
    await this.submitOrder();
}

// AFTER: Break into focused methods
async navigateToProducts() { /* */ }
async searchProduct(name: string) { /* */ }
async addProductToCart(id: number, qty: number) { /* */ }
// ... separate methods for each concern
```

**Anti-Pattern 2: Duplicated locators**
```typescript
// BEFORE: Locator defined multiple times
async submitForm1() { await page.locator('button[type="submit"]').click(); }
async submitForm2() { await page.locator('button[type="submit"]').click(); }

// AFTER: Single locator definition, used multiple times
private readonly submitBtn: Locator = page.locator('button[type="submit"]');
async submitForm1() { await this.submitBtn.click(); }
async submitForm2() { await this.submitBtn.click(); }
```

---

## Skill 9: CI/CD Integration

### Description
Configure and optimize tests for CI/CD pipeline execution. Includes GitHub Actions, Jenkins, or other CI systems.

### CI Configuration in playwright.config.ts
```typescript
export default defineConfig({
    retries: process.env.CI ? 2 : 0,      // 2 retries only on CI
    workers: process.env.CI ? 1 : undefined,  // Serial on CI, parallel locally
    forbidOnly: !!process.env.CI,         // Fail build if test.only() remains
});
```

### CI Environment Setup
```bash
# In CI pipeline, set environment variable
ENV=automation npm test
# or
CI=true npm run test:env:automation
```

### CI Commands
```bash
# Standard test run with CI settings
CI=true npm test

# Specific environment
CI=true npm run test:env:automation

# Specific browser on CI
CI=true npx playwright test --project=chrome
```

### Artifacts and Reporting
```
Generated artifacts:
- playwright-report/     # HTML report (view locally)
- test-results/          # Test results and screenshots
- allure-results/        # Allure reporting data
```

### GitHub Actions Example Workflow
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: ENV=automation npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Best Practices for CI/CD
- Use automation environment (.env.automation) for CI
- Set CI=true environment variable
- Run on serial workers (workers: 1) for consistency
- Capture and upload test artifacts
- Use Allure or HTML reporting for visibility
- Implement test result notifications
- Clear stale test-results/ before run
- Archive reports for trend analysis

---

## Skill 10: Utility Functions and Custom Tools

### Description
Use framework utilities for common operations. Includes Winston logger, JSON utilities, and custom helpers.

### Winston Logger Utility

**Location:** `utils/winston-logger/logger-util.ts`

**Import:**
```typescript
import logger from '../../utils/winston-logger/logger-util';
```

**Available Methods:**
```typescript
logger.info('Information message');      // Info level logging
logger.error('Error message');            // Error level logging
logger.warn('Warning message');           // Warning level logging
```

**When to Use:**
```typescript
// Use in page objects
async login(username: string) {
    await this.emailInput.fill(username);
    logger.info(`Entered username: ${username}`);
}

// Use in tests
await test.step('Login', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.login('user@test.com');
    logger.info('Login successful');
});

// Use for errors
try {
    await element.click();
} catch (error) {
    logger.error(`Failed to click element: ${error.message}`);
}
```

### JSON Utility

**Location:** `utils/json-util/json-util.ts`

**Usage:**
```typescript
import * as testData from '../../test-data/json/products/makeup-products.json';

// Load and iterate test data
for (const product of testData) {
    logger.info(`Processing: ${product.productCategory}`);
}
```

### Framework Files - When to Clean Up
```
# Test result artifacts (can be cleaned before fresh run):
test-results/              # Delete for fresh results
playwright-report/         # Generated new each run

# Keep (version controlled):
pages/             # Page object library
tests/                    # Test files
test-data/               # Test data files
environments/             # Environment configs
utils/                   # Utility functions
```

### Cleanup Command
```bash
# Remove old test artifacts before running tests
rm -rf test-results playwright-report

# Then run tests
npm test
```

### Custom Utilities Best Practices
- Create utilities in `utils/` directory
- Export as default or named exports
- Document usage in JSDoc comments
- Keep utilities focused and single-purpose
- Reuse existing utilities before creating new ones
- Version control utility code
- Test utility functions with unit tests if complex

---

## Framework Scripts and Commands Reference

### Common Commands
```bash
# Run all tests (default dev environment)
npm test

# Run tests on specific browser
npm run test:chrome

# Run tests on specific environment
npm run test:env:dev
npm run test:env:qa
npm run test:env:automation

# Debug and view reports
npx playwright show-report           # View HTML report
npx playwright show-trace trace.zip  # View trace debug info
npx playwright codegen [URL]         # Generate selectors

# Run specific test file
npx playwright test tests/smoke/TC_SM_001_login-test.ts

# Run tests matching pattern
npx playwright test --grep @smoke

# Run with debug mode
npx playwright test --debug
```

### Environment Variable Reference
```
# Required variables in .env files:
URL              - Application base URL
USERNAME         - Test user username
PASSWORD         - Test user password
EMAIL            - Test user email address
ENV              - Environment type (dev|qa|automation)

# Used automatically by playwright.config.ts
CI               - Set by CI systems (GitHub Actions, Jenkins, etc.)
```

---

## Summary: Quick Reference by Task

| Task | Skill | Key Command |
|------|-------|-------------|
| Create new page object | Skill 1 | Create in `pages/` |
| Write new test | Skill 2 | Follow `TC_TYPE_FEATURE_NUMBER` naming |
| Add test data | Skill 3 | Create in `test-data/json/` |
| Configure environment | Skill 4 | Update `.env.{environment}` |
| Debug with logging | Skill 5 | Use `logger.info()` |
| Cross-browser testing | Skill 6 | `npm test` or specify `--project` |
| Fix failing test | Skill 7 | Check selector and timing |
| Refactor page object | Skill 8 | Follow verification checklist |
| Run in CI | Skill 9 | Set `ENV=automation`, `CI=true` |
| Use utilities | Skill 10 | Import from `utils/` |

