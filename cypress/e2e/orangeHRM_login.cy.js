///<reference types = "cypress"/>

describe('OrangeHRM Test Login - 10 Test Cases', ()=> {
  const URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const VALID_USER = 'Admin';
  const VALID_PASS = 'admin123';
  const INVALID_PASS = 'salah123';
  const INVALID_USER = 'SalahUser';
  const REQUIRED_MSG = 'Required';
  const INVALID_CREDS_MSG = 'Invalid credentials';
  
  const login = (username, password) => {
   if (username) cy.get('input[name="username"]').type(username);
   if (password) cy.get('input[name="password"]').type(password);
   cy.get('button[type="submit"]').click();
  };

  beforeEach(() => {
   cy.visit(URL);
   cy.url().should('include', '/auth/login');
  });

 // Test Case pada Fitur Login OrangeHRM \\
  it('TC-001: Login Berhasil dengan Username dan Password Valid', ()=> {
   login(VALID_USER, VALID_PASS);
   cy.url().should('include', '/web/index.php/dashboard/index');
   cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
  });

  it('TC-002: Login Gagal - Username Valid dan Password Invalid', ()=> {
   login(VALID_USER, INVALID_PASS);
   cy.get('.oxd-alert-content-text').should('be.visible').and('contain', INVALID_CREDS_MSG);
  });

  it('TC-003: Login Gagal - username Invalid dan Password Valid', ()=> {
   login(INVALID_USER, VALID_PASS);
   cy.get('.oxd-alert-content-text').should('be.visible').and('contain', INVALID_CREDS_MSG);
  });

  it('TC-004: Login Gagal - username dan Password kosong', ()=> {
   cy.get('button[type="submit"]').click();
   cy.get('input[name="username"]').closest('.oxd-input-field').find('.oxd-input-field-error-message').should('contain', REQUIRED_MSG);
   cy.get('input[name="password"]').closest('.oxd-input-field').find('.oxd-input-field-error-message').should('contain', REQUIRED_MSG);
  });

  it('TC-005: Login Gagal - Hanya mengisi Username (Password Kosong)', ()=> {
   login(VALID_USER, null);
   cy.get('input[name="password"]').closest('.oxd-input-field').find('.oxd-input-field-error-message').should('contain', REQUIRED_MSG);
  });

  it('TC-006: Login Gagal - Hanya mengisi Password (Username Kosong)', ()=> {
   login(null, VALID_PASS);
   cy.get('input[name="username"]').closest('.oxd-input-field').find('.oxd-input-field-error-message').should('contain', REQUIRED_MSG);
  });

  it('TC-007: Navigasi ke Halaman "Forgot your password?" Berhasil', ()=> {
   cy.get('.orangehrm-login-forgot > .oxd-text').should('be.visible').click();
   cy.url().should('include', '/requestPasswordResetCode');
   cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

  it('TC-008: Login Gagal - Input Spasi di kolom Username', ()=> {
   login(' ', VALID_PASS);
   cy.get('.oxd-alert-content-text').should('be.visible').and('contain', INVALID_CREDS_MSG);
  });

  it('TC-009: Login Gagal - Input Karakter spesial di Username', ()=> {
   login('Admin!@#', VALID_PASS);
   cy.get('.oxd-alert-content-text').should('be.visible').and('contain', INVALID_CREDS_MSG);
  });

  it('TC-010: Memastikan atribut Placeholder text sudah Benar', ()=> {
   cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username');
   cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
  });

});