class ResetPasswordPage {
  elements = {
    forgotPassword_email: () => cy.get("#forgot-password-email-input"),
    forgotPasswordSubmit_button: () => cy.get("#forgot-password-submit-button"),
  };

  navigate(url: string) {
    cy.visit(url);
  }

  enterEmail(email: string) {
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
