import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSessionTitle, pickCheapestAvailableModel } from "../extensions/title.ts";

test("normalizeSessionTitle nettoie la réponse du modèle", () => {
  assert.equal(normalizeSessionTitle('  "Organiser la revue finale !"\nignore'), "Organiser la revue finale");
  assert.equal(normalizeSessionTitle("Titre: optimiser la session de débogage."), "optimiser la session de débogage");
  assert.equal(normalizeSessionTitle("   "), undefined);
});

test("normalizeSessionTitle gère les réponses en anglais", () => {
  assert.equal(normalizeSessionTitle('title: Set up environment variables\nExtra text'), "Set up environment variables");
  assert.equal(normalizeSessionTitle('  Review the CI pipeline  '), "Review the CI pipeline");
  assert.equal(normalizeSessionTitle('"Debug authentication flow"'), "Debug authentication flow");
});

test("pickCheapestAvailableModel choisit le coût de sortie puis le coût d'entrée", () => {
  const models = [
    { id: "a", reasoning: true, cost: { input: 10, output: 4 } },
    { id: "b", reasoning: false, cost: { input: 12, output: 2 } },
    { id: "c", reasoning: false, cost: { input: 1, output: 2 } },
  ];

  assert.equal(pickCheapestAvailableModel(models)?.id, "c");
});
