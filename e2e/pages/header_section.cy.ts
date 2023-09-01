class HeaderSection {
  elements = {
    profile_icon: () => cy.get("#user_profile_avatar"),
    profile_dropdown: () => cy.get("div.ant-dropdown"),
    logout_link: () => cy.get("div.ant-dropdown").find("li").last(),
  };

  getUserAvatar() {
    return this.elements.profile_icon();
  }

  getProfileDropdown() {
    return this.elements.profile_dropdown();
  }

  clickAvatar() {
    this.elements.profile_icon().click();
  }
  clickLogout() {
    this.elements.logout_link().click();
  }
}

export default new HeaderSection();
