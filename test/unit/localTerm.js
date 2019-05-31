
let NIEM = require("niem");

let { Release } = NIEM.ModelObjects;

/** @type {Release} */
let release;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  describe("Test local terms", () => {

    beforeAll( () => {
      release = getRelease();
    });

    test("count", async () => {
      let terms = await release.localTerms.find();
      expect(terms.length).toBe(363);
    });

    test("namespace filter", async () => {
      let terms = await release.localTerms.find({prefix: "scr"});
      expect(terms.length).toBe(7);
    });

    test("literal", async () => {
      let term = await release.localTerms.get("mo", "URN");
      expect(term.literal).toBe("Unit Reference Number");
      expect(term.definition).toBe("");
    });

    test("definition", async () => {
      let term = await release.localTerms.get("ndex", "SEX");
      expect(term.literal).toBe("");
      expect(term.definition).toBe("The gender or sex of a person.");
    });

  });

};
