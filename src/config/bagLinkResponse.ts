const BAG_LOCATION = "https://api.labs.kadaster.nl/queries/jorritovereem/WoonplaatsIriVanafLabel/run?woonplaats=";

/**
 * Gets autocomplete results
 * @param searchTerm The term to search for
 * @param type Which type of autocompletions you want ("class" || "property")
 * @param [location] location of the autocomplete ElasticSearch endpoint
 * @returns autocomplete results
 */

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
