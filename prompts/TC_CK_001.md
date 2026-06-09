# Continue Checkout and Order Validation Flow Using Playwright MCP

Use the project context from skills.md and agents.md.

The login flow and add-to-cart flow are already implemented and working. Reuse the existing utilities, fixtures, page objects, helper methods, test data, and coding conventions defined in the project.

## Goal

Create an end-to-end Playwright test that continues from the existing cart state and completes the remaining user journey:

1. Review Cart
2. Proceed to Checkout
3. Complete Payment
4. Capture Order ID
5. Navigate to Order History
6. Verify the newly created order exists
7. Open Order Details
8. Validate order information

## MCP Requirements

Use Playwright MCP to:

- Launch and inspect the application
- Discover actual locators instead of guessing
- Identify stable selectors
- Analyze network requests if useful
- Validate page transitions
- Capture dynamic values such as Order ID

## Validation Requirements

Validate:

- Cart contents before checkout
- Checkout page loads successfully
- Payment completion succeeds
- Order confirmation message appears
- Order ID is generated
- Order is visible in Order History
- Order details match the purchased product
- Order status is displayed correctly

## Framework Requirements

Follow all standards from:

- skills.md
- agents.md

Reuse existing:

- Fixtures
- Helper methods
- Custom assertions
- Test data management
- Reporting utilities

Avoid:

- waitForTimeout()
- Hardcoded sleeps
- Duplicate utility methods
- Creating new patterns when existing project patterns already exist

## Output

Provide:

1. Complete Playwright TypeScript test implementation
2. Any new page methods required
3. Any new locators discovered via MCP
4. Refactoring suggestions if existing code can be reused
5. Explanation of implementation decisions

Before generating code, inspect the application through Playwright MCP and understand the checkout flow completely.