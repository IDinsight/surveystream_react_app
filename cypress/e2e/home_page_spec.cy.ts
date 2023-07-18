import HomePage from "../pages/home_page.cy";
import LoginPage from "../pages/login_page.cy";

const url = `${Cypress.env("TEST_APP_URL")}`;
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;

const invalid_email = "ahsdkfj";
const valid_test_email = Cypress.env("TEST_USER_EMAIL");
const valid_test_password = Cypress.env("TEST_USER_PASSWORD");

describe("Reset password tests", () => {
  beforeEach(() => {
    HomePage.navigate(url);
  });

  it("Checking for successful load", () => {
    //check page is loaded well and contains all text
    cy.url().should("include", "/");
    cy.contains("Support your survey operations with DoD SurveyStream");
    cy.contains(
      "Platform for configuring, running, and managing survey operations by DoD"
    );
    HomePage.getLoginButton().should("be.visible");
    HomePage.getLoginButton().contains("Login");
    HomePage.getContactUsButton().should("be.visible");
  });

  it("Checking for logged in users", () => {
    //navigate to login through the login button then reload the page after login
    cy.url().should("include", "/");
    HomePage.getLoginButton().should("be.visible");
    HomePage.clickLoginButton();

    cy.url().should("include", "/login");

    cy.intercept("POST", `${API_BASE}/login`).as("loginRequest");

    // Type correct credentials, login
    LoginPage.enterUsername(valid_test_email);
    LoginPage.enterPassword(valid_test_password);
    LoginPage.clickLogin();

    cy.wait("@loginRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
    });

    // Assert that login pushed through
    cy.url().should("include", "/surveys");

    //reload the home page
    cy.intercept("GET", url).as("pageLoaded");
    cy.visit(url);
    cy.wait("@pageLoaded");

    //check if login button now has surveys
    HomePage.getLoginButton().contains("Go to my surveys");

    //check that it routes to surveys after click

    HomePage.clickLoginButton();

    cy.url().should("include", "/surveys");
  });
});
