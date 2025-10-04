class OrangeHrmLoginPage {
    
    // 1. ELEMENT SELECTOR (Locator)
    elements = {
        usernameInput: () => cy.get('input[name="username"]').should('be.visible'),
        passwordInput: () => cy.get('input[name="password"]').should('be.visible'),
        loginButton: () => cy.get('button[type="submit"]').should('be.visible'),
        errorMessage: () => cy.get('.oxd-alert-content-text').should('be.visible'),
        dashboardHeader: () => cy.get('.oxd-topbar-header-title').should('be.visible'),

        forgotPasswordLink: () => cy.get('.orangehrm-login-forgot > .oxd-text').should('be.visible'), 
        resetPasswordButton: () => cy.get('button[type="submit"]'), 

        requiredMessageForInput: (name) => 
            cy.get(`input[name="${name}"]`).parents('.oxd-input-group').contains('.oxd-text', 'Required')
    }

    // 2. ACTION METHOD
    navigate() {
        cy.visit('/web/index.php/auth/login'); 
        cy.wait(3000);
    }

    typeUsername(username) {
        if (username) {
            this.elements.usernameInput().clear().type(username); 
        } else {
            this.elements.usernameInput().clear();
        }
        return this; 
    }

    typePassword(password) {
        if (password) {
            this.elements.passwordInput().clear().type(password); 
        } else {
            this.elements.passwordInput().clear();
        }
        return this;
    }

    clickLogin() {
        this.elements.loginButton().click();
    }

    login(username, password) { 
        this.typeUsername(username);
        this.typePassword(password);
        this.clickLogin();
    }

    clickResetPassword() {
        this.elements.resetPasswordButton().should('be.visible').click();
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