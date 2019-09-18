
let NIEM = require("niem-model");
let NIEM_CSV = require("../src/index");

let { Release } = NIEM;

let unitTests = [
  require("./unit/namespace"),
  require("./unit/localTerm"),
  require("./unit/property"),
  require("./unit/type"),
  require("./unit/facet"),
  require("./unit/subproperty")
];

/** @type {Release} */
let release;

/** @type {Object[]} */
let errors;

let niem = new NIEM();

describe("loadReleaseFolder", () => {

  beforeAll( async () => {
    release = await niem.releases.add("user", "test", "1.0");
    errors = await NIEM_CSV.loadReleaseFolder(release, "test/data/");
  });

  describe("Test release", () => {
    testLoadErrors( () => errors );
    testGenerate(() => release, "local");
  });

  // Run each unit test, passing in a function that returns the release variable.
  // - Jest would otherwise pass in the release variable before it was loaded,
  //   due to the order in which it executes.
  unitTests.forEach( test => test( () => release ) );

});


describe("loadReleaseURL", () => {

  beforeAll( async () => {
    let url = "https://raw.githubusercontent.com/NIEM/NIEM-Releases/master/csv/niem-4.1";
    release = await niem.releases.add("user", "niem", "4.1");
    errors = await NIEM_CSV.loadReleaseURL(release, url);
  }, 60000);

  describe("Test release", () => {
    testLoadErrors( () => errors );
    testGenerate(() => release, "url");
  });

});


/**
 * @param {Function} getErrors
 */
function testLoadErrors(getErrors) {
  test("load errors", () => {
    /** @type {Object[]} */
    let errors = getErrors();
    expect(errors.length).toBe(0);
  });
}

/**
 * @param {Function} getRelease
 * @param {String} folder
 */
function testGenerate(getRelease, folder) {
  test("generate", async () => {
    // TODO: Real check of output
    let release = getRelease();
    NIEM_CSV.generateReleaseFolder(release, "test/output/" + folder);
    expect(true).toBeTruthy();
  });
}
