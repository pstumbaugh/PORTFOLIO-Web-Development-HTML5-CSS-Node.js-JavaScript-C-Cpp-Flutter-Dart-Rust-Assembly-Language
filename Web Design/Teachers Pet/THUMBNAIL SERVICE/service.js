#!/usr/bin/env node
var fs = require("fs");
var sharp = require("sharp");
var amqp = require("amqplib/callback_api");
const download = require("image-downloader");

var credentials = require("./credentials.js");

makeThumbnail();

function makeThumbnail() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = "PatQueue";

            channel.assertQueue(queue, {
                durable: true,
            });
            channel.prefetch(1);
            console.log(
                " [*] Waiting for messages in %s. To exit press CTRL+C",
                queue
            );
            channel.consume(
                queue,
                function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    setTimeout(function () {
                        transformToThumbnail(msg);
                        channel.ack(msg);
                    }, 2000);
                },
                {
                    noAck: false,
                }
            );
        });
    });
}

function transformToThumbnail(msg) {
    //get our image
    var imageToProcess = msg.content.toString();
    localPath = "./urlImage.jpg"; //where we are going to temporarily save the image

    //find out the type of image and route it to the correct transformer service
    if (imageToProcess.includes("http") == true) {
        console.log(" [-] Image is a URL");
        saveImageFromURL(imageToProcess);
    } else if (
        //if the image is one of the acceptable sharp format files:
        imageToProcess.includes(".jpg") == true ||
        imageToProcess.includes(".jpeg") == true ||
        imageToProcess.includes(".png") == true ||
        imageToProcess.includes(".webp") == true ||
        imageToProcess.includes(".avif") == true ||
        imageToProcess.includes(".tiff") == true ||
        imageToProcess.includes(".gif") == true ||
        imageToProcess.includes(".svg") == true
    ) {
        console.log(" [-] Image is an acceptable picture file");
        saveImageAcceptablePic(imageToProcess);
    } else {
        //not a url or acceptable format, sending back a generic
        console.log(
            " [-] Image is not able to process, sending generic thumbnail"
        );
        saveImageGeneric();
    }
    return;
}

function sendThumbnailToExchange() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = "thumbnailTransformer";

            fs.readFile("./thumbnail.jpg", function (err, data) {
                if (err) throw err; // Fail if the file can't be read.

                channel.assertExchange(exchange, "fanout", {
                    durable: false,
                });

                channel.publish(exchange, "", Buffer.from(data));
                console.log(" [x] Sent to exchange ", exchange);

                //repeat waiting log (it will still be in the main consume function)
                console.log(
                    " [*] Waiting for more messages. To exit press CTRL+C"
                );
                return;
            });
        });
    });
}

//saves an image from a URL and sends it to queue
function saveImageFromURL(url) {
    sharp.cache(false); //clears sharp's cache

    const options = {
        url: url,
        dest: "thumbnail.jpg", //where it will be saved at
    };

    download
        .image(options)
        .then(({ filename }) => {
            console.log(" [-] Saved URL to ", filename); // saving file
        })
        .finally(function () {
            //create the thumbnail from the same file
            sharp("thumbnail.jpg")
                .resize(200, 200) //thumbnail size
                .toBuffer()
                .then((data) => {
                    var stream = fs.createWriteStream("thumbnail.jpg");
                    stream.once("open", function (fd) {
                        stream.write(data);
                        console.log(
                            " [-] URL - thumbnail created successfully!"
                        );
                        sendThumbnailToExchange();
                        stream.end();
                    });
                })
                //error handle:
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => console.error(err));
}

//saves an "acceptable file format" for local images and sends it to queue
function saveImageAcceptablePic(imageToProcess) {
    sharp(imageToProcess)
        .resize(200, 200) //thumbnail size
        .toBuffer()
        .then((data) => {
            fs.writeFileSync("thumbnail.jpg", data);
            console.log(" [-] Accp Image - thumbnail created successfully!");
            sendThumbnailToExchange();
        });
}

//saves a generic image and sends it to the rabbitMQ queue.
function saveImageGeneric() {
    sharp("./generic.jpg")
        .resize(200, 200) //thumbnail size
        .toBuffer()
        .then((data) => {
            fs.writeFileSync("thumbnail.jpg", data);
            console.log(" [-] GENERIC thumbnail created successfully!");
            sendThumbnailToExchange();
        });
}

/*
This may be used it wanting to send it to a specific queue instead of the exchange

//takes the saved local thumbnail image ("thumbnail.jpg") and sends it to the rabbitmq queue
function sendThumbnailToQueue() {
    //connect to server
    amqp.connect(credentials.AMPQserver, function (error0, newConnection) {
        if (error0) {
            throw error0;
        }
        //create a new channel
        newConnection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            //setup our queue
            var queue = "getFromThumbnailQueue";
            //read the file and send it to the queue
            fs.readFile("./thumbnail.jpg", function (err, data) {
                if (err) throw err; // Fail if the file can't be read.
                channel.assertQueue(queue, {
                    durable: true,
                });
                channel.sendToQueue(queue, Buffer.from(data)); //send it to queue
                console.log(" [-] Sent image to %s", queue);
                //repeat waiting log (it will still be in the main consume function)
                console.log(
                    " [*] Waiting for more messages. To exit press CTRL+C"
                );
                return;
            });
        });
    });
}
*/
