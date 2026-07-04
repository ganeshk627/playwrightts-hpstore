---
mode: agent
---

# Playwright MCP Test Generator and Healer

Use this prompt when you need to create new Playwright scripts from scratch or repair existing ones in this framework using Playwright MCP.

## Purpose

Generate or heal Playwright TypeScript automation scripts that fit the conventions in this repository. Prefer using Playwright MCP to inspect the live application, discover stable locators, and validate flows before writing or editing code.

## What to do

1. Review the existing framework conventions from:
   - skills.md
   - agents.md
   - playwright.config.ts
   - package.json
   - the current tests, pages, and utilities

2. If the task is to create a new script:
   - Create or extend the relevant page object and test file
   - Follow the repository naming pattern such as TC_SM_001_* or TC_RG_* when appropriate
   - Use the existing fixture and utility patterns
   - Prefer accessible selectors such as getByRole, getByLabel, getByPlaceholder, or stable test ids

3. If the task is to heal an existing script:
   - Inspect the failing or outdated test
   - Identify the root cause such as locator drift, changed UI text, changed messages, or timing issues
   - Update the script or page object with the minimal stable fix
   - Preserve the existing framework structure and avoid introducing new patterns

4. Use Playwright MCP to:
   - Inspect the application flow
   - Discover current locators and messages
   - Confirm whether a UI change has affected the script
   - Validate the final flow before finalizing the change

5. Follow these quality rules:
   - Reuse existing page objects and helpers where possible
   - Avoid hardcoded waits and arbitrary sleeps
   - Prefer Playwright auto-waiting and explicit assertions
   - Keep test steps clear and structured
   - Add or update logging where the framework already expects it
   - Use environment variables and existing test data patterns

## Output expectations

Return:
- the updated or newly created test file
- any page object or helper changes needed
- a short explanation of the fix or implementation
- a note on the locator/message changes that were addressed
- any follow-up suggestions if the flow still needs validation

## Example invocation

- Create a new smoke test for login and dashboard validation
- Heal an existing checkout script after a button label or success message changed
- Update selectors in a page object after a UI refactor
