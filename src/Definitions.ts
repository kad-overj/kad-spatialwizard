import * as Rdf from "rdf-js";
/**
 * General definitions
 */
export type TransformationType = "ratt" | "cow" | "rml";
export type Matrix = Array<Array<string>>;
export type Source = File | string;
export type TransformationScript = string | {};
export type TransformationOutput = string;
export type AutocompleteSuggestion = string | Rdf.NamedNode | { iri: string; description?: string };
export type ColumnConfiguration = {
  columnName: string;
  propertyIri?: string;
  iriPrefix?: string;
  datatypeIri?: string;
  linkedColumnValues?: string[];
  selectedTransformation?: "linkToBag" | "geoPoint" | "LinkToLocationServer";
};

export interface TransformationConfiguration {
  /** Base IRI */
  baseIri: string | Rdf.NamedNode;
  /** Selected key column */
  key?: number;
  /** Column configuration */
  columnConfiguration: ColumnConfiguration[];
  /** Needed for RML to specify the input file */
  sourceFileName: string;
  /** Class URI applied to each row */
  resourceClass: string;
  /** Meta information about the CSV dialect */
  csvProps: {
    delimiter: string;
  };
}

/**
 * Add source data
 */
export type AddSourceFile = (file: Source) => void;

/**
 * Add transformation script
 */
export type AddTransformationScript = (file: Source, type: TransformationType) => void;

/**
 * Convert the source data to an internal matrix structure
 */
export type SourceFileToMatrix = (file: Source) => Promise<Matrix>;

/**
 * Set the base IRI
 */
export type SetBaseIri = (baseIri: string | Rdf.NamedNode) => void;

/**
 * Get suggestions for the class, given some textual input
 */
export type GetClassSuggestions = (partialString: string) => Promise<Array<AutocompleteSuggestion>>;

/**
 * Select a key column from the matrix
 */
export type SelectKeyColumn = (key: number) => void;

/**
 * Get suggestions for a property given some textual input
 */
export type GetPropertySuggestions = (partialString: string) => Promise<Array<AutocompleteSuggestion>>;

/**
 * Get the transformation script from the internal transformation configuration
 */
export type GetTransformationScript = (
  transformationConfiguration: TransformationConfiguration,
  forType: TransformationType
) => Promise<TransformationScript>;

export interface ApplyTransformationI {
  config: TransformationConfiguration;
  type: TransformationType;
  source: Source | Matrix;
}
/**
 * Apply the transformation to the source data
 */
export type ApplyTransformation = (opts: ApplyTransformationI) => Promise<TransformationOutput>;

export interface UploadTransformationI<P> {
  type: TransformationType;
  source: Source;
  transformation: TransformationScript;
  output: TransformationOutput;
  publishConfiguration: P;
}
/**
 * Upload the source data, transformation script, and transformation output to a public environment
 */
export type UploadTransformation<P> = (opts: UploadTransformationI<P>) => Promise<void>;
