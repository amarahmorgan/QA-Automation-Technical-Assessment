# Page Objects

This folder contains Page Object Model (POM) classes for the Swag Labs web application.

## Purpose

Page Objects separate UI locators and interaction logic from step definitions and test files.

This approach promotes code reusability, maintainability and easier test automation.

## Current Page Objects

- `LoginPage.ts` – Handles user authentication and login validation.
- `ProductsPage.ts` – Handles product sorting, product selection, shopping cart interactions, navigation and logout.
- `CartPage.ts` – Handles shopping cart validation, item counts, price retrieval and cart total calculations.
- `CheckoutPage.ts` – Handles checkout information, form validation, order summary calculations, tax validation and order confirmation.

## Convention

- Use one class per page or major UI component.
- Keep locators and page interaction methods within their respective Page Objects.
- Step definitions should call Page Object methods instead of directly interacting with selectors.
- Reuse common methods where appropriate.
- Use explicit return types and JSDoc comments to document methods.
- Keep test data separate from page objects and store scenario data in JSON files.