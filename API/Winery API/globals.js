//---------GLOBAL VARIABLES SETUP--------
const {
    CLIENT_ID,
    CLIENT_SECRET,
    DOMAIN,
    MGMT_API_ACCESS_TOKEN,
} = require("./apiKeys.js");

const WINERIES = "Wineries";
const WINES = "Wines";

const pageURL = "http://localhost:8080"; //localhost
// const pageURL = "https://winery-coop.wn.r.appspot.com"; //google cloud

module.exports = {
    CLIENT_ID,
    CLIENT_SECRET,
    DOMAIN,
    pageURL,
    WINES,
    WINERIES,
    MGMT_API_ACCESS_TOKEN,
};
