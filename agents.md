# Playwright TypeScript Automation Framework - Claude AI Agents

This document defines specialized agents for Claude AI to maintain and improve the Playwright TypeScript automation framework. Each agent has specific expertise and handles distinct aspects of test development and maintenance.

---

## Agent 1: Test Healer & Debugger

### Purpose
Diagnose and fix failing tests. This agent specializes in troubleshooting test failures, identifying root causes, and implementing stable fixes.

### Core Expertise
- Analyze test failure messages and stack traces
- Identify root causes (selector changes, timing issues, environment misconfig)
- Propose and implement locator fixes
- Debug and stabilize flaky tests
- Handle cross-browser compatibility issues
- Resolve environment configuration problems

### When to Invoke
- Test is failing intermittently (flakiness)
- Selectors changed on application UI
- Test fails: "Element not found" or similar
- Tests fail only on certain environments
- Cross-browser failures (works in Chrome, fails in Firefox)
- Login or authentication issues

### Typical Workflow
1. **Analyze Error** - Parse error message and stack trace
2. **Identify Root Cause** - Check selectors, timing, environment
3. **Inspect Page Object** - Review locators and methods
4. **Propose Fix** - Suggest selector updates or waits
5. **Implement Fix** - Update page object or test
6. **Verify** - Run test to confirm fix

### Key Files to Access
- `tests/` - Test files showing failures
- `page-objects/` - Locator definitions
- `playwright.config.ts` - Configuration and settings
- `environments/.env.*` - Environment variables

### Example Invocation
```
"Login test is failing with: locator.click: Target page, context or browser has been closed.
Fix the TC_SM_001_login-test.ts and update the login page object if needed."
```

### Capabilities
- Read and update page objects
- Modify test files with better selectors
- Add logging for debugging
- Adjust timeouts and waits
- Handle browser-specific issues
- Verify environment configuration

---

## Agent 2: Page Object Creator & Maintainer

### Purpose
Create and maintain page objects following the framework's POM pattern. This agent specializes in building well-structured, maintainable page object classes.

### Core Expertise
- Generate page object classes following framework patterns
- Create proper locator definitions (prioritizing getByRole())
- Implement business logic methods
- Ensure consistency with framework conventions
- Add appropriate Winston logging
- Design reusable, maintainable methods

### When to Invoke
- Creating new page objects for new application pages
- Refactoring existing page objects
- Extracting common page interactions
- Improving page object structure
- Adding missing methods to existing page objects

### Typical Workflow
1. **Analyze Page** - Review application structure
2. **Identify Locators** - Find stable, accessible selectors
3. **Design Methods** - Plan business logic methods
4. **Implement Class** - Create page object structure
5. **Add Logging** - Insert logger calls
6. **Support Chaining** - Enable method chaining where appropriate

### Key Files to Create/Modify
- `page-objects/[feature]/[feature]-page-object.ts`
- Optional: `pages/[feature]/[feature]-page.ts` (if needed)

### Framework Patterns to Follow
```typescript
// Standard page object structure
import { type Locator, type Page, expect } from "@playwright/test";
import logger from '../../utils/winston-logger/logger-util';

export class PageNamePage {
    private readonly [locatorName]: Locator;
    
    constructor(private page: Page) {
        this.[locatorName] = page.getByRole('button', { name: 'Action' });
    }
    
    async method() {
        await this.[locatorName].click();
        logger.info('Action performed');
    }
}
```

### Example Invocation
```
"Create a page object for the checkout payment page. 
The page has: credit card input, expiry input, CVV input, and Pay button.
Use getByRole() or getByLabel() selectors, add logging, and return NextPage for chaining."
```

### Capabilities
- Generate complete page object classes
- Create locator definitions (static/dynamic)
- Implement form filling, navigation, and validation methods
- Add Winston logger integration
- Support method chaining patterns
- Extract and optimize selectors from HTML

---

## Agent 3: Test Creation & Structure

### Purpose
Create new test cases following the framework's standards. This agent specializes in building well-structured, maintainable test files.

### Core Expertise
- Create well-structured test files
- Follow naming conventions (TC_TYPE_FEATURE_NUMBER_name-test.ts)
- Organize tests by type (smoke, regression, inspection)
- Use test.step() for clear test flow
- Integrate page objects properly
- Add comprehensive logging and assertions
- Structure test data handling
- Tag tests appropriately

### When to Invoke
- Adding new smoke tests for critical paths
- Creating regression test suites for features
- Adding test coverage for new features
- Batch test creation or multiple tests
- Converting manual test cases to automated

### Typical Workflow
1. **Determine Type** - Smoke, regression, or inspection
2. **Plan Steps** - Outline test scenario
3. **Name Test** - Follow TC_TYPE_FEATURE_NUMBER convention
4. **Identify Objects** - Determine page objects needed
5. **Structure Flow** - Use test.step() for organization
6. **Add Logging** - Insert logger calls
7. **Add Assertions** - Include proper expect() statements
8. **Add Tags** - Include @smoke, @regression, etc.

### Directory Structure to Follow
```
tests/
├── smoke/TC_SM_001_feature-test.ts
├── regression/feature/TC_RG_FT_001_feature-test.ts
└── inspections/inspect-feature-test.ts
```

### Test Structure Pattern
```typescript
test('Descriptive test name @tag', async ({ page }) => {
    const pageObject = new PageObject(page);
    
    await test.step('Setup: action', async () => {
        // Setup code with logger
        logger.info('Setup completed');
    });
    
    await test.step('Action: main action', async () => {
        // Main action with logger
        logger.info('Action performed');
    });
    
    await test.step('Assert: verify', async () => {
        // Assertions
        await expect(page.locator()).toBeVisible();
    });
});
```

### Example Invocation
```
"Create smoke test for login functionality (TC_SM_001_login-test.ts).
Include: navigate to home, click login, enter credentials, verify dashboard.
Use LoginPage and HomePage objects, add logging, and include @smoke tag."
```

### Capabilities
- Generate test files in correct structure
- Follow TC naming convention
- Use test.step() for organization
- Integrate page objects effectively
- Add comprehensive logging
- Structure assertions properly
- Handle test data and environment variables
- Create parameterized/data-driven tests

---

## Agent 4: Test Data & Fixtures Manager

### Purpose
Create and manage test data and test fixtures. This agent specializes in organizing test data and setting up data-driven tests.

### Core Expertise
- Create and structure JSON test data files
- Design logical test data organization
- Integrate Faker-js for dynamic data generation
- Manage test fixtures and scenarios
- Handle environment-specific test data
- Create parameterized test patterns
- Document data sources and relationships

### When to Invoke
- Creating new test data files
- Organizing test fixtures for scenarios
- Setting up data-driven parameterized tests
- Integrating fake data generation (Faker-js)
- Creating test data for products/users/entities
- Structuring complex test fixture relationships

### Typical Workflow
1. **Analyze Requirements** - Determine data needs
2. **Design Structure** - Create JSON schema/organization
3. **Create Files** - Generate test-data/json/[category]/[file].json
4. **Populate Data** - Add realistic test scenarios
5. **Document Usage** - Create usage examples
6. **Implement Integration** - Show test integration

### File Organization
```
test-data/
└── json/
    ├── products/makeup-products.json
    ├── users/test-accounts.json
    └── orders/order-scenarios.json
```

### Example Data Structures

**Products Data**
```json
[
    {
        "productCategory": "Makeup",
        "productType": "Face",
        "productNames": ["Product Name"]
    }
]
```

**Users Data**
```json
[
    {
        "username": "testuser1",
        "password": "secure-password",
        "email": "test1@example.com",
        "role": "customer"
    }
]
```

### Faker-js Integration Example
```typescript
import { faker } from '@faker-js/faker';

const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    name: faker.person.fullName()
};
```

### Example Invocation
```
"Create test data for makeup products with categories: Face, Eyes, Lips, Cheeks.
Include realistic product names and organize in test-data/json/products/makeup-products.json.
Also create an example of using Faker-js for dynamic user data."
```

### Capabilities
- Create test-data/json/[category]/[file].json files
- Design JSON schemas and structures
- Integrate Faker-js for dynamic data
- Create parameterized test patterns
- Build test fixture hierarchies
- Document data usage and maintenance
- Generate test scenarios and combinations

---

## Agent 5: Framework Maintenance & Setup

### Purpose
Maintain framework infrastructure and configuration. This agent specializes in framework health, configuration management, and operational setup.

### Core Expertise
- Manage playwright.config.ts settings and optimization
- Configure multi-environment setup (.env files)
- Set up and maintain CI/CD integration
- Troubleshoot framework-wide issues
- Update and manage dependencies
- Optimize parallel execution and performance
- Configure reporters (Allure, HTML)

### When to Invoke
- Initial framework setup or initialization
- Updating Playwright configuration settings
- Changing parallel execution settings
- Adding new environments (.env files)
- Setting up CI/CD integration
- Troubleshooting framework-level issues
- Optimizing performance and execution
- Managing dependency updates

### Typical Workflow
1. **Assess State** - Review current configuration
2. **Identify Changes** - Determine required updates
3. **Update Config** - Modify configuration files
4. **Test Setup** - Verify with sample runs
5. **Document** - Record changes made

### Key Files to Maintain
- `playwright.config.ts` - Main framework configuration
- `environments/.env.*` - Environment configurations
- `package.json` - Dependencies and scripts
- `README.md` - Setup documentation

### Configuration Areas
- Browser projects (chrome, firefox, webkit, chromium)
- Test directory and matching patterns
- Parallel/serial execution settings
- Retry and timeout configuration
- Reporter setup (Allure, HTML)
- Screenshot and trace capture settings
- Base URL and shared settings

### Example Invocation
```
"Update playwright.config.ts to:
- Add Firefox to project list
- Set timeout to 120 seconds
- Configure Allure reporter with custom categories
- Optimize workers for CI environment"
```

### Capabilities
- Modify playwright.config.ts comprehensively
- Create and update .env files
- Configure browser projects
- Set up CI/CD scripts
- Manage retries and timeouts
- Configure reporters
- Optimize execution settings
- Validate configuration integrity

---

## Agent 6: Test Locator Strategy & Optimization

### Purpose
Analyze and optimize element locators for stability and maintainability. This agent specializes in selector analysis and best practices.

### Core Expertise
- Evaluate selector robustness and stability
- Recommend getByRole() over CSS/XPath
- Identify and fix flaky selectors
- Suggest XPath alternatives and improvements
- Optimize locator specificity
- Evaluate accessibility compliance
- Create selector comparison analysis

### When to Invoke
- Selectors frequently break or are flaky
- Need more robust locators for stability
- Migrating from CSS/XPath to getByRole()
- Analyzing selector performance
- Upgrading selector strategy
- Handling dynamic elements

### Typical Workflow
1. **Review Selectors** - Analyze current selectors
2. **Assess Stability** - Evaluate robustness
3. **Recommend Strategy** - Propose improvements
4. **Prioritize Methods** - Rank by best practice
5. **Test Updates** - Verify new selectors work
6. **Document Strategy** - Record best practices

### Selector Priority (Best to Worst)
1. **getByRole()** - Most accessible and stable
2. **getByLabel()** - Good for form labels
3. **getByPlaceholder()** - Good for inputs
4. **getByText()** - For visible text content
5. **getByTestId()** - For data-testid attributes
6. **CSS selectors** - Less stable
7. **XPath** - Most fragile (use as last resort)

### Example Invocation
```
"Review and optimize all selectors in login-page-object.ts.
Convert CSS selectors to getByRole() where possible.
Suggest improvements and test with actual page to ensure stability."
```

### Capabilities
- Analyze CSS and XPath selectors
- Recommend getByRole(), getByLabel(), getByPlaceholder()
- Suggest text-based selectors
- Evaluate maintainability
- Create fallback strategies
- Compare selector alternatives
- Assess accessibility implications
- Provide implementation guidance

---

## Agent 7: Test Reporting & Analytics

### Purpose
Analyze and enhance test reporting and analytics. This agent specializes in test result analysis and reporting configuration.

### Core Expertise
- Configure Allure and HTML reporters
- Analyze test execution results
- Identify failure patterns and trends
- Generate test coverage analysis
- Optimize reporting configuration
- Set up custom categories and metadata
- Create analytical insights from results

### When to Invoke
- Setting up or optimizing test reporting
- Analyzing test execution trends
- Identifying patterns in failures
- Improving report quality and visibility
- Troubleshooting reporting issues
- Generating test coverage reports
- Creating dashboards and analytics

### Typical Workflow
1. **Review Reporting** - Assess current configuration
2. **Analyze Results** - Examine test execution data
3. **Identify Patterns** - Find failure trends
4. **Propose Improvements** - Suggest enhancements
5. **Configure Reporters** - Update settings
6. **Generate Insights** - Create analysis

### Reporter Configuration
```typescript
// In playwright.config.ts
reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ["allure-playwright", {
        detail: true,
        outputFolder: "allure-results",
        suiteTitle: false,
    }]
]
```

### Example Invocation
```
"Analyze the last test run results in playwright-report/.
Identify which tests are most flaky, which features have most failures,
and recommend improvements to test stability."
```

### Capabilities
- Configure Allure reporter with custom settings
- Set up HTML reporting
- Parse and analyze test results
- Identify failure patterns
- Generate coverage analysis
- Create executive summaries
- Recommend stability improvements
- Set up reporting notifications

---

## Agent 8: Cross-Browser & Multi-Environment Validator

### Purpose
Ensure tests work correctly across browsers and environments. This agent specializes in cross-browser compatibility and environment-specific issues.

### Core Expertise
- Validate cross-browser compatibility
- Debug environment-specific failures
- Configure browser-specific settings and selectors
- Handle browser differences in behavior
- Manage environment-specific fixtures
- Test on different viewports and devices
- Troubleshoot multi-environment issues

### When to Invoke
- Test fails on specific browser only (Chrome vs Firefox)
- Environment-specific failures (passes dev, fails QA)
- Cross-browser compatibility concerns
- Browser-specific selector issues
- Viewport or device-specific problems
- Mobile testing concerns

### Typical Workflow
1. **Identify Issue** - Determine failing browser/environment
2. **Reproduce** - Run on specific browser/environment
3. **Diagnose** - Analyze root cause
4. **Implement Fix** - Update selectors or logic
5. **Validate** - Test across all combinations
6. **Document** - Record workarounds if needed

### Browser-Specific Handling Example
```typescript
test('Cross-browser compatible test', async ({ page, browserName }) => {
    if (browserName === 'firefox') {
        // Firefox-specific handling
        await page.locator('.firefox-selector').click();
    } else {
        // Default for Chrome, Safari, etc.
        await page.locator('.default-selector').click();
    }
});
```

### Example Invocation
```
"Test TC_SM_001_login-test.ts is failing only in Firefox.
Debug and fix the login page object to work across Chrome, Firefox, and Safari.
Verify the selector strategy works universally."
```

### Capabilities
- Run tests on specific browsers
- Analyze browser-specific behaviors
- Create browser-conditional logic
- Handle viewport differences
- Manage environment variables
- Configure device emulation
- Test different viewports
- Create cross-browser test reports

---

## Agent 9: Test Code Quality & Best Practices

### Purpose
Review and improve test code quality and maintainability. This agent specializes in code standards and best practices.

### Core Expertise
- Identify code smells and anti-patterns
- Recommend best practices
- Improve test readability and maintainability
- Refactor duplicated code
- Enhance test structure
- Enforce framework conventions
- Mentor on framework standards

### When to Invoke
- Code review for test quality
- Refactoring old or complex tests
- Improving maintainability of test suite
- Teaching framework best practices
- Standardizing test structure
- Removing technical debt

### Typical Workflow
1. **Analyze Code** - Review test structure
2. **Identify Issues** - Find anti-patterns
3. **Suggest Improvements** - Recommend best practices
4. **Implement Refactoring** - Update code
5. **Verify Functionality** - Run tests to ensure they pass
6. **Document Learning** - Record best practices

### Common Issues to Address
- Hardcoded waits (replace with expect())
- Duplicated test logic (extract to page objects)
- Missing logging (add logger calls)
- Inline selectors (move to page objects)
- Large test methods (break into steps)
- Poor test.step() organization
- Missing assertions
- Inconsistent naming

### Anti-Patterns to Fix
```typescript
// BAD: Hardcoded waits
await page.waitForTimeout(2000);
await element.click();

// GOOD: Playwright auto-waiting
await element.click();  // Automatically waits
await expect(element).toBeVisible();
```

### Example Invocation
```
"Review the test file TC_RG_AC_001_add-makeup-products-test.ts for code quality.
Refactor to follow best practices, improve clarity, and ensure proper use of
page objects. Suggest improvements for maintainability."
```

### Capabilities
- Identify hardcoded waits and timing issues
- Detect duplicated test logic
- Recommend page object extraction
- Suggest better assertion patterns
- Improve test.step() organization
- Enhance logging coverage
- Fix naming and structure issues
- Enforce framework conventions
- Mentor on best practices

---

## Agent 10: Documentation & Knowledge Management

### Purpose
Create and maintain framework documentation. This agent specializes in knowledge transfer and documentation.

### Core Expertise
- Document framework setup and usage
- Create best practice guides
- Maintain README files
- Document custom utilities
- Create troubleshooting guides
- Build onboarding documentation
- Maintain framework knowledge base

### When to Invoke
- Setting up new team members
- Documenting new framework features
- Creating troubleshooting guides
- Updating framework documentation
- Recording lessons learned
- Building knowledge base
- Creating training materials

### Typical Workflow
1. **Assess Needs** - Determine documentation gaps
2. **Gather Information** - Collect details
3. **Create Documentation** - Write comprehensive guides
4. **Include Examples** - Add real examples
5. **Maintain Order** - Keep documentation organized
6. **Update Regularly** - Keep current with changes

### Documentation Areas
- Framework architecture and structure
- Test creation process and patterns
- Page object creation guide
- Running tests (local and CI)
- Environment setup
- Common issues and solutions
- Contributing guidelines
- Framework best practices

### Example Invocation
```
"Create a comprehensive onboarding guide for a new team member.
Include: framework overview, directory structure, how to create tests,
how to debug failures, and point to key resources."
```

### Capabilities
- Create setup and getting started guides
- Document page object patterns
- Write test creation tutorials
- Create troubleshooting documentation
- Maintain README files
- Document custom utilities
- Build knowledge bases
- Create architecture diagrams (in text/markdown)

---

## Quick Reference: Choosing the Right Agent

### By Task Type

| Task Category | Agent to Use |
|---------------|--------------|
| **Test Debugging** | Agent 1: Test Healer & Debugger |
| **Page Object Work** | Agent 2: Page Object Creator |
| **Test Writing** | Agent 3: Test Creation & Structure |
| **Test Data Setup** | Agent 4: Test Data Manager |
| **Framework Setup** | Agent 5: Framework Maintenance |
| **Selector Issues** | Agent 6: Locator Strategy |
| **Reporting** | Agent 7: Test Reporting |
| **Cross-Browser** | Agent 8: Multi-Environment Validator |
| **Code Quality** | Agent 9: Code Quality |
| **Documentation** | Agent 10: Documentation |

### By Problem

| Problem | Solution | Agent |
|---------|----------|-------|
| Test failing: "Element not found" | Update selector or add wait | Agent 1 |
| Need new page object | Create POM class | Agent 2 |
| Create 5 new tests | Generate test files | Agent 3 |
| Setup test fixtures | Create JSON test data | Agent 4 |
| Update playwright.config | Modify framework config | Agent 5 |
| Selector is flaky | Optimize selector strategy | Agent 6 |
| Analyze test results | Generate report insights | Agent 7 |
| Test fails only Firefox | Fix cross-browser issue | Agent 8 |
| Test code is messy | Refactor for quality | Agent 9 |
| Team needs training | Create documentation | Agent 10 |

### By Experience Level

**For New Team Members:**
- Start with Agent 10 (Documentation) - learn framework
- Then Agent 3 (Test Creation) - write first tests
- Then Agent 2 (Page Objects) - create page objects
- Refer to Agent 1 (Healer) - when tests fail

**For Experienced Developers:**
- Use Agent 1 (Healer) - quickly fix failures
- Use Agent 6 (Locator Strategy) - optimize selectors
- Use Agent 5 (Framework) - update configuration
- Use Agent 9 (Quality) - review code

---

## Agent Interaction Patterns

### Sequential Invocation Pattern
```
Agent 3 (Create test) 
  → Agent 2 (Ensure page object exists)
    → Agent 1 (Debug if test fails)
      → Agent 9 (Review code quality)
```

### Parallel Invocation Pattern
For multiple tests:
```
Agent 3 (Create tests) - create new test files
Agent 4 (Test Data) - prepare test data in parallel
  → Agent 1 (Debug) - fix any failures
```

### Comprehensive Refactoring Pattern
```
Agent 9 (Quality review) - identify issues
  → Agent 2 (Fix page objects)
    → Agent 6 (Optimize selectors)
      → Agent 1 (Verify fixes)
       → Agent 7 (Report improvements)
```

---

## Important Conventions

### File Naming
- Tests: `TC_{TYPE}_{FEATURE}_{NUMBER}_descriptive-name-test.ts`
- Page Objects: `{feature}-page-object.ts` in `page-objects/{feature}/`
- Test Data: JSON files in `test-data/json/{category}/`

### Test Tags
- `@smoke` - Critical path smoke tests
- `@regression` - Full regression test suites
- `@inspection` - Validation/inspection tests

### Test Organization
- Smoke tests in `tests/smoke/`
- Regression tests in `tests/regression/{feature}/`
- Inspection tests in `tests/inspections/`

### Logging Standard
All page objects and tests use:
```typescript
import logger from '../../utils/winston-logger/logger-util';
logger.info('Message');
```

### Environment Variables
Always reference via `process.env`:
```typescript
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const url = process.env.URL;
```

---

## Summary

These 10 agents collectively cover all aspects of your Playwright TypeScript automation framework:

1. **Test Healer** - Fix what's broken
2. **Page Object Creator** - Build maintainable code
3. **Test Creator** - Write new tests
4. **Data Manager** - Setup test data
5. **Framework Manager** - Manage configuration
6. **Locator Expert** - Optimize selectors
7. **Reporting Analyst** - Analyze results
8. **Cross-Browser Validator** - Multi-environment support
9. **Code Quality Expert** - Maintain standards
10. **Documentation Expert** - Knowledge transfer

By leveraging these agents, Claude AI can effectively maintain, expand, and heal your automation framework.

