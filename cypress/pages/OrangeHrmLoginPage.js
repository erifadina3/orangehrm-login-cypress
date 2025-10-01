class OrangeHrmLoginPage {
    
    // 1. ELEMENT SELECTOR (Locator)
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginButton: () => cy.get('button[type="submit"]'),
        errorMessage: () => cy.get('.oxd-alert-content-text'),
        dashboardHeader: () => cy.get('.oxd-topbar-header-title'),
        requiredMessageForInput: (name) => cy.get(`input[name="${name}"]`) 
                                         .parents('.oxd-input-group') 
                                         .find('.oxd-input-group > .orangehrm-login-slot > .oxd-text'),
        forgotPasswordLink: () => cy.get('.orangehrm-login-forgot > .oxd-text') 
    }

    // 2. ACTION METHOD
    navigate() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    typeUsername(username) {
        if (username) {
            this.elements.usernameInput().type(username);
        } else {
            this.elements.usernameInput().clear();
        }
        return this; 
    }

    typePassword(password) {
        if (password) {
            this.elements.passwordInput().type(password);
        } else {
            this.elements.passwordInput().clear();
        }
        return this;
    }

    clickLogin() {
        this.elements.loginButton().click();
    }

    performLogin(username, password) {
        this.typeUsername(username);
        this.typePassword(password);
        this.clickLogin();
    }

    clickForgotPassword() {
        this.elements.forgotPasswordLink().click();
    }

    // 3. VALIDASI METHOD
    validateDashboardUrl() {
        cy.url().should('include', '/web/index.php/dashboard/index');
    }

    validateErrorMessage(message) {
        this.elements.errorMessage().should('be.visible').and('contain', message);
    }
}

export default new OrangeHrmLoginPage();