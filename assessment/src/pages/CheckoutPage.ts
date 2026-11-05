import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Swag Labs Checkout process.
 */
export class CheckoutPage {
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly errorMessage: Locator;
    private readonly itemPrices: Locator;
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;
    private readonly finishButton: Locator;
    private readonly completeHeader: Locator;
    private readonly completeMessage: Locator;
    private readonly backToProductsButton: Locator;

    /**
     * Constructs a new CheckoutPage instance.
     * @param page The Playwright Page instance.
     */
    public constructor(page: Page) {
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.errorMessage = page.locator('[data-test="error"]');

        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
        this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
        this.taxLabel = page.locator('[data-test="tax-label"]');
        this.totalLabel = page.locator('[data-test="total-label"]');

        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeMessage = page.locator('[data-test="complete-text"]');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    }

    // #region Checkout Information

    /**
     * Fills in the checkout information fields.
     * @param firstName The customer's first name.
     * @param lastName The customer's last name.
     * @param postalCode The customer's postal code.
     */
    public async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    /**
     * Submits the checkout information.
     *
     */
    public async continueCheckout(): Promise<void> { await this.continueButton.click(); }

    /**
     * Waits for the checkout overview after successful validation.
     */
    public async waitForCheckoutOverview(): Promise<void> {
        await this.subtotalLabel.waitFor({ state: 'visible', timeout: 10000 });

        await this.itemPrices.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Retrieves the checkout validation error.
     * @returns The checkout error locator.
     */
    public getErrorMessage(): Locator { return this.errorMessage; }

    // #endregion

    // #region Checkout Summary

    /**
     * Calculates the total of the displayed checkout items in cents.
     * @returns The calculated item total.
     */
    public async getCalculatedItemTotalCents(): Promise<number> {
        await this.itemPrices.first().waitFor({ state: 'visible', timeout: 10000 });

        const prices = await this.itemPrices.allTextContents();

        if (prices.length === 0) { throw new Error('No checkout item prices were found.'); }

        return prices.reduce((total, price) => { return total + this.convertPriceToCents(price.trim()); }, 0);
    }

    /**
     * Retrieves the displayed item subtotal in cents.
     * @returns The checkout subtotal.
     */
    public async getSubtotalCents(): Promise<number> { return this.convertPriceToCents(await this.subtotalLabel.innerText()); }

    /**
     * Retrieves the displayed tax amount in cents.
     * @returns The checkout tax.
     */
    public async getTaxCents(): Promise<number> { return this.convertPriceToCents(await this.taxLabel.innerText()); }

    /**
     * Retrieves the displayed final total in cents.
     * @returns The checkout total.
     */
    public async getTotalCents(): Promise<number> { return this.convertPriceToCents(await this.totalLabel.innerText()); }

    /**
     * Retrieves the checkout tax label.
     * @returns The tax label locator.
     */
    public getTaxLabel(): Locator { return this.taxLabel; }

    // #endregion

    // #region Order Completion

    /**
     * Completes the checkout process.
     */
    public async finishCheckout(): Promise<void> {
        await this.finishButton.click();
        await this.completeHeader.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Retrieves the order confirmation header.
     * @returns The confirmation header locator.
     */
    public getCompleteHeader(): Locator { return this.completeHeader; }

    /**
     * Retrieves the order confirmation message.
     * @returns The confirmation message locator.
     */
    public getCompleteMessage(): Locator { return this.completeMessage; }

    /**
     * Returns to the Products page after checkout.
     */
    public async returnToProducts(): Promise<void> { await this.backToProductsButton.click(); }

    // #endregion

    // #region Price Conversion

    /**
     * Converts a displayed price into cents.
     * @param price The displayed price or price label.
     * @returns The price represented in cents.
     */
    private convertPriceToCents(price: string): number {
        const match = /\$(\d+)\.(\d{2})/.exec(price);

        if (!match) {
            throw new Error(`Invalid product price: ${price}`);
        }

        return Number(match[1]) * 100 + Number(match[2]);
    }

    // #endregion
}
