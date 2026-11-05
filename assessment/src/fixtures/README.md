# Fixtures

This folder contains reusable Playwright fixtures and shared test setup for the Swag Labs UI automation framework.

## Current Contents

- `pages.fixture.ts` — registers and exposes reusable Page Object instances (`LoginPage`, `ProductsPage`, `CartPage` and `CheckoutPage`) to UI tests.

## Purpose

Fixtures centralise the creation and management of Page Objects, reducing duplication across test files and step definitions.

They provide tests with consistent access to shared browser resources and page objects, making the automation framework easier to maintain, reuse and extend.

## Convention

- Register new Page Objects in `pages.fixture.ts`.
- Use Playwright's fixture extension mechanism to initialise Page Objects.
- Share the same `Page` instance across Page Objects within a test.
- Keep fixture setup separate from test logic.
- Import the custom `test` and `expect` from the shared fixture file when writing step definitions.