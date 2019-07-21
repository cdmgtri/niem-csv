
# NIEM CSV

This project provides an implementation of the [NIEM format interface](https://github.com/cdmgtri/niem), converting NIEM model objects to and from NIEM CSV files.

## Installation

```sh
npm i cdmgtri/niem cdmgtri/niem-csv
```

## Usage

Declarations and set up a new release object:

```js
let NIEM = require("niem");
let NIEM_CSV = require("niem-csv");

let niem = new NIEM();
let release = await niem.releases.sandbox("niem", "model", "4.1");
```

Load NIEM CSVs into the release object from a URL (call from an async function):

```js
// Use CSVs from the NIEM 4.1 release
let url = "https://raw.githubusercontent.com/NIEM/NIEM-Releases/master/csv/niem-4.1";

// Load CSVs into the new release object
await NIEM_CSV.loadReleaseURL(release, url);
}
```

Load NIEM CSVs into the release object from a local folder (call from an async function):

```js
let inputFolder = "input";
let errors = await NIEM_CSV.loadReleaseFolder(release, inputFolder);
```

Save the release object as CSVs:

```js
let outputFolder = "output";
NIEM_CSV.generateReleaseFolder(release, outputFolder);
```
