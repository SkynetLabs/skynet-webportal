/// <reference types="cypress" />

context("Skynet website", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false; // returning false here prevents Cypress from failing the test
  });

  beforeEach(() => {
    cy.visit("");
  });

  it("should render page title", () => {
    cy.contains("Decentralized Internet");
  });

  it("should be able to upload a file", () => {
    cy.intercept("POST", "/skynet/skyfile").as("upload");

    cy.wait(1000); // delay for drag-and-drop to work properly every time
    cy.get('.home-upload-dropzone input[type="file"]').selectFile("cypress/fixtures/example.json", { force: true });

    cy.get(".home-uploaded-files").children().should("have.length", 1);

    // wait max 2 minutes, the portal might be slow at times
    cy.wait("@upload", { responseTimeout: 2 * 60 * 1000 });

    cy.contains(".upload-file", "example.json").within(() => {
      cy.get("a").invoke("text").should("include", "AADXKUI_ddg_CEkQ747MzMVndJDbCma5jtkgmAzFbl9-Iw");

      cy.contains("Copy").click();
      cy.contains("Copied").should("be.visible");
    });
  });
});
