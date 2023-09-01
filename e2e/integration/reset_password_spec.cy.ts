import ResetPasswordPage from "../pages/reset_password_page.cy";

const url = `${Cypress.env("TEST_APP_URL")}/reset-password`;
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;

const invalid_email = "ahsdkfj";
const valid_test_email = Cypress.env("TEST_USER_EMAIL");

describe("Reset password tests", () => {
  beforeEach(() => {
    ResetPasswordPage.navigate(url);
  });

  it("Checking reset password functionality", () => {
    //check page is loaded well and contains all text
    cy.url().should("include", "/reset-password");
    cy.contains("Forgot password");
    cy.contains(
      "Please enter the email affiliated with your SurveyStream account. A link to reset your password will be sent to this email address."
    );

    //check the submit button is disabled on load
    ResetPasswordPage.getForgotPasswordSubmitButton().should("be.disabled");

    //type invalid email and still check it is disabled
    ResetPasswordPage.enterEmail(invalid_email);

    //check for invalid email error
    cy.contains("Please enter valid email address");

    //asset disabled submit
    ResetPasswordPage.getForgotPasswordSubmitButton().should("be.disabled");
  });

  it("Checking for successful reset", () => {
    cy.url().should("include", "/reset-password");

    ResetPasswordPage.enterEmail(valid_test_email);

    cy.intercept("POST", `${API_BASE}/forgot-password`).as(
      "forgotPasswordRequest"
    );

    ResetPasswordPage.submitForgotPasswordEmail();

    cy.wait("@forgotPasswordRequest").then((interception) => {
      // Assert that the response status code is 200
      expect(interception?.response?.statusCode).to.equal(200);
    });

    cy.contains("Email has been sent successfully!");
  });
});