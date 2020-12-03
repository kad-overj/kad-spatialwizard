const LOCATION_SERVER_ENDPOINT = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?fq=bron:BAG&q=";
//const BAG_LINK_DOC = "https://bag.basisregistraties.overheid.nl/bag/doc/nummeraanduiding/";

interface ResponseObject {
  response: Response;
}

interface Response {
  numFound: number;
  start: number;
  docs: Document[];
}

interface Document {
  bron: string;
  woonplaatscode: string;
  type: string;
  woonplaatsnaam: string;
  huis_nlt: string;
  openbareruimtetype: string;
  gemeentecode: string;
  rdf_seealso: string;
  weergavenaam: string;
  straatnaam_verkort: string;
  id: string;
  gemeentenaam: string;
  identificatie: string;
  openbareruimte_id: string;
  provinciecode: string;
  postcode: string;
  provincienaam: string;
  centroide_ll: string;
  nummeraanduiding_id: string;
  adresseerbaarobject_id: string;
  huisnummer: number;
  provincieafkorting: string;
  centroide_rd: string;
  straatnaam: string;
  score: number;
}

async function getAdressFromLocationServer(adress: String, place: String) {
  try {
    const response = await fetch(LOCATION_SERVER_ENDPOINT + adress + " " + place, {
      method: "GET",
      headers: {
        "Content-Type": "applciation/json",
      },
    });

    return response.json();
  } catch (err) {
    throw err;
  }
}

export function getAdressId(adress: String, place: String) {
  return getAdressFromLocationServer(adress, place).then((resp: ResponseObject) => {
    if (resp.response.numFound == 0) {
      throw new Error("No results found for " + adress + " in " + place);
    } else {
      if (resp.response.docs[0].openbareruimte_id == undefined) {
        alert(adress + " is not found in " + place);
        throw new Error("No results found for " + adress + " in " + place);
      } else {
        return resp.response.docs[0].rdf_seealso;
      }
    }
  });
}
