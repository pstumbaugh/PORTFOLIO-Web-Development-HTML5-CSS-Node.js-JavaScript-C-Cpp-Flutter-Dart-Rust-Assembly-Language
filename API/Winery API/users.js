const express = require("express");
const app = express();

//---------HANDLEBARS SETUP--------
const handlebars = require("express-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

var axios = require("axios").default;
const {
    CLIENT_ID,
    CLIENT_SECRET,
    DOMAIN,
    pageURL,
    WINES,
    WINERIES,
    MGMT_API_ACCESS_TOKEN,
} = require("./globals");

// UNPROTECTED - get all users and info
app.get("/", (req, res) => {
    var options = {
        method: "GET",
        url: "https://" + DOMAIN + "/api/v2/users",
        params: { q: "logins_count:[1 TO *]", search_engine: "v3" },
        headers: { authorization: "Bearer " + MGMT_API_ACCESS_TOKEN },
    };

    axios
        .request(options)
        .then(function (response) {
            res.status(200).json(response.data);
        })
        .catch(function (error) {
            res.status(400).json(error);
        });
});

module.exports = app;
