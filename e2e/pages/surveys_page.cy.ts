class SurveysPage {
  elements = {
    configureNewSurveyLink: () => cy.get("#configure-new-survey-link"),
  };

  navigate(url: string) {
    cy.visit(url);
  }

  getConfigureNewSurveyLink() {
    return this.elements.configureNewSurveyLink();
  }

  clickConfigureNewSurveyLink() {
    this.elements.configureNewSurveyLink().click();
  }
}

export default new SurveysPage();
