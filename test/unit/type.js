
let NIEM = require("niem");

let { Release } = NIEM.ModelObjects;

/** @type {Release} */
let release;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  describe("Test types", () => {

    beforeAll( () => {
      release = getRelease();
    });

    test("type counts", async () => {
      let types = await release.types.find();
      expect(types.length).toBe(370);
    });

    test("object type", async () => {
      let type = await release.types.get("nc:PersonType");
      expect(type.pattern).toBe("object");
      expect(type.baseQName).toBe("");
      expect(type.definition).toBe("A data type for a human being.");
    });

    test("adapter type", async () => {
      let type = await release.types.get("geo:CurveType");
      expect(type.pattern).toBe("adapter");
    });

    test("augmentation type", async () => {
      let type = await release.types.get("hs:PersonAugmentationType");
      expect(type.pattern).toBe("augmentation");
    });

    test("metadata type", async () => {
      let type = await release.types.get("nc:MetadataType");
      expect(type.pattern).toBe("metadata");
    });

    test("csc type with simple base", async () => {
      let type = await release.types.get("apco:AlarmEventCategoryCodeType");
      expect(type.pattern).toBe("CSC");
      expect(type.baseQName).toBe("apco:AlarmEventCategoryCodeSimpleType");
    });

    test("csc type with complex base", async () => {
      let type = await release.types.get("nc:TextType");
      expect(type.pattern).toBe("CSC");
      expect(type.baseQName).toBe("niem-xs:string");
    });

    test("simple type", async () => {
      let type = await release.types.get("nc:AddressCategoryCodeSimpleType");
      expect(type.pattern).toBe("simple");
      expect(type.baseQName).toBe("xs:token");
    });

    test("simple list type", async () => {
      let type = await release.types.get("nc:BooleanListSimpleType");
      expect(type.pattern).toBe("list");
      expect(type.baseQName).toBe("xs:boolean");
    });

    test("simple union type", async () => {
      let type = await release.types.get("biom:LatentFrictionRidgePositionCodeSimpleType");
      expect(type.pattern).toBe("union");
      expect(type.baseQName).toBe("");
    });

  });

};
