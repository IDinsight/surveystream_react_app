import SurveysPage from "../pages/surveys_page.cy";
import LoginPage from "../pages/login_page.cy";
import BasicInformationPage from "../pages/basic_information_page.cy";

const url = `${Cypress.env("TEST_APP_URL")}/new-survey-config`;
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;

const valid_test_email = Cypress.env("TEST_USER_EMAIL");
const valid_test_password = Cypress.env("TEST_USER_PASSWORD");

let userId = Cypress.env("TEST_USER_ID");


const valid_survey_data = {
  "survey_name": "Valid Test Survey Name"
}

describe("Basic information page tests", () => {
  beforeEach(() => {
    BasicInformationPage.navigate(url);
  });

  it("Checking page load for logged out users", () => {
    //check that logged out users are redirected to login
    cy.url().should("include", "/login");
  });

  it("Checking page load for logged in users", () => {
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

    SurveysPage.getConfigureNewSurveyLink().should("be.visible");

    SurveysPage.clickConfigureNewSurveyLink();

    cy.url().should("include", "/new-survey-config");

    cy.contains("New survey config");

    cy.contains("Basic Information");

    cy.contains("Please fill out the basic information about your survey");

    //check all buttons are visible and disabled
    BasicInformationPage.getContinueButton().should("be.disabled");
    BasicInformationPage.getSaveButton().should("be.disabled");

    //check if all fields are available
    BasicInformationPage.getSurveyName().should("be.visible");
    BasicInformationPage.getSurveyId().should("be.visible");
    BasicInformationPage.getProjectName().should("be.visible");
    BasicInformationPage.getSurveyDescription().should("be.visible");
    BasicInformationPage.getStartDate().should("be.visible");
    BasicInformationPage.getEndDate().should("be.visible");
  });
});