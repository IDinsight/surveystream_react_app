class SurveysPage {
  elements = {
  };

  navigate(url) {
    cy.visit(url);
  }

}

export default new SurveysPage();
