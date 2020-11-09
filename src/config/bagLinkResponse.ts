import { data } from "autoprefixer";
import React from "react";
import { useState } from "react";

const BAG_LOCATION = "https://api.labs.kadaster.nl/queries/jorritovereem/WoonplaatsIriVanafLabel/run?woonplaats=";

interface Results {
  resultString?: string;
}

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
  var arr: any[] = [];
  getBagIdIri(place).then((data) => arr.push(data[0]));
  console.log(arr);
  return arr;
}
