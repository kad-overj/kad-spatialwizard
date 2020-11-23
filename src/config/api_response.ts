const BAG_LOCATION = "https://api.labs.kadaster.nl/queries/jorritovereem/WoonplaatsIriVanafLabel/run?woonplaats=";
const BRT_LOCATION_USING_GEOPOINT =
  "https://api.labs.kadaster.nl/queries/kadaster-dev/Find-a-Dutch-place-for-a-given-point/run?point=";
const LOCATION_SERVER_ENDPOINT = "https://geodata.nationaalgeoregister.nl/locatieserver/v2/free?fq=bron:BAG&q=";

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
  centroide_ll: string;
  centroide_rd: string;
  gemeentecode: string;
  gemeentenaam: string;
  id: string;
  identificatie: string;
  provincieafkorting: string;
  provinciecoe: string;
  provincienaam: string;
  score: number;
  type: string;
  weergavenaam: string;
  woonplaatscode: string;
  woonplaatsnaam: string;
}

async function getBagIdIri(place: Promise<String> | String) {
  try {
    const response = await fetch(BAG_LOCATION + place, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  } catch (err) {
    throw err;
  }
}

export async function getBagIdIriFromResponse(place: String) {
  console.log(await getWoonplaats(place));
  return getBagIdIri(await getWoonplaats(place)).then((data: { woonplaatsIRI: string }[]) => {
    if (data.length == 0) {
      alert("No Results found for " + place);
      throw new Error("No Results found for " + place);
    }
    return data[0].woonplaatsIRI;
  });
}

async function getBrtLocationFromGeoPoint(geopoint: String) {
  try {
    const response = await fetch(BRT_LOCATION_USING_GEOPOINT + geopoint, {
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

export function getBrtLocationIriFromResponse(geopoint: string) {
  return getBrtLocationFromGeoPoint(geopoint).then((data: { place: string }[]) => {
    if (data.length == 0) {
      throw new Error("No results found for " + geopoint);
    }
    return data[0].place;
  });
}

async function getWoonplaatsFromLocationServer(place: String) {
  try {
    const response = await fetch(LOCATION_SERVER_ENDPOINT + place, {
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

export function getWoonplaats(place: String) {
  return getWoonplaatsFromLocationServer(place).then((resp: ResponseObject) => {
    if (resp.response.numFound == 0) {
      throw new Error("No results found for " + place);
    } else {
      return resp.response.docs[0].woonplaatsnaam;
    }
  });
}
