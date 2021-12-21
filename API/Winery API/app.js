//Patrick Stumbaugh
//export GCLOUD_PROJECT=winery-coop

const express = require("express");
const app = express();

//---------HANDLEBARS SETUP--------
const handlebars = require("express-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// ------------ SERVER SETUP AND INITIAL ROUTE ------------
app.use("/", require("./index"));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
