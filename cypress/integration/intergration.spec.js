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
    cy.server();
    cy.route("POST", "/skynet/skyfile").as("upload");

    const fileName = "check.json";

    cy.get('.home-upload input[type="file"]').attachFile(fileName);

    cy.get(".home-uploaded-files").children().should("have.length", 1);

    cy.wait("@upload");

    cy.contains(".upload-file", fileName).within(() => {
      cy.get(".url")
        .invoke("text")
        .should("match", /\/[a-zA-Z0-9-_]{46}/);

      cy.contains("Copy Link").click();
      cy.contains("Copied!").should("be.visible");
      cy.contains("Copied!").should("not.be.visible");
    });
  });
});
