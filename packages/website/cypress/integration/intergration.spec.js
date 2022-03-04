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

    const fileName = "example.json";

    cy.wait(1000); // delay for drag-and-drop to work properly every time
    cy.get('.home-upload-dropzone input[type="file"]').attachFile(fileName, { force: true });

    cy.get(".home-uploaded-files").children().should("have.length", 1);

    // wait max 2 minutes, the portal might be slow at times
    cy.wait("@upload", { responseTimeout: 2 * 60 * 1000 });

    cy.contains(".upload-file", fileName).within(() => {
      cy.get("a")
        .invoke("text")
        .should("match", /\/[a-zA-Z0-9-_]{46}/);

      cy.contains("Copy").click();
      cy.contains("Copied").should("be.visible");
    });
  });
});
