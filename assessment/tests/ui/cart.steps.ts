import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/pages.fixture.js';
import loginData from './login.data.json' with { type: 'json' };
import cartData from './cart.data.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

// #region Given Steps

Given('a user is logged into Swag Labs', async ({ loginPage }) => {
    const credentials = loginData.find(item => item.scenario === 'Login with valid credentials');

    if (!credentials) {
        throw new Error('Valid login test data was not found.');
    }

    await loginPage.navigate();
    await loginPage.login(credentials.testData.username,credentials.testData.password);
});

// #endregion

// #region When Steps

When('a user adds all available products to the cart', async ({ productsPage }) => {
    await productsPage.addAllProductsToCart();
});

When('a user navigates to the shopping cart', async ({ productsPage }) => {
    await productsPage.navigateToCart();
});

// #endregion

// #region Then Steps

Then('the shopping cart badge should display the expected product count', async ({ productsPage }) => {
    const expected = getCartTestData('Add all products to cart').expectedResult;

    const actualCount = await productsPage.getCartBadgeCount();

    expect(actualCount).toBe(expected.cartCount);
});

Then('the cart should contain the expected number of products', async ({ cartPage }) => {
    const expected = getCartTestData('Add all products to cart').expectedResult;

    const actualCount = await cartPage.getCartItemCount();

    expect(actualCount).toBe(expected.cartCount);
});

Then('the cart total should match the expected amount', async ({ cartPage }) => {
    const expected = getCartTestData('Add all products to cart').expectedResult;

    const actualTotal = await cartPage.getCartTotalCents();

    expect(actualTotal).toBe(expected.cartTotalCents);
});

// #endregion

function getCartTestData(scenarioName: string): typeof cartData[number] {
    const scenario = cartData.find(item => item.scenario === scenarioName);

    if (!scenario) {
        throw new Error(`Cart test data not found: ${scenarioName}`);
    }

    return scenario;
}
