import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import type { LoginPage } from '../../src/pages/LoginPage.js';
import type { ProductsPage } from '../../src/pages/ProductsPage.js';
import { test } from '../../src/fixtures/pages.fixture.js';
import loginData from './login.data.json' with { type: 'json' };
import productsData from './products.data.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

// #region Common Given Step

Given('a user is logged into Swag Labs and on the products page', async ({ loginPage }) => {
    const credentials = loginData.find(item => item.scenario === 'Login with valid credentials');

    if (!credentials) {
        throw new Error('Valid login test data was not found.');
    }

    await loginPage.navigate();

    await loginPage.login(credentials.testData.username, credentials.testData.password);
});

// #endregion

// #region Sorting Scenario Steps

When('a user sorts products by name A to Z', async ({ productsPage }) => {
    await when(productsPage, 'Sort products by name A to Z');
});

Then('all products should be displayed in the expected name A to Z order', async ({ productsPage }) => {
    await then(productsPage, 'Sort products by name A to Z');
});

When('a user sorts products by name Z to A', async ({ productsPage }) => {
    await when(productsPage, 'Sort products by name Z to A');
});

Then('all products should be displayed in the expected name Z to A order', async ({ productsPage }) => {
    await then(productsPage, 'Sort products by name Z to A');
});

When('a user sorts products by price low to high', async ({ productsPage }) => {
    await when(productsPage, 'Sort products by price low to high');
});

Then('all products should be displayed in the expected price ascending order', async ({ productsPage }) => {
    await then(productsPage, 'Sort products by price low to high');
});

When('a user sorts products by price high to low', async ({ productsPage }) => {
    await when(productsPage, 'Sort products by price high to low');
});

Then('all products should be displayed in the expected price descending order', async ({ productsPage }) => {
    await then(productsPage, 'Sort products by price high to low');
});

// #endregion

async function when(productsPage: ProductsPage, scenarioName: string): Promise<void> {
    const scenario = getProductsTestData(scenarioName);

    await productsPage.sortProducts(scenario.testData.sortValue);
}

async function then(productsPage: ProductsPage, scenarioName: string): Promise<void> {
    const expected = getProductsTestData(scenarioName).expectedResult;

    const actualProductCount = await productsPage.getProductCount();

    expect(actualProductCount).toBe(expected.productNames.length);

    const actualNames = await productsPage.getProductNames();
    const actualPrices = await productsPage.getProductPrices();

    expect(actualNames).toEqual(expected.productNames);
    expect(actualPrices).toEqual(expected.productPrices);
}

function getProductsTestData(scenarioName: string): typeof productsData[number] {
    const scenario = productsData.find(
        item => item.scenario === scenarioName
    );

    if (!scenario) {
        throw new Error(`Product sorting test data not found: ${scenarioName}`);
    }

    return scenario;
}
