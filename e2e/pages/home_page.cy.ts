class HomePage {
  elements = {
    loginButton: () => cy.get("#home-login-button"),
    contactUsButton: () => cy.get("#home-contact-us-button"),
  };

  navigate(url: string) {
    cy.visit(url);
  }

  getLoginButton() {
    return this.elements.loginButton();
  }
  getContactUsButton() {
    return this.elements.contactUsButton();
  }

  clickLoginButton() {
    this.elements.loginButton().click();
  }
  clickContactUsButton() {
    this.elements.contactUsButton().click();
  }
}

export default new HomePage();
