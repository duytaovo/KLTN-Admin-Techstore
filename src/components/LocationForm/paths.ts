type PATH = {
  CITIES: string;
  DISTRICTS: string;
  WARDS: string;
  LOCATION: string;
};
// export const PATHS: PATH = {
//   CITIES:
//     "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/cities.json",
//   DISTRICTS:
//     "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/districts",
//   WARDS:
//     "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/wards",
//   LOCATION:
//     "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/location.json",
// };

export const PATHS: PATH = {
  CITIES: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
  DISTRICTS:
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
  WARDS: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
  LOCATION:
    "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/location.json",
};
