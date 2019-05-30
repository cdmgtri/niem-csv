
let NIEM = require("niem");
let Papa = require("papaparse");
let axios = require("axios").default;

let Utils = require("./utils");

let { Release, Namespace, LocalTerm, Property, Type, SubProperty, Facet } = NIEM.ModelObjects;

let { CSVs, NamespaceRow, LocalTermRow, PropertyRow, TypeRow, SubPropertyRow, FacetRow } = require("./types");

/**
 * @todo Implement type unions and metadata
 * @todo Implement keywords, example content, and usage info
 */
class NIEMSerializerCSV extends NIEM.Interfaces.NIEMSerializerInterface {

  /**
   * @todo NIEM CSVs cannot currently represent multiple models
   */
  static async loadSource() {
    return undefined;
  }

  /**
   * @todo NIEM CSVs cannot currently represent multiple releases
   */
  static async loadModel() {
    return undefined;
  }

  /**
   * @param {Release} release
   * @param {CSVs} CSVs
   */
  static async loadRelease(release, CSVs) {

    let config = {
      header: true,
      dynamicType: true,
      skipEmptyLines: true
    }

    let loadErrors = [];

    // For each CSV...
    for (let [key, csv] of Object.entries(CSVs)) {

      if (csv.data == "") {
        // Skip if no data provided
        console.log("Skipping " + key);
        continue;
      }

      // Parse CSV string
      let results = Papa.parse(csv.data, config);

      if (results.errors.length > 0) {
        results.errors.forEach( error =>{
          error.csv = key;
          error.row += 2;  // Adjust row num for zero-based index and header row
          loadErrors.push(error);
        });
      }

      // Run the loader function for the given CSV on each row of the data
      results.data.forEach( async row => {
        await NIEMSerializerCSV["load" + key](release, row);
      })

    }

    return loadErrors;

  }

  /**
   * @param {Release} release
   * @param {NamespaceRow} row
   */
  static async loadNamespace(release, row) {

    return release.namespaces.add({
      prefix: row.NamespacePrefix,
      fileName: row.NamespaceFile,
      uri: row.VersionURI,
      version: row.VersionReleaseNumber,
      style: Utils.getNamespaceStyle(row.NamespaceStyle),
      isPreGenerated: Utils.getBoolean(row.NamespaceIsExternallyGenerated),
      definition: row.Definition
    });

  }

  /**
   * @param {Release} release
   * @param {LocalTermRow} row
   */
  static async loadLocalTerm(release, row) {

    return release.localTerms.add({
      prefix: row.NamespacePrefix,
      term: row.GlossaryTerm,
      literal: row.GlossaryLiteral,
      definition: row.GlossaryDefinition
    });

  }

  /**
   * Loads properties from a CSV file to the given release.
   *
   * @param {Release} release
   * @param {PropertyRow} row
   */
  static async loadProperty(release, row) {

    return release.properties.add({
      prefix: row.PropertyNamespacePrefix,
      name: row.PropertyName,
      typeQName: row.QualifiedType,
      definition: row.Definition,
      groupQName: row.SubstitutionGroupQualifiedProperty,
      isElement: Utils.getBoolean(row.IsElement),
      isAbstract: Utils.getBoolean(row.IsAbstract)
    });

  }

  /**
   * @param {Release} release
   * @param {TypeRow} row
   */
  static async loadType(release, row) {

    let { Patterns } = Type;

    /** @type {Patterns} */
    let pattern;

    if (row.ContentStyle == "CCC") {
      if (Utils.getBoolean(row.IsAdapter) == true) {
        pattern = "adapter";
      }
      else if (Utils.getBoolean(row.IsAugmentation) == true) {
        pattern = "augmentation";
      }
      else if (Utils.getBoolean(row.IsMetadata) == true) {
        pattern = "metadata";
      }
      else {
        pattern = "object";
      }
    }
    else if (row.ContentStyle == "CSC") {
      pattern = "CSC";
    }
    else {
      if (row.SimpleStyle == "list") {
        pattern = "list";
      }
      else if (row.SimpleStyle == "union") {
        pattern = "union";
      }
      else {
        pattern = "simple";
      }
    }

    return release.types.add({
      prefix: row.TypeNamespacePrefix,
      name: row.TypeName,
      definition: row.Definition,
      baseQName: row.SimpleQualifiedType || row.ParentQualifiedType,
      pattern
    });

  }

  /**
   * @param {Release} release
   * @param {FacetRow} row
   */
  static async loadFacet(release, row) {
    return release.facets.add({
      typeQName: row.QualifiedType,
      kind: row.FacetName,
      value: row.FacetValue,
      definition: row.Definition
    });
  }

  /**
   * @param {Release} release
   * @param {SubPropertyRow} row
   */
  static async loadSubProperty(release, row) {
    return release.subProperties.add({
      typeQName: row.QualifiedType,
      propertyQName: row.QualifiedProperty,
      min: row.MinOccurs,
      max: row.MaxOccurs,
      definition: row.Definition
    });
  }

  /**
   * @todo NIEM CSVs cannot currently represent multiple models.
   */
  static async generateSource() {
    return undefined;
  }

  /**
   * @todo NIEM CSVs cannot currently represent multiple releases.
   */
  static async generateModel() {
    return undefined;
  }

  /**
   * @param {Release} release
   * @returns {Promise<CSVs>}
   */
  static async generateRelease(release) {

    // Prep release data
    CSVs.Namespace.objects = await release.namespaces.find();
    CSVs.LocalTerm.objects = await release.localTerms.find();
    CSVs.Property.objects = await release.properties.find();
    CSVs.Type.objects = await release.types.find();
    CSVs.Facet.objects = await release.facets.find();
    CSVs.SubProperty.objects = await release.subProperties.find();

    for (let [key, csv] of Object.entries(CSVs)) {

      // Convert NIEM objects to NIEM CSV row objects
      let rows = [];
      for (let object of csv.objects) {
        let row = await NIEMSerializerCSV["generate" + key](object);
        rows.push( row );
      }

      // Convert CSV row objects to CSV strings
      csv.data = Papa.unparse(rows);
    }

    return CSVs;

  }

  /**
   * @param {Namespace} namespace
   * @returns {Promise<NamespaceRow>}
   */
  static async generateNamespace(namespace) {
    return {
      NamespacePrefix: namespace.prefix,
      NamespaceFile: namespace.fileName,
      VersionURI: namespace.uri,
      VersionReleaseNumber: namespace.version,
      NamespaceStyle: Utils.getNamespaceRowStyle(namespace.style),
      NamespaceIsExternallyGenerated: namespace.isPreGenerated,
      IsConformant: Utils.convertBoolean(namespace.style != "external"),
      Definition: namespace.definition
    };
  }

  /**
   * @param {LocalTerm} localTerm
   * @returns {Promise<LocalTermRow>}
   */
  static async generateLocalTerm(localTerm) {
    return {
      NamespacePrefix: localTerm.prefix,
      GlossaryTerm: localTerm.term,
      GlossaryLiteral: localTerm.literal,
      GlossaryDefinition: localTerm.definition
    };
  }

  /**
   * @todo Implement keywords, example content, and usage info in NIEM components
   * @param {Property} property
   * @returns {Promise<PropertyRow>}
   */
  static async generateProperty(property) {
    return {
      PropertyNamespacePrefix: property.prefix,
      PropertyName: property.name,
      QualifiedProperty: property.qname,
      IsElement: Utils.convertBoolean(property.isElement),
      IsAbstract: Utils.convertBoolean(property.isAbstract),
      Keywords: "",
      ExampleContent: "",
      UsageInfo: "",
      Definition: property.definition,
      TypeNamespacePrefix: Utils.getPrefix(property.typeQName),
      TypeName: Utils.getName(property.typeQName),
      QualifiedType: property.typeQName,
      SubstitutionGroupPropertyNamespacePrefix: Utils.getPrefix(property.groupQName),
      SubstitutionGroupPropertyName: Utils.getName(property.groupQName),
      SubstitutionGroupQualifiedProperty: property.groupQName
    }
  }

  /**
   * @param {Type} type
   * @returns {Promise<TypeRow>}
   */
  static async generateType(type) {

    /** @type {TypeRow} */
    let typeRow = {
      TypeNamespacePrefix: type.prefix,
      TypeName: type.name,
      QualifiedType: type.qname,
      ContentStyle: type.style,
      SimpleStyle: "",
      IsMetadata: Utils.convertBoolean(type.pattern == "metadata"),
      IsAdapter: Utils.convertBoolean(type.pattern == "adapter"),
      IsAugmentation: Utils.convertBoolean(type.pattern == "augmentation"),
      Keywords: "",
      ExampleContent: "",
      UsageInfo: "",
      Definition: type.definition,
      SimpleTypeNamespacePrefix: "",
      SimpleTypeName: "",
      SimpleQualifiedType: "",
      ParentTypeNamespacePrefix: "",
      ParentTypeName: "",
      ParentQualifiedType: ""
    }

    if (type.baseQName.endsWith("SimpleType") || Utils.getPrefix(type.baseQName)) {
      typeRow.SimpleTypeNamespacePrefix = Utils.getPrefix(type.baseQName);
      typeRow.SimpleTypeName = Utils.getName(type.baseQName);
      typeRow.SimpleQualifiedType = type.baseQName;
    }
    else {
      typeRow.ParentTypeNamespacePrefix = Utils.getPrefix(type.baseQName);
      typeRow.ParentTypeName= Utils.getName(type.baseQName);
      typeRow.ParentQualifiedType = type.baseQName;
    }

    return typeRow;

  }

  /**
   * @param {Facet} facet
   * @returns {Promise<FacetRow>}
   */
  static async generateFacet(facet) {
    return {
      TypeNamespacePrefix: Utils.getPrefix(facet.typeQName),
      TypeName: Utils.getName(facet.typeQName),
      QualifiedType: facet.typeQName,
      FacetName: facet.kind,
      FacetValue: facet.value,
      Definition: facet.definition
    };
  }

  /**
   * @param {SubProperty} subProperty
   * @returns {Promise<SubPropertyRow>}
   */
  static async generateSubProperty(subProperty) {
    return {
      TypeNamespacePrefix: Utils.getPrefix(subProperty.typeQName),
      TypeName: Utils.getName(subProperty.typeQName),
      QualifiedType: subProperty.typeQName,
      PropertyNamespacePrefix: Utils.getPrefix(subProperty.propertyQName),
      PropertyName: Utils.getName(subProperty.propertyQName),
      QualifiedProperty: subProperty.propertyQName,
      MinOccurs: subProperty.min,
      MaxOccurs: subProperty.max,
      Definition: subProperty.definition,
      SequenceNumber: ""
    };
  }

  /**
   * @param {Release} release
   * @param {String} folder
   */
  static async loadReleaseFolder(release, folder) {

    let fs = require("fs");
    let path = require("path");

    folder = path.normalize(folder + "/");

    // Load each CSV file as a string
    for (let [key, csv] of Object.entries(CSVs)) {
      csv.data = fs.readFileSync(folder + csv.fileName, "utf8");
    }

    // Load the given release from the set of NIEM CSV strings
    return NIEMSerializerCSV.loadRelease(release, CSVs);

  }

  /**
   * @param {Release} release
   * @param {String} folder
   */
  static async generateReleaseFolder(release, folder) {

    let fs = require("fs");
    let path = require("path");

    folder = path.normalize(folder + "/");

    let CSVs = await NIEMSerializerCSV.generateRelease(release);

    // Write each CSV data string to a file
    for (let [key, csv] of Object.entries(CSVs)) {
      fs.writeFileSync(folder + csv.fileName, csv.data);
    }

  }

  /**
   * @param {Release} release
   * @param {String} url
   */
  static async loadReleaseURL(release, url) {

    if (!url.endsWith("/")) {
      url += "/";
    }

    csvStrings.Property = await axios.get(url + "Property.csv");
    return NIEMSerializerCSV.loadRelease(release, csvStrings);
  }

  static async loadReleaseGitHub(release, tag) {
    let url = `https://raw.githubusercontent.com/NIEM/NIEM-Releases/${tag}/csv/${tag}`;
    return NIEMSerializerCSV.loadReleaseURL(release, url);
  }


}

module.exports = NIEMSerializerCSV;
