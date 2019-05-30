
let NIEM = require("niem");
let NIEM_CSV = require("../src/index");

let { Release } = NIEM.ModelObjects;

let unitTests = [
  require("./namespace"),
  require("./localTerm"),
  require("./property"),
  require("./type"),
  require("./facet"),
  require("./subproperty")
];

/** @type {Release} */
let release;

/** @type {Object[]} */
let errors;

beforeAll( async () => {
  let niem = new NIEM();
  release = await niem.releases.sandbox("user", "test", "1.0");
  errors = await NIEM_CSV.loadReleaseFolder(release, "test/data/");
});

describe("Local CSVs", () => {

  test("load errors", async () => {
    expect(errors.length).toBe(0);
  });

});

// Run each unit test, passing in a function that returns the release variable.
// - Jest would otherwise pass in the release variable before it was loaded,
//   due to the order in which it executes.
unitTests.forEach( test => test( () => release ) );

describe("Generate", () => {

  test("#local files", async () => {
    NIEM_CSV.generateReleaseFolder(release, "test/output/");

    // TODO: Real check of output
    expect(true).toBeTruthy();
  });

});
