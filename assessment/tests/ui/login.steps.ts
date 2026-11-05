import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import type { LoginPage } from '../../src/pages/LoginPage.js';
import { test } from '../../src/fixtures/pages.fixture.js';
import loginData from './login.data.json' with { type: 'json' };

const { Given, When, Then } = createBdd(test);

// #region Common Given Step

Given('a user is on the Swag Labs login page', async ({ loginPage }) =>
{
    await loginPage.navigate();
});

// #endregion

// #region Positive Scenario Steps

When('a user attempts to login with valid credentials', async ({ loginPage }) =>
{
    await when(loginPage, 'Login with valid credentials');
});

Then('the products page should be displayed successfully', async ({ page, loginPage }) =>
{
    await then(page, loginPage, 'Login with valid credentials');
});

// #endregion

// #region Negative Scenario Steps

When('a user attempts to login with an invalid username', async ({ loginPage }) =>
{
    await when(loginPage, 'Login with an invalid username');
});

Then('an invalid username error should be displayed', async ({ page, loginPage }) =>
{
    await then(page, loginPage, 'Login with an invalid username');
});

When('a user attempts to login with an incorrect password', async ({ loginPage }) =>
{
    await when(loginPage, 'Login with an incorrect password');
});

Then('an incorrect password error should be displayed', async ({ page, loginPage }) =>
{
    await then(page, loginPage, 'Login with an incorrect password');
});

// #endregion

/**
 * Performs the login operation using the provided test data.
 * @param loginPage The Swag Labs LoginPage instance.
 * @param scenarioName The name of the login scenario.
 */
async function when(loginPage: LoginPage, scenarioName: string): Promise<void>
{
    const scenario = getLoginTestData(scenarioName);

    await loginPage.login(scenario.testData.username,scenario.testData.password);
}


async function then(page: Page,loginPage: LoginPage, scenarioName: string): Promise<void>
{
    const expected = getLoginTestData(scenarioName).expectedResult;

    // Positive Test Case
    if (
        typeof expected.pageTitle === 'string' &&
        typeof expected.url === 'string'
    )
    {
        await expect(loginPage.getPageTitle()).toHaveText(expected.pageTitle);

        await expect.poll(() => new URL(page.url()).pathname).toBe(`/${expected.url}`);

        return;
    }

    // Negative Test Case
    if (typeof expected.errorMessage === 'string')
    {
        await expect(loginPage.getErrorMessage()).toBeVisible();

        await expect(loginPage.getErrorMessage()) .toContainText(expected.errorMessage);

        return;
    }

    throw new Error('Unknown expected login result received.');
}


function getLoginTestData(scenarioName: string): typeof loginData[number]
{
    const scenario = loginData.find(item => item.scenario === scenarioName);

    if (!scenario)
    {
        throw new Error(`Login test data not found: ${scenarioName}`);
    }

    return scenario;
}