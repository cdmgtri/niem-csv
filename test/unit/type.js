
let NIEM = require("niem-model");

let { Release } = NIEM;

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
      expect(type.style).toBe("object");
      expect(type.baseQName).toBe("");
      expect(type.definition).toBe("A data type for a human being.");
    });

    test("adapter type", async () => {
      let type = await release.types.get("geo:CurveType");
      expect(type.style).toBe("adapter");
    });

    test("augmentation type", async () => {
      let type = await release.types.get("hs:PersonAugmentationType");
      expect(type.style).toBe("augmentation");
    });

    test("metadata type", async () => {
      let type = await release.types.get("nc:MetadataType");
      expect(type.style).toBe("metadata");
    });

    test("csc type with simple base", async () => {
      let type = await release.types.get("apco:AlarmEventCategoryCodeType");
      expect(type.style).toBe("CSC");
      expect(type.baseQName).toBe("apco:AlarmEventCategoryCodeSimpleType");
    });

    test("csc type with complex base", async () => {
      let type = await release.types.get("nc:TextType");
      expect(type.style).toBe("CSC");
      expect(type.baseQName).toBe("niem-xs:string");
    });

    test("simple type", async () => {
      let type = await release.types.get("nc:AddressCategoryCodeSimpleType");
      expect(type.style).toBe("simple");
      expect(type.baseQName).toBe("xs:token");
    });

    test("simple list type", async () => {
      let type = await release.types.get("nc:BooleanListSimpleType");
      expect(type.style).toBe("list");
      expect(type.baseQName).toBe("xs:boolean");
    });

    test("simple union type", async () => {
      let type = await release.types.get("biom:LatentFrictionRidgePositionCodeSimpleType");
      expect(type.style).toBe("union");
      expect(type.baseQName).toBe("");
    });

  });

};
