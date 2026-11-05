Feature: Swag Labs Checkout

    As a customer
    I want to complete a purchase
    So that I can successfully order products

  Scenario Outline: Checkout requires complete customer information
    Given a customer has products in their shopping cart
    When the customer submits checkout information for "<testCase>"
    Then the checkout should display the required validation error for "<testCase>"

    Examples:
      | testCase                          |
      | Checkout with missing first name  |
      | Checkout with missing last name   |
      | Checkout with missing postal code |

  Scenario: Customer completes a purchase successfully
    Given a customer has products in their shopping cart
    When the customer submits valid checkout information
    Then the order subtotal should match the selected products
    And tax should be included in the final total
    And the final total should be calculated correctly
    When the customer confirms the order
    Then an order confirmation should be displayed
    And the shopping cart badge should disappear

  Scenario: Shopping cart is empty after a completed purchase
    Given a customer has completed a purchase
    When the customer returns to All Items
    And opens the shopping cart
    Then the shopping cart should be empty

  Scenario: Customer can log out after shopping
    Given a customer is logged into Swag Labs
    When the customer logs out
    Then the login page should be displayed