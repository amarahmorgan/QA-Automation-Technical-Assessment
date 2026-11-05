Feature: Swag Labs Login

    As a Swag Labs customer
    I want to log in to the website
    So that I can access the available products

  Scenario: Login with valid credentials
    Given a user is on the Swag Labs login page
    When a user attempts to login with valid credentials
    Then the products page should be displayed successfully

  Scenario: Login with an invalid username
    Given a user is on the Swag Labs login page
    When a user attempts to login with an invalid username
    Then an invalid username error should be displayed

  Scenario: Login with an incorrect password
    Given a user is on the Swag Labs login page
    When a user attempts to login with an incorrect password
    Then an incorrect password error should be displayed
