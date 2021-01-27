/// <reference types="cypress" />

context("Skynet", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("should render key website elements", () => {
    cy.contains("Build a Free Internet");
    cy.contains("Upload your Files");
    cy.contains("Have a Skylink?");
  });

  it("should be able to upload a file", () => {
    cy.intercept("POST", "/skynet/skyfile").as("upload");

    const fileName = "check.json";

    cy.wait(1000); // delay for drag-and-drop to work properly every time
    cy.get('.home-upload input[type="file"]').attachFile(fileName, { subjectType: 'drag-n-drop' });

    cy.get(".home-upload").scrollIntoView();
    cy.get(".home-uploaded-files").children().should("have.length", 1);

    // wait max 2 minutes, the portal might be slow at times
    cy.wait("@upload", { responseTimeout: 2 * 60 * 1000 });

    cy.contains(".upload-file", fileName).within(() => {
      cy.get(".url")
        .invoke("text")
        .should("match", /\/[a-zA-Z0-9-_]{46}/);

      cy.contains("Copy Link").click();
      cy.contains("Copied!").should("be.visible");
    });
  });
});
