
let NIEM = require("niem");

let { Release } = NIEM.ModelObjects;

/** @type {Release} */
let release;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  describe("Test properties", () => {

    beforeAll( () => {
      release = getRelease();
    });

    test("#concrete property", async () => {
      let p = await release.properties.get("nc:Activity");
      expect(p.prefix).toBe("nc");
      expect(p.name).toBe("Activity");
      expect(p.typeQName).toBe("nc:ActivityType");
      expect(p.definition).toBe("A single or set of related actions, events, or process steps.");
      expect(p.isElement).toBe(true);
      expect(p.isAbstract).toBe(false);
    });

    test("#abstract property", async () => {
      let p = await release.properties.get("nc:ActivityAugmentationPoint");
      expect(p.prefix).toBe("nc");
      expect(p.name).toBe("ActivityAugmentationPoint");
      expect(p.typeQName).toBe("");
      expect(p.definition).toBe("An augmentation point for ActivityType.");
      expect(p.isElement).toBe(true);
      expect(p.isAbstract).toBe(true);
    });

    test("#attribute", async () => {
      let p = await release.properties.get("nc:personNameInitialIndicator");
      expect(p.prefix).toBe("nc");
      expect(p.name).toBe("personNameInitialIndicator");
      expect(p.typeQName).toBe("xs:boolean");
      expect(p.definition).toBe("True if value represents the first letter or initials of a persons name; false otherwise.");
      expect(p.isElement).toBe(false);
      expect(p.isAbstract).toBe(false);
    });

    test("#substitution", async () => {
      let p = await release.properties.get("scr:ActivityProcessCategoryCode");
      expect(p.prefix).toBe("scr");
      expect(p.typeQName).toBe("scr:ActivityProcessCategoryCodeType");
      expect(p.groupQName).toBe("scr:ActivityProcessCategoryAbstract");
      expect(p.isElement).toBe(true);
      expect(p.isAbstract).toBe(false);
    });

    test("#property count", async () => {
      let properties = await release.properties.kinds.all();
      expect(properties.length).toBe(200);
    });

    test("#element count", async () => {
      let elements = await release.properties.kinds.elements();
      expect(elements.length).toBe(199);
    });

    test("#abstract counts", async () => {
      let abstracts = await release.properties.kinds.abstracts();
      expect(abstracts.length).toBe(47);
    });

    test("#attribute counts", async () => {
      let attributes = await release.properties.kinds.attributes();
      expect(attributes.length).toBe(1);
    });

  });

};
