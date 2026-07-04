---
mode: agent
---

# Playwright MCP Test Generator and Healer

Use this prompt when you need to create new Playwright scripts from scratch or repair existing ones in this framework using Playwright MCP.

## Purpose

Generate or heal Playwright TypeScript automation scripts that fit the conventions in this repository. Prefer using Playwright MCP to inspect the live application, discover stable locators, and validate flows before writing or editing code.

## Framework Directory Structure & File Organization

### Page Objects (Where: `pages/[feature]/`)
- **Location**: `pages/[feature]/[feature].page.ts`
- **Pattern**: One page object class per feature/page
- **Structure**:
  ```
  pages/
  ├── login/login.page.ts
  ├── dashboard/dashboard.page.ts
  ├── products/product-view.page.ts
  └── add-to-cart/add-to-cart.page.ts
  ```
- **Content**: Locator definitions + business logic methods
- **Imports**: Always import `logger` from `../../utils/winston-logger/logger-util`
- **Selectors**: Use `getByRole()` primarily, fallback to `getByLabel()`, `getByPlaceholder()`, then CSS/XPath
- **Methods**: Return page objects for chaining; include `logger.info()` calls

### Tests (Where: `tests/[type]/`)
- **Location**: Organized by type:
  - Smoke tests: `tests/smoke/TC_SM_[NUMBER]_[feature]-test.ts`
  - Regression tests: `tests/regression/[feature]/TC_RG_[FEATURE]_[NUMBER]_[scenario]-test.ts`
  - Inspection tests: `tests/inspections/inspect-[feature]-test.ts`
- **Naming Convention**: `TC_{TYPE}_{FEATURE}_{NUMBER}_descriptive-name-test.ts`
  - `SM` = Smoke (critical path)
  - `RG` = Regression (comprehensive feature testing)
  - `IN` = Inspection (validation/verification)
- **Structure**:
  ```
  tests/
  ├── smoke/
  │   ├── TC_SM_001_login-test.ts
  │   └── TC_SM_002_forgot-password-test.ts
  ├── regression/
  │   └── add-to-cart/
  │       ├── TC_RG_AC_001_add-makeup-products-test.ts
  │       └── TC_RG_AC_002_order-makeup-products-test.ts
  └── inspections/
      └── inspect-homepage-test.ts
  ```
- **Content**: Test logic with `test.step()` organization, fixtures for page objects
- **Assertions**: Must be in page objects (not in test files) for maintainability
- **Logging**: Import and use `logger` from `../../utils/winston-logger/logger-util`

### Test Data (Where: `test-data/json/[category]/`)
- **Location**: `test-data/json/[category]/[file].json`
- **Organization**:
  ```
  test-data/
  └── json/
      ├── products/makeup-products.json
      ├── users/test-accounts.json
      └── orders/order-scenarios.json
  ```
- **Usage**: Import JSON directly or use faker-js for dynamic data
- **Pattern**: JSON arrays with structured objects (see skills.md for examples)

### Environment Configuration (Where: `environments/`)
- **Location**: `environments/.env.{local|qa|automation}`
- **Variables**: `URL`, `USERNAME`, `PASSWORD`, `EMAIL`, and custom variables
- **Access in Code**: `process.env.USERNAME`, `process.env.URL`, etc.
- **Files**:
  ```
  environments/
  ├── .env.local      # Local development
  ├── .env.qa         # QA/Staging environment
  └── .env.automation # CI/Automation environment
  ```

### Utilities & Logging (Where: `utils/`)
- **Logger**: Import from `../../utils/winston-logger/logger-util`
- **Custom Helpers**: Place in `utils/` directory as needed
- **Fixtures**: Configure in `playwright.config.ts` for page object injection

## What to do

### When Creating New Scripts:

1. **Determine Test Type**:
   - Smoke test? → Use `tests/smoke/TC_SM_NNN_*.ts`
   - Regression? → Use `tests/regression/[feature]/TC_RG_FEATURE_NNN_*.ts`
   - Inspection? → Use `tests/inspections/inspect-*.ts`

2. **Create or Update Page Object**:
   - Location: `pages/[feature]/[feature].page.ts`
   - Add locators as private readonly fields using `getByRole()` selectors
   - Add methods for each business action
   - Include `logger.info()` for significant actions
   - Return `this` from methods to enable chaining

3. **Create Test File**:
   - Location: Follow test type directory structure
   - Use naming: `TC_TYPE_FEATURE_NUMBER_name-test.ts`
   - Import page objects and logger
   - Structure with `test.step()` for clarity
   - Use page object fixtures (not inline page creation)
   - Add `@smoke`, `@regression`, or `@inspection` tags
   - Use environment variables: `process.env.USERNAME`, `process.env.URL`
   - Put all `expect()` assertions in page objects (not test file)

4. **Add Test Data if Needed**:
   - Location: `test-data/json/[category]/[file].json`
   - Structure as JSON arrays with consistent object schema
   - Use faker-js for dynamic data generation in tests

### When Healing Existing Scripts:

1. **Identify the Root Cause**:
   - Selector drift? → Element class/ID changed
   - Text change? → UI button/message text updated
   - Timing issue? → Add `waitForLoadState()` or remove hardcoded waits
   - Environment? → Verify `.env.*` file has correct URL/credentials
   - Cross-browser? → Check browser-specific handling needed

2. **Locate the Issue**:
   - **Selector Problem**: Update locators in page object (`pages/[feature]/[feature].page.ts`)
   - **Test Logic**: Update test file or page object method
   - **Timing**: Replace hardcoded waits with Playwright auto-waiting or `waitForLoadState()`
   - **Environment**: Update `environments/.env.{env}` with correct values

3. **Minimal Fix Approach**:
   - Update only what's broken (don't refactor entire page object)
   - Preserve existing method signatures and behavior
   - Keep logging patterns consistent
   - Maintain selector priority: `getByRole()` → `getByLabel()` → CSS → XPath

4. **Use Playwright MCP to Validate**:
   - Inspect the application flow
   - Discover current locators and messages
   - Test the fixed flow end-to-end
   - Verify cross-browser compatibility if applicable

## Selectors Priority (Best to Worst)

1. **`page.getByRole()`** - Most accessible, most stable
2. **`page.getByLabel()`** - For form fields with labels
3. **`page.getByPlaceholder()`** - For input placeholders
4. **`page.getByText()`** - For visible text (avoid if text is dynamic)
5. **`page.getByTestId()`** - For elements with data-testid
6. **CSS selectors** - Less stable, avoid if possible
7. **XPath** - Last resort, most fragile

## Quality Rules

- **Reuse page objects** where possible; don't create duplicate locators
- **No hardcoded waits** - Use `page.waitForLoadState()` or Playwright auto-waiting
- **No `expect()` in tests** - Move all assertions to page object methods
- **Consistent logging** - Use `logger.info()` for major actions
- **Environment variables** - Never hardcode URLs or credentials
- **Test data** - Use `test-data/json/` or faker-js, not hardcoded values
- **Method chaining** - Return page objects from methods when logical
- **Single responsibility** - One test scenario per file, one action per method

## Output Expectations

When creating or healing a script, provide:

1. **Updated/New Test File** - Path: `tests/[type]/TC_TYPE_FEATURE_NUMBER_*.ts`
2. **Updated/New Page Object** - Path: `pages/[feature]/[feature].page.ts` (if needed)
3. **Test Data File** - Path: `test-data/json/[category]/[file].json` (if needed)
4. **Environment Updates** - Path: `environments/.env.*` (if needed)
5. **Brief Explanation** - What was changed and why
6. **Validation Notes** - How the fix was validated (locators discovered, cross-browser tested, etc.)
7. **Follow-up Actions** - Any remaining work or recommendations

## Example Invocation

- **Create**: New smoke test for login and dashboard validation
  - Creates: `tests/smoke/TC_SM_001_login-test.ts` + `pages/login/login.page.ts`
  - Uses: Fixtures, page objects, logger, environment variables
  - Tags: `@smoke`

- **Heal**: Checkout script after button label changed from "Pay Now" to "Complete Purchase"
  - Updates: `pages/checkout/checkout.page.ts` (selector for button text)
  - Validates: New selector works, cross-browser compatible
  - Tests: End-to-end flow still passes

- **Update**: Product search selectors after UI refactor
  - Updates: `pages/products/product-view.page.ts` (all search-related locators)
  - Converts: Old CSS selectors to `getByRole()` selectors
  - Validates: All product tests pass with new selectors
