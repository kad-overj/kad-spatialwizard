const BAG_LOCATION = "https://api.labs.kadaster.nl/queries/jorritovereem/WoonplaatsIriVanafLabel/run?woonplaats=";
const BRT_LOCATION_USING_GEOPOINT =
  "https://api.labs.kadaster.nl/queries/kadaster-dev/Find-a-Dutch-place-for-a-given-point/run?point=";
const LOCATION_SERVER_ENDPOINT = "http://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?bq=type:adress&q=";

async function getBagIdIri(place: String) {
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

export function getBagIdIriFromResponse(place: String) {
  return getBagIdIri(place).then((data: { woonplaatsIRI: string }[]) => {
    if (data.length == 0) {
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

async function getAdressIdFromLocationServer(adress: String) {
  try {
    const response = await fetch(LOCATION_SERVER_ENDPOINT + adress, {
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

export function getAdressId(adress: string) {
  return getAdressIdFromLocationServer(adress).then((data: { docs: string }[]) => {
    if (data.length == 0) {
      throw new Error("No results found for " + adress);
    }
    return data[0].docs;
  });
}
