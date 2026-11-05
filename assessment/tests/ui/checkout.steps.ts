
import { createRequire } from 'node:module';
import { createBdd } from 'playwright-bdd';

import { expect, test } from '../../src/fixtures/pages.fixture.js';

import type { LoginPage } from '../../src/pages/LoginPage.js';
import type { ProductsPage } from '../../src/pages/ProductsPage.js';
import type { CartPage } from '../../src/pages/CartPage.js';
import type { CheckoutPage } from '../../src/pages/CheckoutPage.js';

const require = createRequire(import.meta.url);

type CheckoutTestData = {
    scenario: string;
    testData: {
        firstName: string;
        lastName: string;
        postalCode: string;
    };
    expectedResult: {
        errorMessage?: string;
        subtotalCents?: number;
        taxCents?: number;
        totalCents?: number;
        confirmationHeader?: string;
        confirmationMessage?: string;
    };
};

type LoginTestData = {
    scenario: string;
    testData: { username: string; password: string; };
};

const checkoutData = require('./checkout.data.json') as CheckoutTestData[];
const loginData = require('./login.data.json') as LoginTestData[];

const { Given, When, Then } = createBdd(test);

// #region Test Data Helpers

/**
 * Retrieves checkout test data for a specific scenario.
 * @param scenarioName The scenario name used to locate test data.
 * @returns The matching checkout test data.
 */
function getCheckoutTestData(scenarioName: string): CheckoutTestData {
    const testData = checkoutData.find(
        data => data.scenario === scenarioName
    );

    if (!testData) {
        throw new Error(`Checkout test data not found for scenario: ${scenarioName}`);
    }

    return testData;
}

function getValidLoginData(): LoginTestData {
    const login = loginData.find(
        data => data.scenario === 'Login with valid credentials'
    );

    if (!login) {
        throw new Error('Valid login test data was not found.');
    }

    return login;
}

// #endregion

// #region Reusable Actions

async function loginAsCustomer(loginPage: LoginPage, productsPage: ProductsPage): Promise<void> {
    const credentials = getValidLoginData();

    await loginPage.navigate();

    await loginPage.login(credentials.testData.username, credentials.testData.password);

    // Verify successful navigation before performing further actions.
    await expect(productsPage.getPageTitle()).toHaveText('Products');
}


async function prepareShoppingCart(loginPage: LoginPage, productsPage: ProductsPage): Promise<void> {
    await loginAsCustomer(loginPage, productsPage);

    await productsPage.addAllProductsToCart();

    await productsPage.navigateToCart();
}

async function submitCheckoutInformation(cartPage: CartPage, checkoutPage: CheckoutPage, scenarioName: string, waitForOverview: boolean): Promise<void> {
    const data = getCheckoutTestData(scenarioName);

    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInformation(data.testData.firstName, data.testData.lastName, data.testData.postalCode);

    await checkoutPage.continueCheckout();

    if (waitForOverview) {
        await checkoutPage.waitForCheckoutOverview();
    }
}

async function completePurchase(loginPage: LoginPage, productsPage: ProductsPage, cartPage: CartPage, checkoutPage: CheckoutPage): Promise<void> {
    await prepareShoppingCart(loginPage, productsPage);

    await submitCheckoutInformation(cartPage, checkoutPage, 'Complete a successful purchase', true);

    await checkoutPage.finishCheckout();
}

// #endregion

// #region Given Steps

Given('a customer has products in their shopping cart',
    async ({ loginPage, productsPage }) => { await prepareShoppingCart(loginPage, productsPage); }
);

Given('a customer has completed a purchase',
    async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
        await completePurchase(loginPage, productsPage, cartPage, checkoutPage);
    }
);

Given('a customer is logged into Swag Labs',
    async ({ loginPage, productsPage }) => { await loginAsCustomer(loginPage, productsPage); }
);

// #endregion

// #region When Steps

When('the customer submits checkout information for {string}',
    async ({ cartPage, checkoutPage }, scenarioName: string) => {
        await submitCheckoutInformation(cartPage, checkoutPage, scenarioName, false);
    }
);

When('the customer submits valid checkout information',
    async ({ cartPage, checkoutPage }) => { await submitCheckoutInformation(cartPage, checkoutPage, 'Complete a successful purchase', true); }
);

When('the customer confirms the order',
    async ({ checkoutPage }) => { await checkoutPage.finishCheckout(); }
);

When('the customer returns to All Items',
    async ({ checkoutPage, productsPage }) => {
        await checkoutPage.returnToProducts();
        await productsPage.navigateToAllItems();
    }
);

When('opens the shopping cart',
    async ({ productsPage }) => { await productsPage.navigateToCart(); }
);

When('the customer logs out',
    async ({ productsPage }) => { await productsPage.logout(); }
);

// #endregion

// #region Checkout Validation

Then('the checkout should display the required validation error for {string}',
    async ({ checkoutPage }, scenarioName: string) => {
        const data = getCheckoutTestData(scenarioName);
        const expectedError = data.expectedResult.errorMessage;

        if (!expectedError) {
            throw new Error( `Expected checkout error not defined for: ${scenarioName}`);}

        await expect(checkoutPage.getErrorMessage()).toHaveText(expectedError);
    }
);

// #endregion

// #region Checkout Summary Validation

Then('the order subtotal should match the selected products',
    async ({ checkoutPage }) => {
        const data = getCheckoutTestData('Complete a successful purchase');

        const calculatedSubtotal = await checkoutPage.getCalculatedItemTotalCents();
        const displayedSubtotal = await checkoutPage.getSubtotalCents();

        expect(calculatedSubtotal).toBe(data.expectedResult.subtotalCents);
        expect(displayedSubtotal).toBe(calculatedSubtotal);
    }
);

Then('tax should be included in the final total',
    async ({ checkoutPage }) => {
        const data = getCheckoutTestData('Complete a successful purchase');

        await expect(checkoutPage.getTaxLabel()).toBeVisible();

        const displayedTax = await checkoutPage.getTaxCents();

        expect(displayedTax).toBe(data.expectedResult.taxCents);
    }
);

Then('the final total should be calculated correctly',
    async ({ checkoutPage }) => {
        const data = getCheckoutTestData('Complete a successful purchase');

        const subtotal = await checkoutPage.getSubtotalCents();
        const tax = await checkoutPage.getTaxCents();
        const total = await checkoutPage.getTotalCents();

        expect(total).toBe(subtotal + tax);
        expect(total).toBe(data.expectedResult.totalCents);
    }
);

// #endregion

// #region Order Confirmation

Then('an order confirmation should be displayed',
    async ({ checkoutPage }) => {
        const data = getCheckoutTestData('Complete a successful purchase');

        const confirmationHeader = data.expectedResult.confirmationHeader;
        const confirmationMessage = data.expectedResult.confirmationMessage;

        if (!confirmationHeader || !confirmationMessage) {
            throw new Error('Order confirmation expectations are missing from test data.');
        }

        await expect(checkoutPage.getCompleteHeader()).toHaveText(confirmationHeader);
        await expect(checkoutPage.getCompleteMessage()).toHaveText(confirmationMessage);
    }
);

Then('the shopping cart badge should disappear',
    async ({ productsPage }) => { expect(await productsPage.hasCartBadge()).toBe(false); }
);

// #endregion

// #region Post-Purchase Validation

Then('the shopping cart should be empty',
    async ({ cartPage }) => { expect(await cartPage.getCartItemCount()).toBe(0); }
);

Then('the login page should be displayed',
    async ({ loginPage }) => { await expect(loginPage.getLoginButton()).toBeVisible(); }
);

// #endregion