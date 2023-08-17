class BasicInformationPage {
  elements = {
    continueButton: () => cy.get("#new-survey-config-continue-button"),
    saveButton: () => cy.get("#new-survey-config-save-button"),

    surveyMethodInput: () => cy.get("#basic-information-survey-method"),
    surveyNameInput: () => cy.get("#basic-information-survey-name"),
    surveyIdInput: () => cy.get("#basic-information-survey-id"),
    projectNameInput: () => cy.get("#basic-information-project-name"),
    surveyDescriptionInput: () =>
      cy.get("#basic-information-survey-description"),
    irbApprovalInput: () => cy.get("#basic-information-irb-approval"),
    startDateInput: () => cy.get("#basic-information-start-date"),
    endDateInput: () => cy.get("#basic-information-end-date"),
  };

  navigate(url: string) {
    cy.visit(url);
  }

  getContinueButton() {
    return this.elements.continueButton();
  }
  getSaveButton() {
    return this.elements.saveButton();
  }

  clickContinueButton() {
    this.elements.continueButton().click();
  }
  clickSaveButton() {
    this.elements.saveButton().click();
  }

  getSurveyName() {
    return this.elements.surveyNameInput();
  }

  enterSurveyName(text: string) {
    this.elements.surveyNameInput().first().click().type(text);
  }

  getSurveyId() {
    return this.elements.surveyIdInput();
  }

  enterSurveyId(text: string) {
    this.elements.surveyIdInput().first().click().type(text);
  }

  getProjectName() {
    return this.elements.projectNameInput();
  }
  enterProjectName(text: string) {
    this.elements.projectNameInput().first().click().type(text);
  }
  getSurveyDescription() {
    return this.elements.surveyDescriptionInput();
  }
  enterSurveyDescription(text: string) {
    this.elements.surveyDescriptionInput().first().click().type(text);
  }
  getSurveyMethod() {
    return this.elements.surveyMethodInput();
  }
  getIRBApproval() {
    return this.elements.irbApprovalInput();
  }
  getStartDate() {
    return this.elements.startDateInput();
  }
  getEndDate() {
    return this.elements.endDateInput();
  }
}

export default new BasicInformationPage();
