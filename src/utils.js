
let NIEM = require("niem-model");

let { StyleType } = NIEM.Namespace;

let { NamespaceRowStyles } = require("../src/types");

let TRUE = "1";
let FALSE = "0";

/**
 * @param {"0"|"1"} val
 * @returns {boolean}
 */
module.exports.getBoolean = function getBoolean(val) {
  return val === TRUE ? true : false;
}

/**
 * @param {boolean} bool
 * @returns {"0"|"1"}
 */
module.exports.convertBoolean = function convertBoolean(bool) {
  return bool ? TRUE : FALSE;
}

/**
 * @param {String} qname
 */
module.exports.getPrefix = (qname) => {
  if (qname && qname.includes(":")) {
    return qname.split(":")[0];
  }
  return "";
}

/**
 * @param {String} qname
 */
module.exports.getName = (qname) => {
  if (qname && qname.includes(":")) {
    return qname.split(":")[1];
  }
  return qname;
}

/**
 * Coverts a CSV namespace row style to a NIEM Namespace object style
 * @param {NamespaceRowStyles} style
 */
module.exports.getNamespaceStyle = (style) => {
  switch (style) {
    case "A":
      return "adapter";
    case "C":
      return "core";
    case "D":
      return "domain";
    case "E":
      return "code";
    case "N":
      return "external";
    case "P":
      return "proxy";
    case "S":
      return "utility";
  };
  return "";
};

/**
 * Converts a NIEM Namespace object style to a CSV namespace row style
 * @param {StyleType} style
 */
module.exports.getNamespaceRowStyle = (style) => {
  switch (style) {
    case "adapter":
      return "A";
    case "code":
      return "E";
    case "core":
      return "C";
    case "domain":
      return "D";
    case "extension":
      return "X";
    case "external":
      return "N";
    case "proxy":
      return "P";
    case "utility":
      return "S";
  };
  return "";
};

/**
 * @param {Object} object
 * @return {Object}
 */
module.exports.deepClone = (object) => {
  return JSON.parse( JSON.stringify(object) );
};

/**
 * Gets the full path of each subfolder from the given folder
 * @param {String[]} folder
 */
module.exports.getSubFolders = (folder) => {

  let fs = require("fs");
  let path = require("path");

  return fs
    .readdirSync(folder)
    .map( name => path.join(folder, name) )
    .filter( folder => fs.lstatSync(folder).isDirectory() );

};

/**
 * Gets the last subfolder or file name from the given folder
 * @param {String} folder
 */
module.exports.getFolderName = (folder) => {
  let path = require("path");
  return path.normalize(folder).split("/").pop();
};
