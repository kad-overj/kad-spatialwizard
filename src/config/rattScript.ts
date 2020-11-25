import Ratt from "@triply/ratt";
import fromArray from "@triply/ratt/lib/middlewares/reading/fromArray";
import { Util, NamedNode, DataFactory } from "n3";
import toNtriplesString from "utils/ratt/middlewares/toNtriplesString";
import { ApplyTransformation } from "Definitions";
import { cleanCSVValue, getBaseIdentifierIri, getBasePredicateIri } from "utils/helpers";
import { getBagIdIriFromResponse, getBrtLocationIriFromResponse } from "./api_response";
import { getAdressId } from "./api_response_adress";

/**
 * Different from the other transformation script, as it is also used in the wizard to transform the data. See `/src/utils/ratt/getTransformation.ts` to get the transformation script itself
 * When making changes to this file make sure to copy the result to `/src/utils/ratt/applyTransformation.txt`
 */

/**
 * Applies the transformation using RATT
 * @param opts
 */

/*Get place names */

const applyTransformation: ApplyTransformation = async (opts) => {
  if (opts.type === "ratt" && Array.isArray(opts.source)) {
    const baseDefIri = Util.prefix(getBasePredicateIri(opts.config.baseIri.toString()));
    const baseInstanceIri = Util.prefix(getBaseIdentifierIri(opts.config.baseIri.toString()));

    const app = new Ratt();

    const getColumnConfig = (colName: string) =>
      opts.config.columnConfiguration.find((col) => col.columnName === colName);

    // Load from supplied array
    app.use(fromArray(opts.source));

    let rowCount = 0;
    const keyColumn =
      opts.config.key !== undefined &&
      opts.config.key >= 0 &&
      opts.config.columnConfiguration[opts.config.key].columnName;
    app.use(async (ctx, next) => {
      const subject = baseInstanceIri(!!keyColumn ? cleanCSVValue(ctx.record[keyColumn].value) : "" + rowCount);

      for (const col in ctx.record) {
        if (col === keyColumn) continue;
        if (ctx.record[col] && ctx.record[col].value.length > 0) {
          const colConf = getColumnConfig(col);
          if (!colConf) continue;
          const predicate = colConf.propertyIri ? new NamedNode(colConf.propertyIri) : baseDefIri(cleanCSVValue(col));
          let object;
          if (colConf.iriPrefix !== undefined) {
            object = new NamedNode(`${colConf.iriPrefix}${cleanCSVValue(ctx.record[col].value)}`);
          } else if (colConf.datatypeIri !== undefined) {
            object = DataFactory.literal(ctx.record[col].value, DataFactory.namedNode(colConf.datatypeIri));
          } else if (colConf.selectedTransformation === "linkToBag") {
            try {
              object = DataFactory.namedNode(await getBagIdIriFromResponse(ctx.record[col].value));
              console.log(rowCount);
            } catch {
              continue;
            }
          } else if (colConf.selectedTransformation === "geoPoint") {
            try {
              object = DataFactory.namedNode(await getBrtLocationIriFromResponse(ctx.record[col].value));
            } catch {
              continue;
            }
          } else if (colConf.selectedTransformation === "LinkToLocationServer") {
            try {
              object = DataFactory.namedNode(
                await getAdressId(ctx.record[col].value, colConf.linkedColumnValues[rowCount])
              );
              console.log(object);
            } catch {
              continue;
            }
          } else {
            object = ctx.record[col];
          }

          //Als colconfig.transformatie is LinkToBag dan voor de fucntie uit voor de response
          //Als er een response is dan uitvoeren anders skippen of loggen.
          ctx.store.addQuad(subject, predicate, object);
        }
      }
      ctx.store.addQuad(
        subject,
        ctx.app.prefix["rdf"]("type"),
        typeof opts.config.baseIri === "string" ? new NamedNode(opts.config.resourceClass) : opts.config.baseIri
      );
      rowCount++;
      return next(ctx.record, ctx.store);
    });
    const { mw, end } = toNtriplesString();
    app.use(mw);
    await app.run();
    return end();
  } else {
    throw new Error("Not supported");
  }
};
export default applyTransformation;
