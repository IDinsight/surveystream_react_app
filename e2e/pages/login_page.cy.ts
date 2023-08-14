class LoginPage {
    elements = {
      loginPage_email: () => cy.get('#loginForm_email'),
      loginPage_password: () => cy.get('#loginForm_password'),
      loginPage_button: () => cy.get('#loginForm_submit'),
      showPassword_button: () =>
        cy
          .get('#loginForm_password')
          .last()
          .click()
          .get('.ant-input-suffix')
          .click(),
    };
  
    navigate(url) {
      cy.visit(url);
    }
  
    enterUsername(email) {
      this.elements.loginPage_email()
        .first()
        .click()
        .type(email);
    }
  
    getPassword() {
      return this.elements.loginPage_password().last();
    }
  
    enterPassword(password) {
      this.elements.loginPage_password()
        .last()
        .click()
        .type(password);
    }
  
    showPassword() {
      return this.elements.showPassword_button();
    }
  
    getButton() {
      return this.elements.loginPage_button();
    }
  
    clickLogin() {
      this.elements.loginPage_button().click();
    }
  }
  
  export default new LoginPage();
  