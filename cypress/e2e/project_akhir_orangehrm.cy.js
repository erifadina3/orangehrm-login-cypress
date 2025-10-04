import LoginPage from '../pages/OrangeHrmLoginPage'; 
import DashboardPage from '../pages/OrangeHrmDashboardPage';

describe('Project Akhir: Otomasi OrangeHRM (POM & Intercept)', () => {

    const validUser = 'Admin';
    const validPass = 'admin123';

    beforeEach(() => {
+        cy.intercept('POST', '**/auth/validate').as('loginRequest');
+        cy.intercept('POST', '**/web/index.php/auth/sendPasswordReset').as('resetRequest');
+        cy.intercept('GET', '**/dashboard/index').as('dashboardLoad');
+        cy.intercept('GET', '**/api/v2/directory/employees**').as('directoryLoad');  

+        cy.visit('/web/index.php/auth/login');
    });

    // FITUR 1: LOGIN (3 TC) 
    describe('TC: Login Functionality (POM & Intercept)', () => {

        it('PA-001: Login Sukses - Memastikan redirect ke Dashboard dan Intercept Berhasil', () => {
            LoginPage.login(validUser, validPass);
            
            cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 302]);
            cy.url().should('include', '/dashboard');
            cy.wait('@dashboardLoad');
        });

        it('PA-002: Login Gagal - Kredensial Tidak Valid', () => {
            LoginPage.login('invalidUser', validPass);

            cy.wait('@loginRequest', { timeout: 10000 });
+           cy.url().should('include', '/auth/login');
            LoginPage.elements.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
        });
        
        it('PA-003: Login Gagal - Password Dikosongkan (Validasi Required Field)', () => {
             LoginPage.typeUsername(validUser)
                     .typePassword('')
                     .clickLogin();
            
            LoginPage.elements.requiredMessageForInput('password')
                     .should('be.visible').and('contain', 'Required');
        });
    });

    // FITUR 2: FORGOT PASSWORD (2 TC) 
    describe('TC: Forgot Password Functionality (POM & Intercept)', () => {
        
        it('PA-004: Forgot Password Sukses - Username Valid', () => {
            LoginPage.elements.forgotPasswordLink().click();
            cy.url().should('include', '/requestPasswordReset'); 
            
            LoginPage.typeUsername(validUser); 
            LoginPage.clickResetPassword();

            cy.wait('@resetRequest', { timeout: 15000 }).then((interception) => {
              expect(interception).to.have.property('response');
              const code = interception.response.statusCode;
              expect([200, 201, 302]).to.include(code);
            });
            cy.contains('A reset password link has been sent to you').should('be.visible');
        });
        
        it('PA-005: Forgot Password Gagal - Username Dikosongkan', () => {
            LoginPage.elements.forgotPasswordLink().click();
            cy.url().should('include', '/requestPasswordReset');

            LoginPage.typeUsername('');
            LoginPage.clickResetPassword();
            
            LoginPage.elements.requiredMessageForInput('username').should('be.visible').and('contain', 'Required');
        });
    });

    // FITUR 3: MENU DASHBOARD (DIRECTORY) (3 TC)
    describe('TC: Dashboard (Directory) Functionality (POM & Intercept)', () => {
        const longWait = 10000;

        beforeEach(() => {
            cy.session('LoggedInSession', () => {
                cy.visit('/web/index.php/auth/login');
                LoginPage.login(validUser, validPass);
                cy.url().should('include', '/dashboard');
            });
            
            cy.visit('/web/index.php/dashboard/index'); 
            cy.wait('@dashboardLoad', { timeout: longWait });
        });
        
        it('PA-006: Navigasi ke Directory dan Validasi Page Header', () => {
            DashboardPage.clickDirectory();
           
            cy.url().should('include', '/directory/viewDirectory');
            cy.wait('@directoryLoad', { timeout: longWait });

            DashboardPage.elements.pageHeader().should('contain', 'Directory');
        });
        
        it('PA-007: Pencarian Pegawai di Directory (Search Functionality)', () => {
            DashboardPage.clickDirectory();
            cy.url().should('include', '/directory/viewDirectory');
            cy.wait('@directoryLoad', { timeout: longWait }); 
            
            const searchName = 'Linda Anderson';
            cy.intercept('GET', '**/api/v2/directory/employees?*').as('searchExecuted'); 

            DashboardPage.searchEmployee(searchName);

            cy.wait('@searchExecuted', { timeout: longWait }); 
            DashboardPage.elements.searchResultsList().should('be.visible');
            cy.get('.oxd-text').first().should('be.visible');
        });
        
        it('PA-008: Logout Sukses dari Dashboard', () => {
            DashboardPage.logout();
            cy.url().should('include', '/auth/login');
        });
    });
});