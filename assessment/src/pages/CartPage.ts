import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Swag Labs Shopping Cart page.
 */
export class CartPage {
    private readonly page: Page;
    private readonly cartList: Locator;
    private readonly itemPrices: Locator;
    private readonly checkoutButton: Locator;
    private readonly cartItems: Locator;

    /**
     * Constructs a new CartPage instance.
     * @param page The Playwright Page instance.
     */
    public constructor(page: Page) {
        this.page = page;

        this.cartList = page.locator('.cart_list');

        this.itemPrices = page.locator('[data-test="inventory-item-price"]');

        this.checkoutButton = page.locator('[data-test="checkout"]');

        this.cartItems = page.locator('.cart_list > .cart_item');

        this.itemPrices = this.cartItems.locator('[data-test="inventory-item-price"]');
    }

    // #region Cart Validation

    /**
     * Retrieves the number of products in the shopping cart.
     * @returns The total number of cart items.
     */
    public async getCartItemCount(): Promise<number> {
        await this.cartList.waitFor({
            state: 'visible',
            timeout: 10000
        });

        return await this.cartItems.count();
    }

    /**
     * Retrieves all displayed cart item prices.
     * @returns An array containing the item prices.
     */
    public async getCartItemPrices(): Promise<string[]> {
        const prices = await this.itemPrices.allTextContents();

        return prices.map(price => price.trim());
    }

    /**
     * Calculates the total cart value in cents.
     * @returns The calculated cart total in cents.
     */
    public async getCartTotalCents(): Promise<number> {
        const prices = await this.getCartItemPrices();

        return prices.reduce((total, price) => {
            const priceInCents = this.convertPriceToCents(price);

            return total + priceInCents;}, 0);
    }

    // #endregion

    // #region Checkout Navigation

    /**
     * Navigates to the checkout information page.
     */
    public async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    // #endregion

    /**
     * Converts a displayed price into cents.
     * @param price The displayed product price.
     * @returns The price represented in cents.
     */
    private convertPriceToCents(price: string): number {
        const match = /^\$(\d+)\.(\d{2})$/.exec(price);

        if (!match) {
            throw new Error(`Invalid product price: ${price}`);
        }

        return Number(match[1]) * 100 + Number(match[2]);
    }
}