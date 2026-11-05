Feature: Swag Labs Product Sorting

    As a Swag Labs customer
    I want to sort the available products
    So that I can view products in my preferred order

  Scenario: Sort products by name A to Z
    Given a user is logged into Swag Labs and on the products page
    When a user sorts products by name A to Z
    Then all products should be displayed in the expected name A to Z order

  Scenario: Sort products by name Z to A
    Given a user is logged into Swag Labs and on the products page
    When a user sorts products by name Z to A
    Then all products should be displayed in the expected name Z to A order

  Scenario: Sort products by price low to high
    Given a user is logged into Swag Labs and on the products page
    When a user sorts products by price low to high
    Then all products should be displayed in the expected price ascending order

  Scenario: Sort products by price high to low
    Given a user is logged into Swag Labs and on the products page
    When a user sorts products by price high to low
    Then all products should be displayed in the expected price descending order
