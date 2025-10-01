import OrangeHrmLoginPage from '../pages/OrangeHrmLoginPage';

describe('Automation Login - Using Page Object Model (POM)', () => {
    const validUser = 'Admin';
    const validPass = 'admin123';
    const invalidPass = 'salah123';
    const invalidUser = 'SalahUser';
    const specialCharUser = 'Admin!@#'; 

    beforeEach(() => {
        OrangeHrmLoginPage.navigate();
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('TC-001: Login dengan Username & Password Valid', () => {
        OrangeHrmLoginPage.performLogin(validUser, validPass);
        OrangeHrmLoginPage.validateDashboardUrl();
        OrangeHrmLoginPage.elements.dashboardHeader().should('be.visible').and('contain', 'Dashboard'); 
    });

    it('TC-002: Login Gagal - Password Salah', () => {
        OrangeHrmLoginPage.performLogin(validUser, invalidPass);
        OrangeHrmLoginPage.validateErrorMessage('Invalid credentials');
    });

    it('TC-003: Login Gagal - Username Salah', () => {
        OrangeHrmLoginPage.performLogin(invalidUser, validPass);
        OrangeHrmLoginPage.validateErrorMessage('Invalid credentials');
    });

    it('TC-004: Login Gagal - Username Dikosongkan', () => {
        OrangeHrmLoginPage.typeUsername(null).typePassword(validPass).clickLogin();
        OrangeHrmLoginPage.elements.requiredMessageForInput('username').should('be.visible').and('contain', 'Required');
    });

    it('TC-005: Login Gagal - Password Dikosongkan', () => {
        OrangeHrmLoginPage.typeUsername(validUser).typePassword(null).clickLogin();
        OrangeHrmLoginPage.elements.requiredMessageForInput('password').should('be.visible').and('contain', 'Required');
    });

    it('TC-006: Login Gagal - Username Karakter Spesial', () => {
        OrangeHrmLoginPage.performLogin(specialCharUser, validPass);
        OrangeHrmLoginPage.validateErrorMessage('Invalid credentials');
    });

    it('TC-007: Navigasi ke halaman Forgot Password', () => {
        OrangeHrmLoginPage.clickForgotPassword();
        cy.url().should('include', '/requestPasswordResetCode');
        cy.contains('Reset Password').should('be.visible');
    });
});