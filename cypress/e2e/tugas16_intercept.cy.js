///<reference types = "cypress"/>

describe("Test Login OrangeHRM - Using Intercept in cypress", () => {
  // TC-001: Login Berhasil
  it("TC-001: Login Berhasil & Intercept Validasi Status Code 302", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");

    cy.intercept("POST", "/web/index.php/auth/validate").as("loginSuccess");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginSuccess").its("response.statusCode").should("eq", 302);

    cy.url().should("include", "/web/index.php/dashboard/index");
  });

  // TC-002: Login Gagal (Password Salah)
  it("TC-002: Login Gagal & Intercept Validasi Response Header Content-Type", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("salah123");

    cy.intercept("POST", "/web/index.php/auth/validate").as("loginFailHeader");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginFailHeader").its("response.headers").should("have.property", "content-type");

    cy.get(".oxd-alert-content-text").should("be.visible").and("contain", "Invalid credentials");
  });

  // TC-003: Login Gagal (Username Salah)
  it("TC-003: Login Gagal & Intercept Validasi Payload Request (Username)", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').type("SalahUser");
    cy.get('input[name="password"]').type("admin123");

    cy.intercept('POST', '/web/index.php/auth/validate').as('payloadCheck');

    cy.get('button[type="submit"]').click();

    cy.get(".oxd-alert-content-text").should("be.visible").and("contain", "Invalid credentials");
  });

  // TC-007: Navigasi Forgot Password
  it("TC-007: Navigasi Forgot Password & Intercept Validasi GET Request Font Asset", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.intercept("GET", "**/oxd-font/orangehrm.ttf").as("fontLoad");

    cy.get(".orangehrm-login-forgot > .oxd-text").should("be.visible").click();

    cy.url().should("include", "/requestPasswordResetCode");
  });

  // TC-008: Login Gagal (Input Spasi)
  it("TC-008: Login Gagal (Spasi) & Intercept Validasi Response Body Error Message", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').clear().type("{del}");
    cy.get('input[name="password"]').type("admin123");

    cy.intercept("POST", "/web/index.php/auth/validate").as("loginBlankStatus");

    cy.get('button[type="submit"]').click();
  });

  // TC-009: Login Gagal (Karakter Spesial)
  it("TC-009: Login Gagal (Karakter Spesial) & Intercept Validasi Request Method", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').type("Admin!@#");
    cy.get('input[name="password"]').type("admin123");

    cy.intercept("POST", "/web/index.php/auth/validate", (req) => {
      expect(req.method).to.equal("POST");
    }).as("methodCheck");

    cy.get('button[type="submit"]').click();

    cy.wait("@methodCheck");

    cy.get(".oxd-alert-content-text").should("be.visible").and("contain", "Invalid credentials");
  });

  // TC-010: Validasi Placeholder
  it("TC-010: Validasi Placeholder & Intercept GET Request Logo", () => {
    cy.intercept("GET", "**/logo.png").as("logoLoad"); 

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.wait(1000);

    cy.get('input[name="username"]').should("have.attr", "placeholder", "Username");
    cy.get('input[name="password"]').should("have.attr", "placeholder", "Password");
  });
  
});
