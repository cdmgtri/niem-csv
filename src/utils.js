
let NIEM = require("niem");

let { NamespaceStyles } = NIEM.ModelObjects.Namespace;
let { Patterns } = NIEM.ModelObjects.Type;

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
  if (qname.includes(":")) {
    return qname.split(":")[0];
  }
  return "";
}

/**
 * @param {String} qname
 */
module.exports.getName = (qname) => {
  if (qname.includes(":")) {
    return qname.split(":")[1];
  }
  return qname;
}

/**
 * Coverts a CSV namespace row style to a NIEM Namespace object style
 * @param {NamespaceStyles} style
 * @returns {NamespaceRowStyles}
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
 * @param {NamespaceRowStyles} style
 * @returns {NamespaceStyles}
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
