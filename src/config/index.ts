import { ApplyTransformation, GetClassSuggestions, GetPropertySuggestions, GetTransformationScript } from "Definitions";
import getRattTransformationScript from "utils/ratt/getTransformation";
import getCowTransformationScript from "./cowScript";
import applyTransformation from "./rattScript";
import getRmlTransformationScript from "./rmlScript";
import { getClassSuggestions, getPropertySuggestions } from "./search";

export interface WizardConfig {
  defaultBaseIri: string;
  prefixesUrl: string;
  publishOrder: PublishElement[];
  getClassSuggestions: GetClassSuggestions;
  getPropertySuggestions: GetPropertySuggestions;
  getTransformationScript: GetTransformationScript;
  applyTransformation: ApplyTransformation;
}
export type PublishElement = "download" | "triplyDB";

export const wizardConfig: WizardConfig = {
  applyTransformation: applyTransformation,
  defaultBaseIri: "http://bag.basisregistraties.overheid.nl/def/bag#",
  getClassSuggestions: getClassSuggestions,
  getPropertySuggestions: getPropertySuggestions,
  prefixesUrl: "https://api.labs.kadaster.nl/datasets/kadaster/ld-wizard/prefixes",
  publishOrder: ["download", "triplyDB"],
  getTransformationScript: (config, type) => {
    switch (type) {
      case "cow":
        return getCowTransformationScript(config);
      case "ratt":
        return getRattTransformationScript(config);
      case "rml":
        return getRmlTransformationScript(config);
      default:
        throw new Error(`Script ${type} has not been implemented yet`);
    }
  },
};
