
let NIEM = require("niem-model");

let { Release, Facet } = NIEM;

/** @type {Release} */
let release;

/** @type {Facet[]} */
let facets;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  beforeAll( () => {
    release = getRelease();
  });

  describe("Test facets", () => {

    beforeAll( async () => {
      facets = await release.facets.find();
    });

    test("all facets", async () => {
      expect(facets.length).toBe(76);
    });

    test("codes", async () => {
      let codes = await release.facets.find({style: "enumeration"});
      expect(codes.length).toBe(72);
    });

    test("patterns", async () => {
      let patterns = await release.facets.find({style: "pattern"});
      expect(patterns.length).toBe(2);
    });

    test("facet types", () => {
      let typeQNames = new Set( facets.map( facet => facet.typeQName ) );
      expect(typeQNames.has("ncic:VMACodeSimpleType"));
    });

  });

};
