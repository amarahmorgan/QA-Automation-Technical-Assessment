Feature: Swag Labs Shopping Cart

    As a Swag Labs customer
    I want to add products to my shopping cart
    So that I can review my items before checkout

  Scenario: Add all products to cart and validate cart count
    Given a user is logged into Swag Labs
    When a user adds all available products to the cart
    Then the shopping cart badge should display the expected product count

  Scenario: Validate the cart item count and total before checkout
    Given a user is logged into Swag Labs
    When a user adds all available products to the cart
    And a user navigates to the shopping cart
    Then the cart should contain the expected number of products
    And the cart total should match the expected amount