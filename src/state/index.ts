import { atom, selector } from "recoil";
import { TransformationConfiguration, Matrix } from "Definitions";
import { PrefixesArray } from "@triply/utils/lib/prefixUtils";

const DEFAULT_PREFIXES: PrefixesArray = [
  {
    iri: "https://schema.org/",
    prefixLabel: "schema",
  },
];

export const sourceState = atom<File | string | undefined>({
  key: "source",
  default: undefined,
});

export const matrixState = atom<Matrix | undefined>({
  key: "matrix",
  default: undefined,
});

export const transformationConfigState = atom<TransformationConfiguration>({
  key: "config",
  default: {
    baseIri: "http://data.pldn.nl/GeoDataWizard/id/",
    columnConfiguration: [],
    sourceFileName: "input.csv",
    resourceClass: "http://data.pldn.nl/GeoDataWizard/def/",
    csvProps: {
      delimiter: ",",
    },
  },
});

export const prefixState = selector({
  key: "prefixes",
  get: async () => {
    try {
      const response = await fetch("https://api.labs.kadaster.nl/datasets/kadaster/ld-wizard/prefixes");
      if (response.ok) {
        const prefixes: PrefixesArray = await response.json();
        return prefixes;
      }
      return DEFAULT_PREFIXES;
    } catch {
      return DEFAULT_PREFIXES;
    }
  },
});
