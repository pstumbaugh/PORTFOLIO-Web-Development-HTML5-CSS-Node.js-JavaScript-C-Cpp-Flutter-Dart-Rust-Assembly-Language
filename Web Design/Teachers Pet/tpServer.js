var express = require("express");
const bodyParser = require("body-parser");

var request = require("request");
const fetch = require("node-fetch");
var fs = require("fs");
var path = require("path");
const { parse } = require("path");
var imgJson;

var port = 7788;

var app = express();
var handlebars = require("express-handlebars").create({
    defaultLayout: "main",
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", port);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-------------------HOME SECTION--------------------------------------------------------------//

//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/", async function (req, res) {
    var context = {};
    res.render("home", context);
});

app.get("/topWords", async function (req, res) {
    var context = {};
    var currSearchItem = req.query.searchItem;
    var currSearchSize = req.query.searchSize;

    var results;
    var spawn = require("child_process").spawn;
    var process = spawn("python", [
        "./topWords.py",
        currSearchItem,
        currSearchSize,
        "False",
    ]);

    process.stdout.on("data", function (data) {
        //console.log(data.toString());
        results = data.toString();
        setTimeout(function () {
            // ---------------DO WHAT YOU WITH HERE:
            context.stringResults = JSON.stringify(results);
            context.parsedResults = JSON.parse(context.stringResults);
            context.arrayResults = context.parsedResults.split("\n");
            console.log("TOP WORDS RESULTS: ", context.arrayResults);
            res.send(context);
        }, 500);
    });
});

/*
//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/test", async function (req, res) {
    var context = {};
    searchItem = "https://en.wikipedia.org/wiki/Peanut_butter";
    var testSearchItem = searchItem.includes("https://en.wikipedia.org/wiki/");
    var results;
    var spawn = require("child_process").spawn;
    if (testSearchItem == true) {
        var process = spawn("python", ["./topWords.py", searchItem]);
        process.stdout.on("data", function (data) {
            //console.log(data.toString());
            results = data.toString();
            setTimeout(function () {
                // ---------------DO WHAT YOU WITH HERE:
                var parsedResults = JSON.stringify(results);
                context.links = JSON.parse(parsedResults);
                res.render("home", context);
            }, 500);
        });
    } else {
        res.render("home", context);
    }
});
*/

/*
//home page setup
//Get and display (send back) all the items from the SQL table
app.get("/results", function (req, res) {
    var context = {};
    searchItem = "https://en.wikipedia.org/wiki/Peanut_butter";
    var testSearchItem = searchItem.includes("https://en.wikipedia.org/wiki/");
    var results;
    var spawn = require("child_process").spawn;

    var process = spawn("python", ["./wikipediaFerratPlus.py", searchItem]);
    process.stdout.on("data", function (data) {
        //console.log(data.toString());
        results = data.toString();
        // ---------------DO WHAT YOU WITH HERE:
        var parsedResults = JSON.stringify(results);
        context = JSON.parse(parsedResults);
    });
    setTimeout(function () {
        console.log(context);
        res.render("results", context);
    }, 500);
});
*/

/*
app.get("/results", function (req, res) {
    var context = {};
    sendTo();
    //getThumbnail();
});
*/

/*
function sendTo() {
    var amqp = require("amqplib/callback_api");
    var credentials = require("./credentials.js");

    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            console.log("IN HERE");
            if (error1) {
                throw error1;
            }

            var queue = "PatQueue";

            var msg =
                "https://web-city-pages.s3.amazonaws.com/or/portland/images/760x760.jpg?v=1566263946516";
            var msg1 =
                "https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF.jpg";
            var msg2 = "./bear.jpg";
            var msg3 =
                "this is a junk test message, do not process! Get back a generic thumbnail";

            channel.assertQueue(queue, {
                durable: true,
            });

            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
}
*/

/*
var fs = require("fs");
var amqp = require("amqplib/callback_api");
//getThumbnail();

function getThumbnail() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = "thumbnailTransformer";
            //var exchange = "thumbnailTransformer1";

            channel.assertExchange(exchange, "fanout", {
                durable: false,
            });

            channel.assertQueue(
                "",
                {
                    exclusive: true,
                },
                function (error2, q) {
                    if (error2) {
                        throw error2;
                    }
                    console.log(
                        " [*] Waiting for messages in %s. To exit press CTRL+C",
                        q.queue
                    );
                    console.log("QUEUE: ", q.queue);
                    console.log("EXCHANGE: ", exchange);

                    channel.bindQueue(q.queue, exchange, "");

                    counter = 0;

                    channel.consume(
                        q.queue,
                        function (msg) {
                            console.log(" [x] Received image");
                            fs.writeFileSync(
                                "NewUrlThumbnail" + counter + ".jpg",
                                msg.content
                            );
                            counter = counter + 1;
                        },
                        {
                            noAck: true,
                        }
                    );
                }
            );
        });
    });
}
*/

/*
function imageAPI(search) {
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "query",
    format: "json",
    titles: "Albert Einstein",
    prop: "info",
    inprop: "url",
    generator: "links",
    pilimit: "1"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.pages;
        for (var p in pages) {
          console.log(pages[p].fullurl);
        }
    })
    .catch(function(error){console.log(error);});
}
*/

//-------------------SERVER SECTION--------------------------------------------------------------//
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log(
        "Express started on flip1.engr.oregonstate.edu:" +
            app.get("port") +
            " OR localhost:" +
            app.get("port") +
            "; press Ctrl-C to terminate."
    );
});
