const express = require("express");
const app = express();
const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();
var axios = require("axios").default;
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { authorize } = require("passport");
const router = (module.exports = require("express").Router());

//---------HANDLEBARS SETUP--------
const handlebars = require("express-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

const {
    CLIENT_ID,
    CLIENT_SECRET,
    DOMAIN,
    pageURL,
    WINES,
    WINERIES,
    MGMT_API_ACCESS_TOKEN,
} = require("./globals");
const { request } = require("express");

/* ------------- JWT Functions ------------- */
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    issuer: `https://${DOMAIN}/`,
    algorithms: ["RS256"],
});

/* ------------- Begin database functions ------------- */
function fromDatastore(item) {
    item.id = item[Datastore.KEY].id;
    return item;
}

function get_wine(id) {
    const key = datastore.key([WINES, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            throw new Error(400);
        } else {
            return entity.map(fromDatastore);
        }
    });
}

function post_wine(name, type, year, price, owner) {
    var key = datastore.key(WINES);
    const new_wine = {
        name: name,
        type: type,
        year: year,
        price: price,
        owner: owner,
    };
    return datastore.save({ key: key, data: new_wine }).then(() => {
        return key;
    });
}

function put_wine(id, name, type, year, price, owner) {
    const key = datastore.key([WINES, parseInt(id, 10)]);
    const wine = {
        name: name,
        type: type,
        year: year,
        price: price,
        owner: owner,
    };
    return datastore.save({ key: key, data: wine });
}

function get_wines_from_owner(owner) {
    const q = datastore.createQuery(WINES);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore).filter((item) => item.owner === owner);
    });
}

function get_wines_from_owner_paginated(req, owner) {
    var q = datastore.createQuery(WINES).limit(5);
    let results = {};
    if (Object.keys(req.query).includes("cursor")) {
        q = q.start(req.query.cursor);
    }
    return datastore.runQuery(q).then((entities) => {
        results = entities[0].map(fromDatastore).filter((item) => item.owner === owner);
        if (entities[1].moreResults !== datastore.NO_MORE_RESULTS) {
            results.next =
                req.protocol +
                "://" +
                req.get("host") +
                req.baseUrl +
                "?cursor=" +
                entities[1].endCursor;
        }
        return results;
    });
}

function get_wines_unprotected() {
    const q = datastore.createQuery(WINES);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore);
    });
}

function get_single_wine_from_owner(id, owner) {
    const key = datastore.key([WINES, parseInt(id, 10)]);
    return datastore.get(key).then((data) => {
        return fromDatastore(data[0]);
    });
}

function delete_wine(id) {
    const key = datastore.key([WINES, parseInt(id, 10)]);
    return datastore.delete(key);
}

/* ------------- end database functions ------------- */

/* ------------- API functionality ------------- */

//************************************************* DEVELOPMENT FUNCTIONS
//get all wines in database -> utility function for testing purposes
// router.get("/allWines", function (req, res, err) {
//     get_wines_unprotected().then((allWines) => {
//         res.status(200).send(allWines);
//     });
// });

router.delete("/deleteAll", function (req, res) {
    get_wines_unprotected().then((allWines) => {
        if (allWines.length === 0) {
            res.status(200).send("all wines deleted");
            return;
        }
        for (let i = 0; i < allWines.length; i++) {
            delete_wine(allWines[i].id);
        }
        res.status(200).send("all wines deleted");
    });
    return;
});

//*************************************************

//GET all wines
router.get("/", checkJwt, function (req, res, err) {
    get_wines_from_owner(req.user.sub)
        .then((allWines) => {
            let context = {};
            get_wines_from_owner_paginated(req, req.user.sub)
                .then((wines) => {
                    const numOfWineries = allWines.length;

                    //add self url
                    for (let i = 0; i < wines.length; i++) {
                        let selfLink = pageURL + "/wines/" + wines[i].id;
                        wines[i].self = selfLink;
                    }

                    //add self to any wines that own wines
                    for (let h = 0; h < wines.length; h++) {
                        if (wines[h].producer !== undefined) {
                            for (let j = 0; j < wines[h].producer.length; j++) {
                                let selfLink = pageURL + "/wineries/" + wines[h].producer[j].id;
                                wines[h].producer[j].self = selfLink;
                            }
                        }
                    }

                    context.Total_Number_of_Wines_in_Collection = numOfWineries;
                    context.wines = wines;
                    if (wines.next) context.next = wines.next;

                    const accepts = req.accepts("application/json");
                    if (!accepts) {
                        const error = "Requested (Accept) content type not available";
                        var badAccept = { Error: error };
                        res.status(406).send(badAccept);
                        return;
                    } else if (accepts === "application/json") {
                        res.status(200).json(context);
                        return;
                    } else {
                        res.status(500).send("Requested (Accept) content type not available");
                        return;
                    }
                })
                .catch(() => {
                    const error = "Could not find wines.";
                    const returnError = { Error: error };
                    res.status(404).send(returnError);
                    return;
                });
        })
        .catch(() => {
            const error = "Could not find wines.";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//GET a specific wine
router.get("/:wine_id", checkJwt, function (req, res) {
    get_wine(req.params.wine_id)
        .then((results) => {
            //check that the owner is the user
            if (req.user.sub !== results[0].owner) {
                const error = "Invalid wine owner. Only the wine's owner can get this wine";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }

            let selfLink = pageURL + "/wines/" + results[0].id;
            results[0].self = selfLink;
            //add producer self to returned object, if applicable
            //since a load can only have one producer, we can safely assume producer[0]
            if (results[0].producer !== undefined) {
                results[0].producer[0]["self"] = pageURL + "/wineries/" + results[0].producer[0].id;
            }
            const accepts = req.accepts(["application/json"]);
            if (!accepts) {
                const error = "Requested (Accept) content type not available";
                var badAccept = { Error: error };
                res.status(406).send(badAccept);
                return;
            } else if (accepts === "application/json") {
                res.status(200).json(results[0]);
                return;
            } else {
                res.status(500).send("Requested (Accept) content type not available");
                return;
            }
        })
        .catch(() => {
            const error = "Cannot find wine with this wine_id";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//POST a new wine
router.post("/", checkJwt, function (req, res) {
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data.";
        const returnError = { Error: error };
        res.status(415).send(returnError);
        return;
    }

    //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
    const validate = requestValidation(req.body.name, req.body.type, req.body.year, req.body.price);

    //something is wrong, display error
    if (validate[0] === 1) {
        let errorStringType = [" ", "name", "type"];
        let errors = [];
        for (let i = 1; i <= validate.length; i++) {
            //error found, add error
            if (validate[i] === 1) {
                if (i <= 2) {
                    errors.push(
                        "The " +
                            errorStringType[i] +
                            " must be a string between 1 and 35 characters"
                    );
                } else if (i === 3) errors.push("The year must be a 4 digit number");
                else if (i === 4)
                    errors.push("The price must be a number between 1 and 10 characters");
            }
        }
        const returnError = { Error: errors };
        res.status(400).send(returnError);
        return;
    }

    post_wine(req.body.name, req.body.type, req.body.year, req.body.price, req.user.sub)
        .then((key) => {
            res.location(req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id);
            res.status(201).send('{ "id": ' + key.id + " }");
        })
        .catch(() => {
            const error = "Error POSTing wine";
            const returnError = { Error: error };
            res.status(500).send(returnError);
            return;
        });
});

//DELETE a wine
router.delete("/:wine_id", checkJwt, function (req, res) {
    //get the wine with the given id
    get_single_wine_from_owner(req.params.wine_id, req.user.sub)
        .then((wine) => {
            //make sure the wine owner is the same as the person requesting deletion
            if (req.user.sub === wine.owner) {
                delete_wine(req.params.wine_id)
                    .then(() => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("SERVER ERROR: DELETING WINERY");
                    });
            } else {
                const error = "Invalid wine owner. Only the wine's owner can delete this wine";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }
        })
        .catch(() => {
            const error = "JWT valid, but could not find wine with this wine id";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//PUT a wine, all attributes required
router.put("/:wine_id", checkJwt, function (req, res) {
    //only accept JSON content-type request
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data";
        var wineTypeError = { Error: error };
        res.set("content-type", "application/json").status(415).send(wineTypeError);
        return;
    }

    //if wine is missing any attributes, return code 404, bad request
    if (
        req.params.wine_id === undefined ||
        req.params.wine_id === "" ||
        req.body.name === undefined ||
        req.body.year === undefined ||
        req.body.type === undefined ||
        req.body.price === undefined
    ) {
        //catch if missing params
        const error =
            "Missing one or more attributes. For a PUT request, all attributes must be given.";
        const missingAtt = { Error: error };
        res.status(400).send(missingAtt);
        return;
    }

    //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
    const validate = requestValidation(req.body.name, req.body.type, req.body.year, req.body.price);

    //something is wrong, display error
    if (validate[0] === 1) {
        let errorStringType = [" ", "name", "type"];
        let errors = [];
        for (let i = 1; i <= validate.length; i++) {
            //error found, add error
            if (validate[i] === 1) {
                if (i <= 2) {
                    errors.push(
                        "The " +
                            errorStringType[i] +
                            " must be a string between 1 and 35 characters"
                    );
                } else if (i === 3) errors.push("The year must be a 4 digit number");
                else if (i === 4)
                    errors.push("The price must be a number between 1 and 10 characters");
            }
        }
        const returnError = { Error: errors };
        res.status(400).send(returnError);
        return;
    }

    //all attributes accounted for, check that the wine_id is valid
    get_wine(req.params.wine_id)
        .then((result) => {
            //check that the owner is the user
            if (req.user.sub !== result[0].owner) {
                const error = "Invalid wine owner. Only the wine’s owner can edit this wine";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }

            put_wine(
                req.params.wine_id,
                req.body.name,
                req.body.type,
                req.body.year,
                req.body.price,
                result[0].owner
            )
                .then((key) => {
                    res.status(204).send();
                    return;
                })
                .catch(() => {
                    res.status(500).send("Something went wrong! -> PUT: put_wine");
                    return;
                });
            res.status(500);
            return;
        })
        .catch(() => {
            const error = "No wine with this wine_id found";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//PATCH a wine, update only what is given
router.patch("/:wine_id", checkJwt, function (req, res) {
    //only accept JSON content-type request
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data";
        var wineTypeError = { Error: error };
        res.set("content-type", "application/json").status(415).send(wineTypeError);
        return;
    }

    //if wine is missing id, return code 404, bad request
    if (req.params.wine_id === undefined || req.params.wine_id === "") {
        //catch if missing params
        const error = "Missing wine_id.";
        const missingAtt = { Error: error };
        res.status(400).send(missingAtt);
        return;
    }

    //first, get the wine
    get_wine(req.params.wine_id)
        .then((result) => {
            //check that the owner is the user
            if (req.user.sub !== result[0].owner) {
                const error = "Invalid wine owner. Only the wine’s owner can delete this wine";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }
            //populate our variables to use. If nothing given, use variable already in database
            let wineName = req.body.name;
            if (wineName === undefined) wineName = result[0].name;
            let wineyear = req.body.year;
            if (wineyear === undefined) wineyear = result[0].year;
            let winetype = req.body.type;
            if (winetype === undefined) winetype = result[0].type;
            let winePrice = req.body.price;
            if (winePrice === undefined) winePrice = result[0].price;

            //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
            const validate = requestValidation(wineName, winetype, wineyear, winePrice);

            //something is wrong, display error
            if (validate[0] === 1) {
                let errorStringType = [" ", "name", "type"];
                let errors = [];
                for (let i = 1; i <= validate.length; i++) {
                    //error found, add error
                    if (validate[i] === 1) {
                        if (i <= 2) {
                            errors.push(
                                "The " +
                                    errorStringType[i] +
                                    " must be a string between 1 and 35 characters"
                            );
                        } else if (i === 3) errors.push("The year must be a 4 digit number");
                        else if (i === 4)
                            errors.push("The price must be a number between 1 and 10 characters");
                    }
                }
                const returnError = { Error: errors };
                res.status(400).send(returnError);
                return;
            }

            //patch item by using put command (since we have all variables accounted for)
            put_wine(req.params.wine_id, wineName, winetype, wineyear, winePrice, result[0].owner)
                .then((key) => {
                    res.status(204).send();
                    return;
                })
                .catch(() => {
                    res.status(500).send("Something went wrong! -> PATCH: put_wine");
                    return;
                });
        })

        .catch(() => {
            const error = "No wine with this wine_id found";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

// ************** METHOD NOT ALLOWED - STATUS 405 ********************
router.delete("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to delete, please include /wine_id, where wine_id is the ID of the wine you wish to delete";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.put("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to put, please include /wine_id, where wine_id is the ID of the wine you wish to update";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.patch("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to patch, please include /wine_id, where wine_id is the ID of the wine you wish to update";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.post("/:wine_id", function (req, res) {
    const error =
        "This URL only accepts GET, DELETE, PUT AND PATCH. When trying to post, do not include a wine_id. One will be created for you upon completion.";
    const routeError = { Error: error };
    res.set("Accept", "GET, DELETE, PUT, PATCH");
    res.status(405).send(routeError).end();
});

app.use("/", router);

// *** error from login and request section ***
app.use(function (err, req, res, next) {
    //Error from GET, /wines
    if (
        (res.socket.parser.incoming.route.path === "/" ||
            res.socket.parser.incoming.route.path === "/:wine_id") &&
        res.socket.parser.incoming.method === "GET"
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token trying to get all wines from this owner.";
        res.status(401).json(context);
        return;
    }
    //Error from POST, /wines
    if (
        res.socket.parser.incoming.route.path === "/" &&
        res.socket.parser.incoming.method === "POST"
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token while creating a new wine.";
        res.status(401).json(context);
        return;
    }

    //error from PUT or PATCH, /wines
    if (
        res.socket.parser.incoming.route.path === "/:wine_id" &&
        (res.socket.parser.incoming.method === "PUT" ||
            res.socket.parser.incoming.method === "PATCH")
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token when trying to update a wine.";
        res.status(401).json(context);
        return;
    }

    //Error from DELETE, /wines
    if (
        res.socket.parser.incoming.route.path === "/:wine_id" &&
        res.socket.parser.incoming.method === "DELETE"
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token while trying to delete a wine.";
        res.status(401).json(context);
        return;
    }

    //all else fails, send generic response
    else {
        let context = {};
        context.error = "Unauthorized to view or edit this content. Please try again";
        res.status(401).send(context);
        return;
    }
});

/* ------------- Server functions ------------- */

//check validation
function requestValidation(name, type, year, price) {
    let result = [0, 0, 0, 0];
    //handle request validation
    if (typeof name !== "string" || name.length > 35 || name.length < 1) {
        result[0] = 1;
        result[1] = 1;
    }

    //handle request validation
    if (typeof type !== "string" || type.length > 35 || type.length < 1) {
        result[0] = 1;
        result[2] = 1;
    }

    //handle request validation
    if (typeof year !== "number" || year.toString().length !== 4 || year <= 999 || year >= 3000) {
        result[0] = 1;
        result[3] = 1;
    }

    //handle request validation
    if (typeof price !== "number" || price.toString().length >= 10 || price < 1) {
        result[0] = 1;
        result[4] = 1;
    }

    return result;
}

module.exports = app;
