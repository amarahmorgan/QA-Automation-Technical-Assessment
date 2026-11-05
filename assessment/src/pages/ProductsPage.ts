
import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Swag Labs Products page.
 */
export class ProductsPage {
    private readonly page: Page;
    private readonly productNames: Locator;
    private readonly productPrices: Locator;
    private readonly sortDropdown: Locator;
    private readonly addToCartButtons: Locator;
    private readonly shoppingCartBadge: Locator;
    private readonly shoppingCartLink: Locator;
    private readonly menuButton: Locator;
    private readonly menuCloseButton: Locator;
    private readonly allItemsLink: Locator;
    private readonly logoutLink: Locator;
    private readonly pageTitle: Locator;

    /**
     * Constructs a new ProductsPage instance.
     * @param page The Playwright Page instance.
     */
    public constructor(page: Page) {
        this.page = page;

        this.productNames = page.locator('[data-test^="item-"][data-test$="-title-link"]');
        this.productPrices = page.locator('[data-test="inventory-item-price"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.addToCartButtons = page.locator('button[data-test^="add-to-cart-"]');
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');

        this.menuButton = page.locator('#react-burger-menu-btn');
        this.menuCloseButton = page.locator('#react-burger-cross-btn');
        this.allItemsLink = page.locator('#inventory_sidebar_link');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.pageTitle = page.locator('[data-test="title"]');
    }

    // #region Product Sorting

    /**
     * Selects a product sorting option.
     * @param sortValue The sorting option value.
     */
    public async sortProducts(sortValue: string): Promise<void> {
        await this.sortDropdown.selectOption(sortValue);
    }

    /**
     * Retrieves all displayed product names.
     * @returns An array containing product names.
     */
    public async getProductNames(): Promise<string[]> {
        const names = await this.productNames.allTextContents();

        return names.map(name => name.trim());
    }

    /**
     * Retrieves all displayed product prices.
     * @returns An array containing product prices.
     */
    public async getProductPrices(): Promise<string[]> {
        const prices = await this.productPrices.allTextContents();

        return prices.map(price => price.trim());
    }

    /**
     * Retrieves the number of displayed products.
     * @returns The total number of products.
     */
    public async getProductCount(): Promise<number> {
        return await this.productNames.count();
    }

    // #endregion

    // #region Shopping Cart

    /**
     * Adds all available products to the shopping cart.
     */
    public async addAllProductsToCart(): Promise<void> {
        await this.page.waitForURL('**/inventory.html');

        await this.addToCartButtons.first().waitFor({
            state: 'visible',
            timeout: 10000
        });

        const buttonCount: number = await this.addToCartButtons.count();

        for (let index = 0; index < buttonCount; index++) {
            await this.addToCartButtons.first().click();
        }
    }

    /**
     * Retrieves the shopping cart badge count.
     * @returns The number of products in the cart.
     */
    public async getCartBadgeCount(): Promise<number> {
        const badgeText = await this.shoppingCartBadge.textContent();

        if (!badgeText) {
            throw new Error('Shopping cart badge is empty or unavailable.');
        }

        return Number(badgeText);
    }

    /**
     * Checks whether the shopping cart badge is displayed.
     * @returns True if the badge exists, otherwise false.
     */
    public async hasCartBadge(): Promise<boolean> {
        return (await this.shoppingCartBadge.count()) > 0;
    }

    /**
     * Navigates to the shopping cart.
     */
    public async navigateToCart(): Promise<void> {
        await this.shoppingCartLink.click();
        await this.page.waitForURL('**/cart.html');
        await this.page.locator('.cart_list').waitFor({
            state: 'visible',
            timeout: 10000
        });
    }

    // #endregion

    // #region Navigation and Logout

    /**
     * Retrieves the Products page title.
     * @returns The page title locator.
     */
    public getPageTitle(): Locator {
        return this.pageTitle;
    }

    /**
  * Opens the navigation menu and waits until it is stable.
  */
    private async openMenu(): Promise<void> {
        await this.menuButton.click();
        await this.allItemsLink.waitFor({
            state: 'visible',
            timeout: 10000
        });

        // Wait until the menu animation finishes.
        await this.allItemsLink.click({
            trial: true,
            timeout: 10000
        });
    }
    /**
    * Opens the menu and selects All Items.
    */
    public async navigateToAllItems(): Promise<void> {
        await this.openMenu();
        await this.allItemsLink.click();
        await this.productNames.first().waitFor({
            state: 'visible',
            timeout: 10000
        });
    }

    /**
 * Logs out of Swag Labs.
 */
    public async logout(): Promise<void> {
        await this.openMenu();
        await this.logoutLink.click({
            trial: true,
            timeout: 10000
        });

        await this.logoutLink.click();
    }
}