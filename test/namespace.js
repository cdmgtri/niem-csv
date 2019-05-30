
let NIEM = require("niem");

let { Release } = NIEM.ModelObjects;

/** @type {Release} */
let release;

/**
 * @param {Function} getRelease
 */
module.exports = (getRelease) => {

  describe("Test namespaces", () => {

    beforeAll( () => {
      release = getRelease();
    });

    test("count", async () => {
      let namespaces = await release.namespaces.find();
      expect(namespaces.length).toBe(69);
    });

    test("core", async () => {
      let core = await release.namespaces.get("nc");
      expect(core.style).toBe("core");
      expect(core.fileName).toBe("niem-core");
      expect(core.isPreGenerated).toBeFalsy();
      expect(core.uri).toBe("http://release.niem.gov/niem/niem-core/4.0/");
    });

    test("domains", async () => {
      let domains = await release.namespaces.find({style: "domain"});
      expect(domains.length).toBe(14);

      let prefixes = domains.map( domain => domain.prefix );
      expect(prefixes.includes("mo")).toBeTruthy();
      expect(prefixes.includes("nc")).toBeFalsy();
    });

  });
};
