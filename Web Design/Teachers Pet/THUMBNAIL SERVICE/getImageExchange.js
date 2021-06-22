// Snippets of code used from course modules, W3 Schools and GeeksforGeeks.
// Import express and handlebars.
var express = require("express");
var app = express();

var fs = require("fs");
var amqp = require("amqplib/callback_api");

function sendQ(imageurl) {
    amqp.connect(
        "amqp://leoparduser:E6dXz8t!fPthwfr@40.71.6.249",
        function (error0, connection) {
            if (error0) {
                throw error0;
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                var exchange = "image.url";

                channel.assertExchange(exchange, "fanout", {
                    durable: true,
                });
                channel.publish(exchange, "", Buffer.from(imageurl));
            });
        }
    );
}

function receiveQ() {
    amqp.connect(
        "amqp://leoparduser:E6dXz8t!fPthwfr@40.71.6.249",
        function (error0, connection) {
            if (error0) {
                throw error0;
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var thumbExchange = "thumbnailTransformer";
                var searchExchange = "image.search";
                var thumbQueue = "Ted's Queue";
                var searchQueue = "image.search";

                channel.assertExchange(thumbExchange, "fanout", {
                    durable: false,
                });

                channel.assertExchange(searchExchange, "fanout", {
                    durable: true,
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

                        channel.bindQueue(thumbQueue, thumbExchange, "");
                        channel.bindQueue(searchQueue, searchExchange, "");

                        counter = 0;

                        channel.consume(
                            thumbQueue,
                            function (msg) {
                                console.log(" [x] Received image");
                                fs.writeFileSync(
                                    "/nfs/stak/users/kimte/public_html/NewUrlThumbnail" +
                                        counter +
                                        ".jpg",
                                    msg.content,
                                    { flag: "w" }
                                );

                                counter = counter + 1;
                            },
                            {
                                noAck: true,
                            }
                        );

                        channel.consume(
                            searchQueue,
                            function (msg) {
                                if (msg.content) {
                                    console.log(
                                        " [x] %s",
                                        msg.content.toString()
                                    );
                                    imageAPI(msg.content.toString());
                                }
                            },
                            {
                                noAck: true,
                            }
                        );
                    }
                );
            });
        }
    );
}
