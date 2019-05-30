
let CSVType = {
  fileName: "",
  data: ""
};

let CSVs = {
  Facet: {
    fileName: "Facet.csv",
    data: ""
  },
  LocalTerm: {
    fileName: "Glossary.csv",
    data: ""
  },
  Namespace: {
    fileName: "Namespace.csv",
    data: ""
  },
  Property: {
    fileName: "Property.csv",
    data: ""
  },
  Type: {
    fileName: "Type.csv",
    data: ""
  },
  SubProperty: {
    fileName: "TypeContainsProperty.csv",
    data: ""
  }
};

/**
 * C: Core
 * D: Domain
 * E: Code set
 * A: Adapter
 * N: Non-conformant
 * S: Utility
 * P: Proxy
 *
 * @type {"C"|"D"|"E"|"A"|"N"|"S"|"P"}
 */
let NamespaceRowStyles = "";

let NamespaceRow = {
  NamespacePrefix: "",
  NamespaceFile: "",
  VersionURI: "",
  VersionReleaseNumber: "",
  /** @type {NamespaceRowStyles} */
  NamespaceStyle: "",
  /** @type {"0"|"1"} */
  NamespaceIsExternallyGenerated: "",
  /** @type {"0"|"1"} */
  IsConformant: "",
  Definition: "",
};

let PropertyRow = {
  PropertyNamespacePrefix: "",
  PropertyName: "",
  QualifiedProperty: "",
  /** @type {"0"|"1"} */
  IsElement: "",
  /** @type {"0"|"1"} */
  IsAbstract: "",
  Keywords: "",
  ExampleContent: "",
  UsageInfo: "",
  Definition: "",
  TypeNamespacePrefix: "",
  TypeName: "",
  QualifiedType: "",
  SubstitutionGroupPropertyNamespacePrefix: "",
  SubstitutionGroupPropertyName: "",
  SubstitutionGroupQualifiedProperty: ""
};

let TypeRow = {
  TypeNamespacePrefix: "",
  TypeName: "",
  QualifiedType: "",
  /** @type {"CCC"|"CSC"|"S"} */
  ContentStyle: "",
  /** @type {"atomic"|"list"|"union"} */
  SimpleStyle: "",
  IsMetadata: "",
  IsAdapter: "",
  IsAugmentation: "",
  Keywords: "",
  ExampleContent: "",
  UsageInfo: "",
  Definition: "",
  SimpleTypeNamespacePrefix: "",
  SimpleTypeName: "",
  SimpleQualifiedType: "",
  ParentTypeNamespacePrefix: "",
  ParentTypeName: "",
  ParentQualifiedType: "",
};

let FacetRow = {
  TypeNamespacePrefix: "",
  TypeName: "",
  QualifiedType: "",
  FacetName: "",
  FacetValue: "",
  Definition: ""
};

let SubPropertyRow = {
  TypeNamespacePrefix: "",
  TypeName: "",
  QualifiedType: "",
  PropertyNamespacePrefix: "",
  PropertyName: "",
  QualifiedProperty: "",
  MinOccurs: "",
  MaxOccurs: "",
  Definition: "",
  SequenceNumber: ""
};

let LocalTermRow = {
  NamespacePrefix: "",
  GlossaryTerm: "",
  GlossaryLiteral: "",
  GlossaryDefinition: ""
};

module.exports = {
  CSVs,
  CSVType,
  NamespaceRow,
  NamespaceRowStyles,
  LocalTermRow,
  PropertyRow,
  TypeRow,
  FacetRow,
  SubPropertyRow
};
