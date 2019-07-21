
let NIEM = require("niem");

let { Release } = NIEM.ModelObjects;

/** @type {Release} */
let release;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  describe("Test sub-properties", () => {

    beforeAll( () => {
      release = getRelease();
    });

    test("counts", async () => {
      let subProperties = await release.subProperties.find();
      expect(subProperties.length).toBe(628);
    });

    test("optional unbounded cardinality", async () => {
      let subProperty = await release.subProperties.get("nc:PersonType", "nc:PersonName");
      expect(subProperty.min).toBe("0");
      expect(subProperty.max).toBe("unbounded");
      expect(subProperty.definition).toBe("");
    });

    test("required cardinality", async () => {
      let subProperty = await release.subProperties.get("ag:AgricultureProductionPlanType", "nc:LocationStateFIPS5-2Code");
      expect(subProperty.min).toBe("1");
      expect(subProperty.max).toBe("1");
    });

    test("definition", async () => {
      let subProperty = await release.subProperties.get("nc:VesselType", "nc:VesselCategoryAbstract");
      expect(subProperty.definition).toBe("A kind of vessel.");
    });

  });

};
