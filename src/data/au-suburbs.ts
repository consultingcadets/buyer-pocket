import ACT from "./postcodes/ACT.json";
import NSW from "./postcodes/NSW.json";
import NT from "./postcodes/NT.json";
import QLD from "./postcodes/QLD.json";
import SA from "./postcodes/SA.json";
import TAS from "./postcodes/TAS.json";
import VIC from "./postcodes/VIC.json";
import WA from "./postcodes/WA.json";

export type AustralianSuburb = {
  suburb: string;
  state: string;
  postcode: string;
};

type PostcodeRow = {
  suburb: string;
  postcode: string;
};

function withState(state: string, rows: PostcodeRow[]): AustralianSuburb[] {
  return rows.map((row) => ({
    suburb: row.suburb,
    state,
    postcode: row.postcode,
  }));
}

export const AU_SUBURBS: AustralianSuburb[] = [
  ...withState("ACT", ACT as PostcodeRow[]),
  ...withState("NSW", NSW as PostcodeRow[]),
  ...withState("NT", NT as PostcodeRow[]),
  ...withState("QLD", QLD as PostcodeRow[]),
  ...withState("SA", SA as PostcodeRow[]),
  ...withState("TAS", TAS as PostcodeRow[]),
  ...withState("VIC", VIC as PostcodeRow[]),
  ...withState("WA", WA as PostcodeRow[]),
];

export function searchSuburbs(query: string, limit = 20, preferredState?: string | null): AustralianSuburb[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  const startsPreferred: AustralianSuburb[] = [];
  const startsOther: AustralianSuburb[] = [];
  const containsPreferred: AustralianSuburb[] = [];
  const containsOther: AustralianSuburb[] = [];
  for (const s of AU_SUBURBS) {
    const name = s.suburb.toLowerCase();
    const preferred = preferredState ? s.state === preferredState : false;
    if (name.startsWith(q)) {
      preferred ? startsPreferred.push(s) : startsOther.push(s);
    } else if (name.includes(q)) {
      preferred ? containsPreferred.push(s) : containsOther.push(s);
    }
  }
  return [
    ...startsPreferred,
    ...startsOther,
    ...containsPreferred,
    ...containsOther,
  ].slice(0, limit);
}
