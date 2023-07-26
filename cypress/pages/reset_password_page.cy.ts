class ResetPasswordPage {
  elements = {
    forgotPassword_email: () => cy.get("#forgot-password-email-input"),
    forgotPasswordSubmit_button: () => cy.get("#forgot-password-submit-button"),
  };

  navigate(url) {
    cy.visit(url);
  }

  enterEmail(email) {
    this.elements.forgotPassword_email().first().click().type(email);
  }

  getForgotPasswordSubmitButton() {
    return this.elements.forgotPasswordSubmit_button();
  }

  submitForgotPasswordEmail() {
    this.elements.forgotPasswordSubmit_button().click();
  }
}

export default new ResetPasswordPage();
