import SurveysPage from "../pages/surveys_page.cy";
import LoginPage from "../pages/login_page.cy";

const url = `${Cypress.env("TEST_APP_URL")}/surveys`;
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;

const valid_test_email = Cypress.env("TEST_USER_EMAIL");
const valid_test_password = Cypress.env("TEST_USER_PASSWORD");

let userId = Cypress.env("TEST_USER_ID");

describe("Surveys page tests", () => {
  beforeEach(() => {
    SurveysPage.navigate(url);
  });

  it("Checking for logged out users", () => {
    //check that logged out users are redirected to login
    cy.url().should("include", "/login");
  });

  it("Checking for logged in users", () => {
    //login and now check within the page
    cy.url().should("include", "/login");

    cy.intercept("POST", `${API_BASE}/login`).as("loginRequest");

    // Type correct credentials, login
    LoginPage.enterUsername(valid_test_email);
    LoginPage.enterPassword(valid_test_password);
    LoginPage.clickLogin();

    cy.wait("@loginRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
      // Assert that login pushed through
      cy.url().should("include", "/surveys");
    });
    //reload the surveys page
    cy.intercept("GET", url).as("pageLoaded");
    cy.visit(url);
    cy.wait("@pageLoaded");

    //assert that surveys still loads
    cy.url().should("include", "/surveys");

    //check that surveys endpoint returns a 200
    cy.intercept("GET", `${API_BASE}/surveys?user_uid=${userId}`).as(
      "surveysRequest"
    );

    cy.wait("@surveysRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
    });

    //check for specific sections within the surveys page
    cy.contains("Active surveys");
    cy.contains("Draft surveys");
    cy.contains("Past surveys");
    cy.contains("Configure new survey");
  });
});
