import LoginPage from "../pages/login_page.cy";
import HeaderSection from "../pages/header_section.cy";

const url = `${Cypress.env("TEST_APP_URL")}/login`;
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;

const email = Cypress.env("TEST_USER_EMAIL");
const password = Cypress.env("TEST_USER_PASSWORD");

const fake_email = "ahsdkfjh@idinsight.org";
const fake_password = "ahsdkfj";

describe("Login and logout tests", () => {
  beforeEach(() => {
    LoginPage.navigate(url);
  });

  it("Checking login with wrong credentials", () => {
    // Intercept the login API request and wait for its response
    cy.intercept("POST", `${API_BASE}/login`).as("loginRequest");

    // Type wrong credentials, login
    LoginPage.enterUsername(fake_email);
    LoginPage.enterPassword(fake_password);
    LoginPage.clickLogin();

    cy.wait("@loginRequest").then((interception) => {
      // Assert that the response status code is 401
      expect(interception?.response?.statusCode).to.equal(401);

      // Assert that the error message appears in the DOM
      cy.get(".ant-message").should("be.visible");
    });

    // Assert that page did not change
    cy.url().should("not.contain", "/surveys");
  });

  it("Checking login with correct credentials", () => {
    console.log("email", email);
    console.log("password", password);

    cy.intercept("POST", `${API_BASE}/login`).as("loginRequest");

    // Type correct credentials, login
    LoginPage.enterUsername(email);
    LoginPage.enterPassword(password);
    LoginPage.clickLogin();

    cy.wait("@loginRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
    });

    // Assert that login pushed through
    cy.url().should("include", "/surveys");

    // Assert that page changed
    cy.contains("Surveys");
  });

  it("Checking login page functionality", () => {
    // Assert that Submit button is not enabled by default
    LoginPage.getButton().should("be.disabled");

    // Assert that Submit button is not enabled with just email
    LoginPage.enterUsername(fake_email);
    LoginPage.getButton().should("be.disabled");

    // Check password is not visible by default
    LoginPage.enterPassword(fake_password);
    LoginPage.getPassword()
      .invoke("val")
      .then((text) => {
        const someText = text as string;
        cy.log(someText);
      });

    // Check show password
    LoginPage.showPassword();
    LoginPage.getPassword().should("have.value", fake_password);

    // Assert that Submit button is enabled after email and password
    LoginPage.getButton().should("be.enabled");
  });

  it("Checking logout after login", () => {
    // Login
    cy.intercept("POST", `${API_BASE}/login`).as("loginRequest");

    LoginPage.enterUsername(email);
    LoginPage.enterPassword(password);
    LoginPage.clickLogin();

    cy.wait("@loginRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
    });

    // Assert that login pushed through
    cy.url().should("include", "/surveys");

    //asset that user profile is visible
    HeaderSection.getUserAvatar().should("be.visible");

    //click avatar menu
    HeaderSection.clickAvatar();

    ///assert that dropdown is visible
    HeaderSection.getProfileDropdown().should("be.visible");

    //click logout
    HeaderSection.clickLogout();

    // Assert that logout pushed through
    cy.url().should("include", "/login");
  });
});