# QA Automation Technical Assessment

---

## Project Overview

This repository contains the deliverables for a QA Automation Technical Assessment.

The assessment demonstrates practical Quality Engineering skills across test analysis, API testing and automated web UI testing.

The project focuses on applying structured testing principles, designing meaningful test scenarios, validating application behaviour and building maintainable automation using Playwright, TypeScript, BDD and Gherkin.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Programming language for UI automation |
| Playwright | Browser automation and test execution |
| Playwright BDD | Integration of Gherkin scenarios with Playwright |
| Gherkin | Behaviour-driven test scenario descriptions |
| Postman | REST API testing |
| Node.js | JavaScript runtime |
| npm | Dependency and script management |
| JSON | External test data management |
| Git | Version control |

## Assessment Tasks in this Repo

### Task 3 – API Testing: Catfact Ninja

API testing using Postman against the Catfact Ninja REST API.

**Base URL:** `https://catfact.ninja`

Endpoints covered:

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| GET | `/fact?max_length=140` | Retrieve a random cat fact |
| GET | `/facts?limit=10&max_length=140` | Retrieve a paginated collection of facts |
| GET | `/breeds?limit=10` | Retrieve cat breed information |

Testing coverage:
- HTTP status code validation.
- Response content type.
- Response body validation.
- Data types and required properties.
- Response length validation.
- Pagination and result count.
- Negative and data-integrity checks.

The Postman collection uses a collection variable for the base URL to support reusable requests.

### Task 4 – Web UI Automation: Swag Labs

Automated web testing of the Swag Labs application using Playwright, TypeScript and Playwright BDD.

**Application:** https://www.saucedemo.com

Testing coverage:

**Authentication**
- Successful login.
- Invalid username.
- Incorrect password.

**Product Management**
- Sort products by name (A–Z).
- Sort products by name (Z–A).
- Sort products by price (low to high).
- Sort products by price (high to low).
- Validate product names and prices.
- Add all available products to the shopping cart.

**Shopping Cart**
- Validate cart item count.
- Validate calculated cart total.
- Verify cart contents before checkout.

**Checkout**
- Required customer information validation.
- Missing first name.
- Missing last name.
- Missing postal code.
- Validate item subtotal.
- Validate displayed tax.
- Verify final total calculation.
- Complete a successful purchase.
- Validate order confirmation.

**Post-Purchase**
- Verify shopping cart badge disappears.
- Return to All Items.
- Verify shopping cart is empty.
- Log out successfully.

**Cross-browser execution**

The UI automation suite runs across three Playwright browser engines:

- Chromium
- Firefox
- WebKit

The final suite contains 15 generated test executions per browser, resulting in 45 browser test executions.

---

## Framework Architecture

The UI automation framework follows the Page Object Model (POM) design pattern and separates feature files, step definitions, page objects, fixtures and test data.

```text
qa-automation-technical-assessment/
│
├── src/
│   ├── fixtures/
│   │   └── pages.fixture.ts
│   │
│   └── pages/
│       ├── LoginPage.ts
│       ├── ProductsPage.ts
│       ├── CartPage.ts
│       └── CheckoutPage.ts
│
├── tests/
│   └── ui/
│       ├── login.feature
│       ├── login.steps.ts
│       ├── login.data.json
│       │
│       ├── products.feature
│       ├── products.steps.ts
│       ├── products.data.json
│       │
│       ├── cart.feature
│       ├── cart.steps.ts
│       ├── cart.data.json
│       │
│       ├── checkout.feature
│       ├── checkout.steps.ts
│       └── checkout.data.json
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

## Framework Design Principles

### Page Object Model

Page classes contain UI locators and reusable interaction methods.

This separates page interaction logic from the BDD step definitions and improves maintainability.

### Behaviour-Driven Development

Feature files describe application behaviour using Gherkin syntax:

- Given – establishes the initial context.
- When – describes the action.
- Then – describes the expected outcome.
- And – extends a preceding step.

### Fixtures

A shared Playwright fixture initialises and provides reusable Page Object instances to the step definitions.

### External Test Data

JSON files hold scenario-specific test data and expected results, keeping test data separate from automation logic.

### Reusable Step Definitions

Step definitions connect Gherkin scenarios to Page Object methods and reusable test helpers.

---

# Installation and Setup

## 1. Prerequisites

Install the following before setting up the project:

- Node.js (compatible with the project dependencies).
- npm.
- Git.
- Visual Studio Code or another TypeScript-compatible editor.
- Postman (for API testing).

Verify your installations:

```bash
node --version
npm --version
git --version
```

## 2. Clone the Repository

Replace the placeholder with the actual GitHub repository URL.

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd qa-automation-technical-assessment
```

## 3. Install Dependencies

Install the project dependencies:

```bash
npm install
```

This installs the packages defined in `package.json` and `package-lock.json`.

## 4. Install Playwright Browsers

Install the browser binaries required for cross-browser testing:

```bash
npx playwright install
```

This installs the supported browser engines:

- Chromium
- Firefox
- WebKit

To install browser system dependencies where required:

```bash
npx playwright install --with-deps
```

---

# Execution Instructions

## TypeScript Validation

Check the project for TypeScript errors:

```bash
npm run typecheck
```

## Generate BDD Tests

Generate Playwright tests from the Gherkin feature files and step definitions:

```bash
npm run bddgen
```

## Run Web UI Automation

Execute the complete UI automation suite across all configured browsers:

```bash
npm run test:ui
```

## Run Tests by Browser

**Chromium**

```bash
npx playwright test --project=chromium
```

**Firefox**

```bash
npx playwright test --project=firefox
```

**WebKit**

```bash
npx playwright test --project=webkit
```

## View the HTML Test Report

After test execution:

```bash
npx playwright show-report
```

The HTML report provides test results, execution details, failures and available debugging evidence.

---

# API Testing Setup and Execution

API testing is performed using Postman.

## 1. Open Postman

Open Postman and import the exported `Catfact Ninja API Tests` collection.

## 2. Configure the Collection Variable

Set the collection variable:

| Variable | Value |
|---|---|
| `baseUrl` | `https://catfact.ninja` |

## 3. Execute the Collection

Select the collection and open the Collection Runner.

Run the requests and review the individual assertion results.

The collection validates response status codes, response structures, expected data properties and relevant data constraints.

---

# Test Reporting and Evidence

Evidence collected for the assessment includes:

- Postman request and response screenshots.
- API assertion results.
- Playwright HTML execution reports.
- Cross-browser test execution results.
- Automated test failure details and debugging evidence.

Test reports should be reviewed to distinguish genuine application defects from test automation or environment issues.