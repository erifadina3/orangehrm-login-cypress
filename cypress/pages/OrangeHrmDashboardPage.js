// cypress/pages/OrangeHrmDashboardPage.js

class OrangeHrmDashboardPage {
    elements = {
        directoryMenu: () => cy.contains('.oxd-main-menu-item', 'Directory').should('be.visible'),
        userProfileDropdown: () => cy.get('.oxd-userdropdown-tab').should('be.visible'),
        logoutButton: () => cy.get('.oxd-userdropdown-link').contains('Logout'),
        
        pageHeader: () => cy.get('.oxd-topbar-header-title'),
        searchNameInput: () => cy.get('.oxd-form-row').eq(0).find('input'),
        searchButton: () => cy.get('button[type="submit"]'),
        searchResultsList: () => cy.get('.orangehrm-directory-card')
    }

    clickDirectory() {
        this.elements.directoryMenu().click({force: true});
        return this;
    }

    logout() {
        this.elements.userProfileDropdown().click();
        this.elements.logoutButton().should('be.visible').click();
    }
    
    searchEmployee(name) {
        this.elements.searchNameInput().clear().type(name);
        this.elements.searchButton().click();
        return this;
    }
}

export default new OrangeHrmDashboardPage();