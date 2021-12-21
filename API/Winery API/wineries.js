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

function get_winery(id) {
    const key = datastore.key([WINERIES, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            throw new Error(400);
        } else {
            return entity.map(fromDatastore);
        }
    });
}

function post_winery(name, grapeType, region, numVarieties, owner) {
    var key = datastore.key(WINERIES);
    const new_winery = {
        name: name,
        grapeType: grapeType,
        region: region,
        numVarieties: numVarieties,
        owner: owner,
    };
    return datastore.save({ key: key, data: new_winery }).then(() => {
        return key;
    });
}

function put_winery(id, name, grapeType, region, numVarieties, owner) {
    const key = datastore.key([WINERIES, parseInt(id, 10)]);
    const winery = {
        name: name,
        grapeType: grapeType,
        region: region,
        numVarieties: numVarieties,
        owner: owner,
    };
    return datastore.save({ key: key, data: winery });
}

function put_winery_with_wines(id, name, grapeType, region, numVarieties, owner, wines) {
    const key = datastore.key([WINERIES, parseInt(id, 10)]);
    const winery = {
        id: id,
        name: name,
        grapeType: grapeType,
        region: region,
        numVarieties: numVarieties,
        owner: owner,
        wines,
        wines,
    };
    return datastore.save({ key: key, data: winery });
}

function get_wineries_from_owner(owner) {
    const q = datastore.createQuery(WINERIES);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore).filter((item) => item.owner === owner);
    });
}

function get_wineries_from_owner_paginated(req, owner) {
    var q = datastore.createQuery(WINERIES).limit(5);
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

function get_wineries_unprotected() {
    const q = datastore.createQuery(WINERIES);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore);
    });
}

function get_single_winery_from_owner(id, owner) {
    const key = datastore.key([WINERIES, parseInt(id, 10)]);
    return datastore.get(key).then((data) => {
        return fromDatastore(data[0].filter((item) => item.owner === owner));
    });
}

function delete_winery(id) {
    const key = datastore.key([WINERIES, parseInt(id, 10)]);
    return datastore.delete(key);
}

function put_add_wine(winery_id, wine_id, wineName) {
    //add the wine to the winery
    const winery_key = datastore.key([WINERIES, parseInt(winery_id, 10)]);
    return datastore.get(winery_key).then((winery) => {
        if (typeof winery[0].wines === "undefined") {
            winery[0].wines = [];
        }
        let newWine = { id: wine_id, name: wineName };
        winery[0].wines.push(newWine);
        return datastore.save({ key: winery_key, data: winery[0] }).then(() => {
            //save the winery info on the wine
            //note - previous to calling function code checks if wine is already assigned, so we can safely assume there is no winery already assigned
            const wine_key = datastore.key([WINES, parseInt(wine_id, 10)]);
            return datastore.get(wine_key).then((wine) => {
                wine[0].producer = [];
                get_winery(winery_id).then((winery2) => {
                    let newWine = {
                        id: winery_id,
                        name: winery2[0].name,
                    };
                    wine[0].producer.push(newWine);
                    return datastore.save({ key: wine_key, data: wine[0] });
                });
            });
        });
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

function get_single_wine_from_owner(id, owner) {
    const key = datastore.key([WINES, parseInt(id, 10)]);
    return datastore.get(key).then((data) => {
        return fromDatastore(data[0]);
    });
}

/* ------------- end database functions ------------- */

/* ------------- API functionality ------------- */

//************************************************* DEVELOPMENT FUNCTIONS
//get all wineries in database -> utility function for testing
// router.get("/allWineries", function (req, res, err) {
//     get_wineries_unprotected().then((allWineries) => {
//         res.status(200).send(allWineries);
//     });
// });

router.delete("/deleteAll", function (req, res) {
    get_wineries_unprotected().then((allWineries) => {
        if (allWineries.length === 0) {
            res.status(200).send("No wineries to delete");
            return;
        }
        for (let i = 0; i < allWineries.length; i++) {
            delete_winery(allWineries[i].id);
        }
        res.status(200).send("all wineries deleted");
    });
    return;
});

//*************************************************

//GET all wineries from owner in database
router.get("/", checkJwt, function (req, res, err) {
    //if invalid token provided, display unauthorized message (handled by app.use at bottom server section)
    //else, return wineries from the user:
    let context = {};
    get_wineries_from_owner_paginated(req, req.user.sub)
        .then((wineries) => {
            //get all wineries from owner to get total amount
            get_wineries_from_owner(req.user.sub)
                .then((allWineries) => {
                    const numOfWineries = allWineries.length;
                    for (let i = 0; i < wineries.length; i++) {
                        let selfLink = pageURL + "/wineries/" + wineries[i].id;
                        wineries[i].self = selfLink;
                    }

                    //add self to any wineries that own wines
                    for (let h = 0; h < wineries.length; h++) {
                        if (wineries[h].wines !== undefined) {
                            for (let j = 0; j < wineries[h].wines.length; j++) {
                                let selfLink = pageURL + "/wines/" + wineries[h].wines[j].id;
                                wineries[h].wines[j].self = selfLink;
                            }
                        }
                    }

                    context.Total_Number_of_Wineries_in_Collection = numOfWineries;
                    context.wineries = wineries;
                    if (wineries.next) context.next = wineries.next;

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
                    const error = "Could not find wineries from this owner.";
                    const returnError = { Error: error };
                    res.status(404).send(returnError);
                    return;
                });
        })
        .catch(() => {
            const error = "Could not find wineries from this owner.";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//GET a specific winery
router.get("/:winery_id", checkJwt, function (req, res) {
    get_winery(req.params.winery_id)
        .then((results) => {
            //check that the owner is the user
            if (req.user.sub !== results[0].owner) {
                const error = "Invalid winery owner. Only the winery’s owner can get this winery";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }
            let selfLink = pageURL + "/wineries/" + results[0].id;
            results[0].self = selfLink;
            //if there are wines in this winery, add self link to wines
            if (results[0].wines !== undefined) {
                for (let i = 0; i < results[0].wines.length; i++) {
                    let selfLink = pageURL + "/wines/" + results[0].wines[i].id;
                    results[0].wines[i].self = selfLink;
                }
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
            const error = "Cannot find winery with this winery_id";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//POST a new winery
router.post("/", checkJwt, function (req, res) {
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data.";
        const returnError = { Error: error };
        res.status(415).send(returnError);
        return;
    }

    //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
    const validate = requestValidation(
        req.body.name,
        req.body.grapeType,
        req.body.region,
        req.body.numVarieties
    );

    //something is wrong, display error
    if (validate[0] === 1) {
        let errorStringType = [" ", "name", "grapeType", "region"];
        let errors = [];
        for (let i = 1; i <= validate.length; i++) {
            //error found, add error
            if (validate[i] === 1) {
                if (i <= 3) {
                    errors.push(
                        "The " +
                            errorStringType[i] +
                            " must be a string between 1 and 35 characters"
                    );
                } else errors.push("The numVarieties must be a number between 1 and 10 characters");
            }
        }
        const returnError = { Error: errors };
        res.status(400).send(returnError);
        return;
    }

    post_winery(
        req.body.name,
        req.body.grapeType,
        req.body.region,
        req.body.numVarieties,
        req.user.sub
    )
        .then((key) => {
            res.location(req.protocol + "://" + req.get("host") + req.baseUrl + "/" + key.id);
            res.status(201).send('{ "id": ' + key.id + " }");
        })
        .catch(() => {
            const error = "Error POSTing winery";
            const returnError = { Error: error };
            res.status(500).send(returnError);
            return;
        });
});

//DELETE a winery
router.delete("/:winery_id", checkJwt, function (req, res) {
    //get the winery with the given id
    get_winery(req.params.winery_id)
        .then((winery) => {
            //make sure the winery owner is the same as the person requesting deletion
            if (req.user.sub === winery[0].owner) {
                //check if winery has any wines associed, if yes, delete those wines
                if (winery[0].wines !== undefined) {
                    for (let i = 0; i < winery[0].wines.length; i++) {
                        get_wine(winery[0].wines[i].id)
                            .then((currWine) => {
                                //overright wine without producer
                                put_wine(
                                    currWine[0].id,
                                    currWine[0].name,
                                    currWine[0].type,
                                    currWine[0].year,
                                    currWine[0].price,
                                    currWine[0].owner
                                ).then(() => {});
                            })
                            .catch(() => {
                                const error = "Error deleting wine from winery";
                                const badWine = { Error: error };
                                res.status(500).send(badWine);
                                return;
                            });
                    }
                }

                delete_winery(req.params.winery_id)
                    .then(() => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("SERVER ERROR: DELETING WINERY");
                        return;
                    });
            } else {
                const error =
                    "Invalid winery owner. Only the winery's owner can delete this winery";
                const badWine = { Error: error };
                res.status(403).send(badWine);
                return;
            }
        })
        .catch(() => {
            const error = "JWT valid, but could not find winery with this winery id";
            const badWine = { Error: error };
            res.status(404).send(badWine);
            return;
        });
});

//PUT a winery, all attributes required
router.put("/:winery_id", checkJwt, function (req, res) {
    //only accept JSON content-type request
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data";
        var wineryTypeError = { Error: error };
        res.set("content-type", "application/json").status(415).send(wineryTypeError);
        return;
    }

    //if winery is missing any attributes, return code 404, bad request
    if (
        req.params.winery_id === undefined ||
        req.params.winery_id === "" ||
        req.body.name === undefined ||
        req.body.grapeType === undefined ||
        req.body.numVarieties === undefined ||
        req.body.region === undefined
    ) {
        //catch if missing params
        const error =
            "Missing one or more attributes. For a PUT request, all attributes must be given.";
        const missingAtt = { Error: error };
        res.status(400).send(missingAtt);
        return;
    }

    //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
    const validate = requestValidation(
        req.body.name,
        req.body.grapeType,
        req.body.region,
        req.body.numVarieties
    );

    //something is wrong, display error
    if (validate[0] === 1) {
        let errorStringType = [" ", "name", "grapeType", "region"];
        let errors = [];
        for (let i = 1; i <= validate.length; i++) {
            //error found, add error
            if (validate[i] === 1) {
                if (i <= 3) {
                    errors.push(
                        "The " +
                            errorStringType[i] +
                            " must be a string between 1 and 35 characters"
                    );
                } else errors.push("The numVarieties must be a number between 1 and 10 characters");
            }
        }
        const returnError = { Error: errors };
        res.status(400).send(returnError);
        return;
    }

    //all attributes accounted for, check that the winery_id is valid
    get_winery(req.params.winery_id)
        .then((result) => {
            //check that the owner is the user
            if (req.user.sub !== result[0].owner) {
                const error = "Invalid winery owner. Only the winery’s owner can edit this winery";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }
            //if there are wines associated, bring those over
            if (result[0].wines !== undefined) {
                put_winery_with_wines(
                    req.params.winery_id,
                    req.body.name,
                    req.body.grapeType,
                    req.body.region,
                    req.body.numVarieties,
                    result[0].owner,
                    result[0].wines
                )
                    .then((key) => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("Something went wrong! -> PUT: put_winery");
                        return;
                    });
            } else {
                put_winery(
                    req.params.winery_id,
                    req.body.name,
                    req.body.grapeType,
                    req.body.region,
                    req.body.numVarieties,
                    result[0].owner
                )
                    .then((key) => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("Something went wrong! -> PUT: put_winery");
                        return;
                    });
            }

            res.status(500);
            return;
        })
        .catch(() => {
            const error = "No winery with this winery_id found";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//PATCH a winery, update only what is given
router.patch("/:winery_id", checkJwt, function (req, res) {
    //only accept JSON content-type request
    if (req.get("content-type") !== "application/json") {
        const error = "Server only accepts application/json data";
        var wineryTypeError = { Error: error };
        res.set("content-type", "application/json").status(415).send(wineryTypeError);
        return;
    }

    //if winery is missing id, return code 404, bad request
    if (req.params.winery_id === undefined || req.params.winery_id === "") {
        //catch if missing params
        const error = "Missing winery_id.";
        const missingWineryID = { Error: error };
        res.status(404).send(missingWineryID);
        return;
    }

    //first, get the winery
    get_winery(req.params.winery_id)
        .then((result) => {
            //check that the owner is the user
            if (req.user.sub !== result[0].owner) {
                const error = "Invalid winery owner. Only the winery’s owner can edit this winery";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }

            //populate our variables to use. If nothing given, use variable already in database
            let wineryName = req.body.name;
            if (wineryName === undefined) wineryName = result[0].name;
            let wineryGrapeType = req.body.grapeType;
            if (wineryGrapeType === undefined) wineryGrapeType = result[0].grapeType;
            let wineryNumVarieties = req.body.numVarieties;
            if (wineryNumVarieties === undefined) wineryNumVarieties = result[0].numVarieties;
            let wineryRegion = req.body.region;
            if (wineryRegion === undefined) wineryRegion = result[0].region;

            //check validation (returns array, position 0 indicates if any errors were found, following positions relate to which errors)
            const validate = requestValidation(
                wineryName,
                wineryGrapeType,
                wineryRegion,
                wineryNumVarieties
            );

            //something is wrong, display error
            if (validate[0] === 1) {
                let errorStringType = [" ", "name", "grapeType", "region"];
                let errors = [];
                for (let i = 1; i <= validate.length; i++) {
                    //error found, add error
                    if (validate[i] === 1) {
                        if (i <= 3) {
                            errors.push(
                                "The " +
                                    errorStringType[i] +
                                    " must be a string between 1 and 35 characters"
                            );
                        } else
                            errors.push(
                                "The numVarieties must be a number between 1 and 10 characters"
                            );
                    }
                }
                const returnError = { Error: errors };
                res.status(400).send(returnError);
                return;
            }

            //patch item by using put command (since we have all variables accounted for)

            //if there are wines associated, bring those over
            if (result[0].wines !== undefined) {
                put_winery_with_wines(
                    req.params.winery_id,
                    wineryName,
                    wineryGrapeType,
                    wineryRegion,
                    wineryNumVarieties,
                    result[0].owner,
                    result[0].wines
                )
                    .then((key) => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("Something went wrong! -> PUT: put_winery");
                        return;
                    });
            } else {
                put_winery(
                    req.params.winery_id,
                    wineryName,
                    wineryGrapeType,
                    wineryRegion,
                    wineryNumVarieties,
                    result[0].owner
                )
                    .then((key) => {
                        res.status(204).send();
                        return;
                    })
                    .catch(() => {
                        res.status(500).send("Something went wrong! -> PUT: put_winery");
                        return;
                    });
            }
        })
        .catch(() => {
            const error = "No winery with this winery_id found";
            const returnError = { Error: error };
            res.status(404).send(returnError);
            return;
        });
});

//add a wine to a winery
router.put("/:winery_id/wines/:wine_id", checkJwt, function (req, res) {
    //if something is missing...
    if (req.params.winery_id === undefined || req.params.wine_id === undefined) {
        //catch if missing params
        const error = "The specified winery and/or wine does not exist";
        var badRequest = { Error: error };
        res.status(404).send(badRequest);
    } else {
        //first check to make sure winery exists
        get_winery(req.params.winery_id)
            .then((currWinery) => {
                if (currWinery[0] === undefined) {
                    const error = "The specified winery and/or wine does not exist";
                    var badRequest = { Error: error };
                    res.status(404).send(badRequest);
                    return;
                }
                // then check to make sure the load exists
                get_wine(req.params.wine_id)
                    .then((currWine) => {
                        //check that the owner is the user
                        if (req.user.sub !== currWine[0].owner) {
                            const error =
                                "Invalid winery owner. Only the winery’s owner can add wines to this winery";
                            const returnError = { Error: error };
                            res.status(403).send(returnError);
                            return;
                        }

                        if (currWine[0] === undefined) {
                            const error = "The specified winery and/or wine does not exist";
                            var badRequest = { Error: error };
                            res.status(404).send(badRequest);
                            return;
                        } else if (currWine[0].producer !== undefined) {
                            //check to see if the wine is already assigned somewhere
                            const error = "This wine is already assigned to a winery";
                            var badRequest = { Error: error };
                            res.status(403).send(badRequest);
                            return;
                        } else {
                            put_add_wine(req.params.winery_id, req.params.wine_id, currWine[0].name)
                                .then(() => {
                                    res.status(204).end();
                                })
                                .catch(() => {
                                    const error = "The specified winery and/or wine does not exist";
                                    var badRequest = { Error: error };
                                    res.status(404).send(badRequest);
                                });
                        }
                    })
                    .catch(() => {
                        const error = "The specified winery and/or wine does not exist";
                        var badRequest = { Error: error };
                        res.status(404).send(badRequest);
                    });
            })
            .catch(() => {
                const error = "The specified winery and/or wine does not exist";
                var badRequest = { Error: error };
                res.status(404).send(badRequest);
            });
    }
});

//delete wine from winery
router.delete("/:winery_id/wines/:wine_id", checkJwt, function (req, res) {
    //setup error object
    const error = "No winery with this winery_id or wine with this wine_id found";
    const badWineryWine = { Error: error };

    //if one of the items is missing, return code 404, bad request
    if (req.params.winery_id === undefined || req.params.wine_id === undefined) {
        //catch if missing params
        res.status(404).send(badWineryWine);
        return;
    }
    get_winery(req.params.winery_id) //get the winery
        .then((winery) => {
            //check that the owner is the user
            if (req.user.sub !== winery[0].owner) {
                const error =
                    "Invalid winery owner. Only the winery’s owner can delete wines from this winery";
                const returnError = { Error: error };
                res.status(403).send(returnError);
                return;
            }

            if (winery[0] === undefined) {
                //check if winery doesn't exist
                res.status(404).send(badWineryWine);
                return;
            }
            get_wine(req.params.wine_id) //get the wine
                .then((wine) => {
                    //check that the owner is the user
                    if (req.user.sub !== wine[0].owner) {
                        const error =
                            "Invalid winery owner. Only the winery’s owner can delete wines from this winery";
                        const returnError = { Error: error };
                        res.status(403).send(returnError);
                        return;
                    }

                    if (wine[0] === undefined || wine[0].producer === undefined) {
                        //check if wine doesn't exist OR if wine does not have a winery (unassigned)
                        const error1 =
                            "This wine_id doesn't exist or is does not have a winery associated";
                        var wineNotInWinery = { Error: error1 };
                        res.status(404).send(wineNotInWinery);
                        return;
                    }

                    //remove the winery from the load
                    put_wine(
                        wine[0].id,
                        wine[0].name,
                        wine[0].type,
                        wine[0].year,
                        wine[0].price,
                        wine[0].owner
                    )
                        .then(() => {
                            //get the position of our load on the boat (if multiple)
                            let winePos = 0;
                            while (winePos < winery[0].wines.length) {
                                if (wine[0].id === winery[0].wines[winePos].id) break;
                                winePos++;
                            }

                            //create a new list of wines for the winery
                            let newWines = [];
                            for (let i = 0; i < winery[0].wines.length; i++) {
                                if (i !== winePos) {
                                    newWines.push(winery[0].wines[i]);
                                }
                            }
                            if (newWines.length === 0) {
                                //no wines left on boat, remove it from boat completely
                                put_winery(
                                    winery[0].id,
                                    winery[0].name,
                                    winery[0].grapeType,
                                    winery[0].region,
                                    winery[0].numVarieties,
                                    winery[0].owner
                                )
                                    .then(() => {
                                        res.status(204).send();
                                        return;
                                    })
                                    .catch(() => {
                                        res.status(404).send(badWineryWine);
                                        return;
                                    });
                            } else {
                                //still wines on the boat, keep remaining wines
                                put_winery_with_wines(
                                    winery[0].id,
                                    winery[0].name,
                                    winery.grapeType,
                                    winery[0].region,
                                    winery[0].numVarieties,
                                    winery[0].owner,
                                    newWines
                                )
                                    .then(() => {
                                        res.status(204).send();
                                        return;
                                    })
                                    .catch(() => {
                                        res.status(404).send(badWineryWine);
                                        return;
                                    });
                            }
                        })
                        .catch(() => {
                            res.status(404).send(badWineryWine);
                            return;
                        });
                })
                .catch(() => {
                    res.status(404).send(badWineryWine);
                    return;
                });
        })
        .catch(() => {
            res.status(404).send(badWineryWine);
            return;
        });
});

// *********************** METHOD NOT ALLOWED - STATUS 405 ****************************
router.patch("/:winery_id/wines/:wine_id", function (req, res) {
    const error = "This URL only accepts PUT and DELETE.";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.get("/:winery_id/wines/:wine_id", function (req, res) {
    const error = "This URL only accepts PUT and DELETE.";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.post("/:winery_id/wines/:wine_id", function (req, res) {
    const error = "This URL only accepts PUT and DELETE.";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.delete("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to delete, please include /winery_id, where winery_id is the ID of the winery you wish to delete";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.put("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to put, please include /winery_id, where winery_id is the ID of the winery you wish to update";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.patch("/", function (req, res) {
    const error =
        "This URL only accepts GET and POST. When trying to patch, please include /winery_id, where winery_id is the ID of the winery you wish to update";
    const routeError = { Error: error };
    res.set("Accept", "GET, POST");
    res.status(405).send(routeError).end();
});

router.post("/:winery_id", function (req, res) {
    const error =
        "This URL only accepts GET, DELETE, PUT AND PATCH. When trying to post, do not include a winery_id. One will be created for you upon completion.";
    const routeError = { Error: error };
    res.set("Accept", "GET, DELETE, PUT, PATCH");
    res.status(405).send(routeError).end();
});

app.use("/", router);

// *** error from login and request section ***
app.use(function (err, req, res, next) {
    //Error from GET, /wineries
    if (
        (res.socket.parser.incoming.route.path === "/" ||
            res.socket.parser.incoming.route.path === "/:winery_id") &&
        res.socket.parser.incoming.method === "GET"
    ) {
        let context = {};
        context.unauthorized =
            "Invalid or missing token trying to get all wineries from this owner.";
        res.status(401).json(context);
        return;
    }
    //Error from POST, /wineries
    if (
        res.socket.parser.incoming.route.path === "/" &&
        res.socket.parser.incoming.method === "POST"
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token while creating a new winery.";
        res.status(401).json(context);
        return;
    }

    //error from PUT or PATCH, /wineries
    if (
        res.socket.parser.incoming.route.path === "/:winery_id" &&
        (res.socket.parser.incoming.method === "PUT" ||
            res.socket.parser.incoming.method === "PATCH")
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token when trying to update a winery.";
        res.status(401).json(context);
        return;
    }

    //Error from DELETE, /wineries
    if (
        res.socket.parser.incoming.route.path === "/:winery_id" &&
        res.socket.parser.incoming.method === "DELETE"
    ) {
        let context = {};
        context.unauthorized = "Invalid or missing token while trying to delete a winery.";
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
function requestValidation(name, grapeType, region, numVarieties) {
    let result = [0, 0, 0, 0];
    //handle request validation
    if (typeof name !== "string" || name.length > 35 || name.length < 1) {
        result[0] = 1;
        result[1] = 1;
    }

    //handle request validation
    if (typeof grapeType !== "string" || grapeType.length > 35 || grapeType.length < 1) {
        result[0] = 1;
        result[2] = 1;
    }
    //handle request validation
    if (typeof region !== "string" || region.length > 35 || region.length < 1) {
        result[0] = 1;
        result[3] = 1;
    }

    //handle request validation
    if (
        typeof numVarieties !== "number" ||
        numVarieties.toString().length >= 10 ||
        numVarieties < 1
    ) {
        result[0] = 1;
        result[4] = 1;
    }

    return result;
}

module.exports = app;
