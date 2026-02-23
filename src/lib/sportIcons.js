/**
 * Sport icon mapping — maps sport exercise names to Sporticon pictogram SVGs.
 * Icons are Olympic-style pictograms from the Sporticon set (Apache 2.0).
 * Files are in /public/sport-icons/*.svg
 */

const SPORT_ICON_MAP = {
  "basketball": "basketball",
  "soccer": "soccer",
  "football": "football",
  "tennis": "tennis",
  "badminton": "badminton",
  "table tennis": "table-tennis",
  "pickleball": "pickleball",
  "racquetball": "racquetball",
  "squash": "squash",
  "water polo": "water-polo",
  "volleyball": "volleyball",
  "baseball": "baseball",
  "softball": "softball",
  "hockey": "hockey",
  "lacrosse": "lacrosse",
  "rugby": "rugby",
  "cricket": "cricket",
  "golf": "golf",
  "boxing": "boxing",
  "kickboxing": "kickboxing",
  "mma training": "mma-training",
  "brazilian jiu-jitsu": "brazilian-jiu-jitsu",
  "karate": "karate",
  "judo": "judo",
  "taekwondo": "taekwondo",
  "wrestling": "wrestling",
  "fencing": "fencing",
  "rock climbing": "rock-climbing",
  "surfing": "surfing",
  "skiing": "skiing",
  "snowboarding": "snowboarding",
  "cross-country skiing": "cross-country-skiing",
  "skateboarding": "skateboarding",
  "rowing (sport)": "rowing-sport",
  "gymnastics": "gymnastics",
  "dance": "dance",
  "handball": "handball",
  "ultimate frisbee": "ultimate-frisbee",
  "crossfit": "crossfit",
  "track & field": "track-and-field",
  "swimming": "swimming",
  "cycling": "cycling",
  "triathlon": "triathlon",
  "ice hockey": "ice-hockey",
  "beach volleyball": "beach-volleyball",
  "figure skating": "figure-skating",
  "speed skating": "speed-skating",
  "curling": "curling",
  "sailing": "sailing",
  "weightlifting (olympic)": "weightlifting",
  "archery": "archery",
  "diving": "diving",
  "biathlon": "biathlon",
  "kayaking": "kayaking",
  "bowling": "bowling",
};

/**
 * All available sport icon file slugs, sorted alphabetically.
 * Each entry is { slug, label, url }.
 */
export const SPORT_ICONS = Object.entries(SPORT_ICON_MAP)
  .map(([name, file]) => ({
    slug: file,
    label: name.replace(/\b\w/g, (c) => c.toUpperCase()),
    url: `/sport-icons/${file}.svg`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Get the URL for a sport icon.
 * Checks explicit sportIcon slug first, then falls back to name-based lookup.
 * @param {string} sportName - The sport name (case-insensitive)
 * @param {string} [sportIcon] - Explicit icon slug override (e.g. "basketball")
 * @returns {string|null} URL path to the SVG icon, or null
 */
export function getSportIconUrl(sportName, sportIcon) {
  if (sportIcon) return `/sport-icons/${sportIcon}.svg`;
  if (!sportName) return null;
  const key = sportName.toLowerCase().trim();
  const file = SPORT_ICON_MAP[key];
  return file ? `/sport-icons/${file}.svg` : null;
}
