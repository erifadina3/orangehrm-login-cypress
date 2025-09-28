describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    //membuka halaman web
    cy.visit("https://example.cypress.io");

    //query element
    cy.contains("type").click();

    // assertion - diarahkan ke url/command/action
    cy.url().should("include", "/commands/actions");

    // query element dengan class 'action-email'
    cy.get(".action-email").type("fake@email.com");

    // assertion - element 'action-email'
    cy.get(".action-email").should("have.value", "fake@email.com");
  });
});
