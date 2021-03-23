var express = require('express');
const bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

//port to use (8875 - Testing // 8877 - Live website)
var port = 8877;

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//-------------------HOME SECTION--------------------------------------------------------------//

//home page setup
//Get and display (send back) all the items from the SQL table
app.get('/', function (req, res, next) {
  var context = {};
  res.render('home', context);
});

//home page setup
//Get and display (send back) all the items from the SQL table
app.get('/index', function (req, res, next) {
  var context = {};
  res.render('home', context);
});





//-------------------ARTISTS SECTION--------------------------------------------------------------//

//DELETE ARTIST
//Deletes an artist from the table using the ID
app.delete('/deleteArtist/:id', function (req, res) {
  var sql = "DELETE FROM Artists WHERE artistID = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else { //if success, return 202 status
      res.status(202).end();
    }
  })
});

//UPDATE ARTISTS PAGE
//page for the artist that the user is wanting to update.
//Gets the artist via the ID, sent back as datalist
app.get('/artistsUpdatePage', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Artists WHERE artistID=?", [req.query.id], function (err, rows, fields) {
    if (err) { //if error, return error message
      next(err);
      return;
    }

    context.dataList = rows;
    res.render('updateArtists', context);
  })
});

//UPDATING AN ARTIST
//updates an artist given the input from the user
//Will only update if a parameter is given. If it is left blank, the table will not update it and
// will retain whatever information was already in that position
app.get('/safeUpdateArtists', function (req, res, next) {
  var context = {};

  //make sure artist exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Artists WHERE artistID=?", [req.query.artistID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    //update the artist
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE Artists SET artistFirstName=?, artistLastName=? WHERE artistID=? ",
        [req.query.artistFirstName || curVals.artistFirstName, req.query.artistLastName || curVals.artistLastName, req.query.artistID],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          else { //if update successful, display console success message, then render artists page
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('artists', context);
          }
        });
    }
  });
});


//INSERTING AN ARTIST
//Inserts an artist into the Artists table with the given values from user
app.post('/artists', function (req, res) {
  var sql = "INSERT INTO Artists (artistFirstName, artistLastName) VALUES (?, ?)";
  var inserts = [req.body.payloadArtistFirstName, req.body.payloadArtistLastName];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    else {
      res.redirect('/artists');
    }
  });
});


//MAIN ARTISTS PAGE
//Gets all artists from the data base, returns it as dataList
app.get('/artists', function (req, res) {
  var context = {};
  mysql.pool.query('SELECT * FROM Artists', function (err, rows, fields) {
    if (err) { //if error, retur error message
      console.log("Error getting artists");
      return;
    }

    context.dataList = rows;
    res.render('artists', context);
  })
});





//-------------------CUSTOMERS SECTION--------------------------------------------------------------//

//DELETE CUSTOMER
//Deletes an customer from the table using the ID
app.delete('/deleteCustomer/:id', function (req, res) {
  var sql = "DELETE FROM Customers WHERE customerID = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else { //if success, return 202 status
      res.status(202).end();
    }
  })
});

//UPDATE CUSTOMERS PAGE
//page for the customer that the user is wanting to update.
//Gets the artist via the ID, sent back as datalist
app.get('/customersUpdatePage', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Customers WHERE customerID=?", [req.query.id], function (err, rows, fields) {
    if (err) { //if error, return error message
      next(err);
      return;
    }

    context.dataList = rows;
    res.render('updateCustomers', context);
  })
});

//UPDATING AN CUSTOMER
//updates a customer given the input from the user
//Will only update if a parameter is given. If it is left blank, the table will not update it and
// will retain whatever information was already in that position
app.get('/safeUpdateCustomers', function (req, res, next) {
  var context = {};

  //make sure customer exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Customers WHERE customerID=?", [req.query.customerID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    //update the customer
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE Customers SET customerFirstName=?, customerLastName=? WHERE customerID=? ",
        [req.query.customerFirstName || curVals.customerFirstName, req.query.customerLastName || curVals.customerLastName, req.query.customerID],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          else { //if update successful, display console success message, then render customers page
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('customers', context);
          }
        });
    }
  });
});


//INSERTING AN CUSTOMER
//Inserts an customer into the Customers table with the given values from user
app.post('/customers', function (req, res) {
  var sql = "INSERT INTO Customers (customerFirstName, customerLastName) VALUES (?, ?)";
  var inserts = [req.body.payloadCustomerFirstName, req.body.payloadCustomerLastName];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    else {
      res.redirect('/customers');
    }
  });
});


//MAIN CUSTOMERS PAGE
//Gets all customers from the data base, returns it as dataList
app.get('/customers', function (req, res) {
  var context = {};
  mysql.pool.query('SELECT * FROM Customers', function (err, rows, fields) {
    if (err) { //if error, retur error message
      console.log("Error getting customers");
      return;
    }

    context.dataList = rows;
    res.render('customers', context);
  })
});






//-------------------GALLERIES SECTION--------------------------------------------------------------//

//DELETE GALLERY
//Deletes an gallery from the table using the ID
app.delete('/deleteGallery/:id', function (req, res) {
  var sql = "DELETE FROM Galleries WHERE galleryID = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else { //if success, return 202 status
      res.status(202).end();
    }
  })
});

//UPDATE GALLERIES PAGE
//page for the gallery that the user is wanting to update.
//Gets the artist via the ID, sent back as datalist
app.get('/galleriesUpdatePage', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Galleries WHERE galleryID=?", [req.query.id], function (err, rows, fields) {
    if (err) { //if error, return error message
      next(err);
      return;
    }

    context.dataList = rows;
    res.render('updateGalleries', context);
  })
});

//UPDATING AN GALLERY
//updates a gallery given the input from the user
//Will only update if a parameter is given. If it is left blank, the table will not update it and
// will retain whatever information was already in that position
app.get('/safeUpdateGalleries', function (req, res, next) {
  var context = {};

  //make sure gallery exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Galleries WHERE galleryID=?", [req.query.galleryID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    //update the gallery
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE Galleries SET galleryName=? WHERE galleryID=? ",
        [req.query.galleryName || curVals.galleryName, req.query.galleryID],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          else { //if update successful, display console success message, then render galleries page
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('galleries', context);
          }
        });
    }
  });
});


//INSERTING AN GALLERY
//Inserts an gallery into the Galleries table with the given values from user
app.post('/galleries', function (req, res) {
  var sql = "INSERT INTO Galleries (galleryName) VALUES (?)";
  var inserts = [req.body.payloadGalleryName];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    else {
      res.redirect('/galleries');
    }
  });
});


//MAIN GALLERIES PAGE
//Gets all galleries from the data base, returns it as dataList
app.get('/galleries', function (req, res) {
  var context = {};
  mysql.pool.query('SELECT * FROM Galleries', function (err, rows, fields) {
    if (err) { //if error, retur error message
      console.log("Error getting galleries");
      return;
    }

    context.dataList = rows;
    res.render('galleries', context);
  })
});






//-------------------PAINTINGS SECTION--------------------------------------------------------------//

//DELETE PAINTING
//Deletes an painting from the table using the ID
app.delete('/deletePainting/:paintingID,:orderID,:galleryID', function (req, res) {
  console.log("test");
  var sql = "DELETE FROM Paintings WHERE paintingID = ?";
  var inserts = [req.params.paintingID];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else { //if success, return 202 status

      mysql.pool.query("SELECT * FROM `Paintings` WHERE orderID = ? AND galleryID = ?", [req.params.orderID, req.params.galleryID], function (err, nullPaintingsResults) {
        console.log("Number of items in Paintings that also have that order number (after deletion): " + nullPaintingsResults.length);

        if (nullPaintingsResults.length > 1) {
          console.log("More than one painting with the same gallery in the same order -- doing nothing to OrdersToGalleries table");
        }
        else { //If only 1 result, remove that orderID and galleryID relation from the OrdersToGalleries table
          mysql.pool.query("DELETE FROM OrdersToGalleries WHERE orderID = ? AND galleryID = ?", [req.params.orderID, req.params.galleryID], function (err, result) {
            if (err) {
              next(err);
              return;
            }
          });
        }
        res.status(202).end();
      });


    }
  })
});

//UPDATE PAINTINGS PAGE
//page for the painting that the user is wanting to update.
//Gets the painting via the ID, sent back as datalist
app.get('/paintingsUpdatePage', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Paintings p INNER JOIN Galleries g ON p.galleryID = g.galleryID INNER JOIN Artists a ON p.artistID = a.artistID WHERE paintingID = ?", [req.query.id], function (err, rows, fields) {
    if (err) { //if error, return error message
      next(err);
      return;
    }
    context.dataList = rows;

    mysql.pool.query('SELECT * FROM Galleries ORDER BY galleryID ASC', function (err, galleriesResults, fields) {
      if (err) { //if error, retur error message
        console.log("Error getting galleries");
        return;
      }
      context.gallery = galleriesResults;

      mysql.pool.query('SELECT * FROM Orders ORDER BY orderID ASC', function (err, ordersResults, fields) {
        if (err) { //if error, retur error message
          console.log("Error getting galleries");
          return;
        }
        context.orders = ordersResults;

        mysql.pool.query('SELECT * FROM Artists ORDER BY artistID ASC', function (err, artistsResults, fields) {
          if (err) { //if error, retur error message
            console.log("Error getting galleries");
            return;
          }
          context.artists = artistsResults;

          res.render('updatePaintings', context);
        })
      });
    });
  });
});


//UPDATING AN PAINTING
//updates an painting given the input from the user
//Will only update if a parameter is given. If it is left blank, the table will not update it and
// will retain whatever information was already in that position
app.get('/safeUpdatePaintings', function (req, res, next) {
  var context = {};

  //make sure painting exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Paintings WHERE paintingID=?", [req.query.paintingID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    //update the painting
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE Paintings SET artistID=?, artType=?, price=?, galleryID=? WHERE paintingID=? ",
        [req.query.artistID || curVals.artistID, req.query.artType || curVals.artType, req.query.price || curVals.price, req.query.galleryID || curVals.galleryID, req.query.paintingID],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          else {
            //if there is a new orderID to update, update the orders page too (this will cause order ID's to cascade down to child foreign keys)
            if (req.query.orderID != "") {

              if (req.query.orderID != "NULL") { //if orderID is a not a NULL value
                //update the painting order
                mysql.pool.query("UPDATE Paintings SET orderID=? WHERE paintingID=? ",
                  [req.query.orderID, curVals.paintingID],
                  function (err, result) {
                    if (err) {
                      next(err);
                      return;
                    }
                    else { //if update successful, display console success message, then render paintings page
                      context.results = "Updated " + result.changedRows + " rows.";
                    }
                  });

              } else { //if orderID is a NULL value, set it as null:
                //get the current galleryID and orderID (the orderID before setting it as null)
                var tempGalleryID = req.query.galleryID || curVals.galleryID;
                var tempOrderID = curVals.orderID;

                if (tempOrderID == null) {//do nothing, no order ID to update
                  console.log("ORDER ID already NULL! Not changing the order ID in this query.");

                } else {//do stuff to update order ID to null

                  mysql.pool.query("SELECT * FROM `Paintings` WHERE orderID = ? AND galleryID = ?", [tempOrderID, tempGalleryID], function (err, nullPaintingsResults) {
                    console.log("Number of items in Paintings that already have that order number: " + nullPaintingsResults.length);

                    if (nullPaintingsResults.length > 1) {
                      console.log("More than one painting with the same gallery in the same order -- doing nothing to OrdersToGalleries table");
                    }
                    else { //If only 1 result, remove that orderID and galleryID relation from the OrdersToGalleries table
                      console.log("BEFORE DELETION: current orderID: " + tempOrderID);
                      console.log("BEFORE DELETION: current galleryID: " + tempGalleryID);

                      mysql.pool.query("DELETE FROM OrdersToGalleries WHERE orderID = ? AND galleryID = ?", [tempOrderID, tempGalleryID], function (err, result) {
                        if (err) {
                          next(err);
                          return;
                        }
                      });
                    }

                    //Finally, update the painting to show a NULL orderID:
                    mysql.pool.query("UPDATE Paintings SET orderID=NULL WHERE paintingID=?",
                      [curVals.paintingID],
                      function (err, result) {
                        if (err) {
                          next(err);
                          return;
                        }
                        else { //if update successful, display console success message, then render paintings page
                          context.results = "Updated " + result.changedRows + " rows.";
                        }
                      });
                  }
                  )
                }
              }
            };
          }

          //if there's a new orderID to add, update the table:
          if (req.query.orderID != "NULL" && req.query.orderID != "") {
            //update the OrdersToGalleries table
            mysql.pool.query("INSERT INTO OrdersToGalleries (galleryID, orderID) VALUES (?, ?)",
              [req.query.galleryID || curVals.galleryID, req.query.orderID],
              function (err, result) {
                if (err) {
                  console.log("Duplicate entry in OrdersToGalleries / Not adding");
                }
                else { //if update successful, display console success message, then render paintings page
                  context.results = "Updated " + result.changedRows + " rows.";
                }
              });
          }
          //if there is a new galleryID to update, update the ordersToGalleries page too
          if (req.query.galleryID != "" && req.query.orderID != "NULL") {
            mysql.pool.query("UPDATE OrdersToGalleries SET galleryID=? WHERE orderID=? ",
              [req.query.galleryID, req.query.orderID || curVals.orderID],
              function (err, result) {
                if (err) {
                  next(err);
                  return;
                }
                else { //if update successful, display console success message, then render paintings page
                  context.results = "Updated " + result.changedRows + " rows.";
                }
              });
          }


          res.render('paintings', context);
        })
    };
  });
});


//INSERTING AN PAINTING
//Inserts an painting into the Paintings table with the given values from user
app.post('/paintings', function (req, res) {

  //make sure painting exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Artists WHERE artistID=?", [req.body.payloadArtistID], function (err, checkResults) {
    if (err) {
      next(err);
      return;
    }
    if (checkResults.length == 0) //no artist found, return error
    {
      res.status(409);
      res.sendStatus(409);
    }
    else {
      //make sure gallery exists first (if not, error and exit)
      mysql.pool.query("SELECT * FROM Galleries WHERE galleryID=?", [req.body.payloadGalleryID], function (err, checkResults2) {
        if (err) {
          next(err);
          return;
        }
        if (checkResults2.length == 0) //no artist found, return error
        {
          res.status(400);
          res.sendStatus(400);
        }
        else { //continue with INSERT
          var sql = "INSERT INTO Paintings (artistID, artType, price, galleryID) VALUES (?, ?, ?, ?)";
          var inserts = [req.body.payloadArtistID, req.body.payloadArtType, req.body.payloadPrice, req.body.payloadGalleryID];
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
              res.write(JSON.stringify(error));
              res.end();
            }
            else {
              res.redirect('/paintings');
            }
          });
        }
      })
    };
  });
});

//MAIN PAINTINGS PAGE
//Gets all paintings from the data base, returns it as dataList
app.get('/paintings', function (req, res) {
  var context = {};
  mysql.pool.query('SELECT * FROM Paintings p INNER JOIN Galleries g ON p.galleryID = g.galleryID INNER JOIN Artists a ON p.artistID = a.artistID ORDER BY paintingID', function (err, rows, fields) {
    if (err) { //if error, retur error message
      console.log("Error getting paintings");
      return;
    }
    context.dataList = rows;

    //get the galleryID's (for add new painting section)
    mysql.pool.query('SELECT * FROM Galleries', function (err, resultsGalleries, fields) {
      if (err) { //if error, retur error message
        console.log("Error getting galleries");
        return;
      }
      context.galleries = resultsGalleries;

      //get the artists (for add new painting section)
      mysql.pool.query('SELECT * FROM Artists', function (err, resultsArtists, fields) {
        if (err) { //if error, retur error message
          console.log("Error getting galleries");
          return;
        }
        context.artists = resultsArtists;

        res.render('paintings', context);
      });
    });
  })
});






//-------------------ORDERS SECTION--------------------------------------------------------------//

//DELETE ORDER
//Deletes an order from the table using the ID
app.delete('/deleteOrder/:id', function (req, res) {
  var sql = "DELETE FROM Orders WHERE orderID = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else { //if success, return 202 status
      res.status(202).end();
    }
  })
});

//DELETE FROM ORDERS TO GALLERIES TABLE
//Deletes an order from the table using the ID
app.delete('/deleteOTG/:orderID,:galleryID', function (req, res) {
  console.log("-- Deleting from OrdersToGalleries table -- ");
  console.log("ORDER ID: " + req.params.orderID);
  console.log("GALLERY: " + req.params.galleryID);

  //remove from OrdersToGalleries table
  var otgDeleteSql = "DELETE FROM OrdersToGalleries WHERE orderID = ? AND galleryID = ?";
  var inserts = [req.params.orderID, req.params.galleryID];
  otgDeleteSql = mysql.pool.query(otgDeleteSql, inserts, function (error, results, fields) {
    if (error) { //if error, log it in the console
      console.log(error)
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else {
      console.log("-- Making orderID NULL from Paintings table -- ");
      console.log("ORDER ID: " + req.params.orderID);
      console.log("GALLERY: " + req.params.galleryID);
      //remove orderID from paintings table
      var paintingsDeleteSql = "UPDATE Paintings SET orderID=NULL WHERE orderID=? AND galleryID = ?";
      var inserts2 = [req.params.orderID, req.params.galleryID];
      paintingsDeleteSql = mysql.pool.query(paintingsDeleteSql, inserts2, function (error, results, fields) {
        if (error) { //if error, log it in the console
          console.log(error)
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
        } else { //if success, return 202 status
          res.status(202).end();
        }
      })
    }
  });
});

//UPDATE ORDERS PAGE
//page for the order that the user is wanting to update.
//Gets the order via the ID, sent back as datalist
app.get('/ordersUpdatePage', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.customerID = Customers.customerID WHERE orderID=?", [req.query.id], function (err, rows, fields) {
    if (err) { //if error, return error message
      next(err);
      return;
    }
    context.dataList = rows;

    //get the customers's
    mysql.pool.query('SELECT * FROM Customers', function (err, resultsCustomers, fields) {
      if (err) { //if error, retur error message
        console.log("Error getting galleries");
        return;
      }
      context.customers = resultsCustomers;

      res.render('updateOrders', context);
    })
  });
});

//UPDATING AN ORDER
//updates an order given the input from the user
//Will only update if a parameter is given. If it is left blank, the table will not update it and
// will retain whatever information was already in that position
app.get('/safeUpdateOrders', function (req, res, next) {
  var context = {};
  //make sure order exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Orders WHERE orderID=?", [req.query.orderID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    //update the order
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE Orders SET customerID=? WHERE orderID=? ",
        [req.query.customerID || curVals.customerID, req.query.orderID],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          else { //if update successful, display console success message, then render order page
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('orders', context);
          }
        });

    }
  });
});


//INSERTING AN ORDER
//Inserts an order into the Orders table with the given values from user
app.post('/orders', function (req, res) {
  //make sure customer exists first (if not, error and exit)
  mysql.pool.query("SELECT * FROM Customers WHERE customerID=?", [req.body.payloadCustomerID], function (err, checkResults) {
    if (err) {
      next(err);
      return;
    }
    if (checkResults.length == 0) //no artist found, return error
    {
      res.status(409);
      res.sendStatus(409);
    }
    else {
      //make sure painting exists first (if not, error and exit)
      mysql.pool.query("SELECT * FROM Paintings WHERE paintingID=?", [req.body.payloadPaintingID[0]], function (err, checkResults2) {
        if (err) {
          next(err);
          return;
        }
        if (checkResults2.length == 0) //no artist found, return error
        {
          res.status(400);
          res.sendStatus(400);
        }
        else {

          //insert the order into the orders table
          var sql = "INSERT INTO Orders (customerID) VALUES (?)";
          var inserts = [req.body.payloadCustomerID];

          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
              res.write(JSON.stringify(error));
              res.end();
            }
            else { //then update the painting associated with order to add orderID
              mysql.pool.query('SELECT MAX (orderID) as maxID FROM Orders', function (error, tempResults, fields) {
                if (error) {
                  res.write(JSON.stringify(error));
                  res.end();
                }
                //grab the MAX orderID and store it in a variable:
                var newOrderID = tempResults[0].maxID;

                //get current paintingID to update/add
                var currPaintingID = req.body.payloadPaintingID[0];

                //Update the Paintings to reflect new order
                var newSql = "UPDATE Paintings SET orderID=? WHERE paintingID=?";
                var newInserts = [newOrderID, currPaintingID];
                newSql = mysql.pool.query(newSql, newInserts, function (error, results, fields) {
                  if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                  }
                });

                //udpate the OrdersToGalleries table to reflect new order
                mysql.pool.query("SELECT galleryID FROM Paintings WHERE paintingID = " + currPaintingID, function (error, tempResults2, field) {
                  if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                  }

                  //grab the galleryID to insert and store it in a variable:
                  var galleryIDtoInsert = tempResults2[0].galleryID;

                  //send an insert request to table
                  var newSql2 = "INSERT INTO OrdersToGalleries (orderID, galleryID) VALUES (?, ?)";
                  var inserts2 = [newOrderID, galleryIDtoInsert];
                  console.log("\nCreating a new order with order ID: " + newOrderID);
                  newSql2 = mysql.pool.query(newSql2, inserts2, function (error, results, fields) {
                    if (error) {
                      res.write(JSON.stringify(error));
                      res.end();
                    }
                  });
                  res.redirect("/orders");
                }
                )
              });
            };
          });
        };
      });
    };
  });
});



//INSERTING MORE PAINTINGS IN AN ORDER
//Inserts an order into the Orders table with the given values from user
app.post('/moreOrders', function (req, res) {
  mysql.pool.query('SELECT MAX (orderID) as maxID FROM Orders', function (error, tempResults, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }

    /* BAKCUP CHECK: In case the orderID is too low (doesn't register the new order from above post request, 
    it will add 1 to order. Server then checks if that newOrderID is a valid ID.
    If new orderID isn't valid (aka - everything above worked as planned), subtract 1 from
    our newOrderID*/
    var newOrderID = tempResults[0].maxID + 1;

    //if it finds the order ID (the ID we added 1 to above), keep using that ID. If not, subtract 1 to get to maxID
    mysql.pool.query('SELECT * FROM Orders WHERE orderID=? ' + newOrderID, function (error, orderResults, fields) {
      if (error) {
        newOrderID = newOrderID - 1;
      }

      //get current paintingID to update/add
      var currPaintingID = req.body.currentPayloadPaintingID;

      //make sure painting exists first (if not, error and exit)
      mysql.pool.query("SELECT * FROM Paintings WHERE paintingID=?", [currPaintingID], function (err, checkResults2) {
        if (err) {
          next(err);
          return;
        }
        if (checkResults2.length == 0) //no artist found, return error
        {
          res.status(400);
          res.sendStatus(400);
        }
        else {
          //Update the Paintings to reflect new order
          var newSql = "UPDATE Paintings SET orderID=? WHERE paintingID=?";
          var newInserts = [newOrderID, currPaintingID];
          console.log("More Paintings INSERTS (orderID), (paintingID): " + newInserts);
          newSql = mysql.pool.query(newSql, newInserts, function (error, results, fields) {
            if (error) {
              res.write(JSON.stringify(error));
            }
          });

          //udpate the OrdersToGalleries table to reflect new order
          mysql.pool.query("SELECT galleryID FROM Paintings WHERE paintingID = " + currPaintingID, function (error, tempResults2, field) {
            if (error) {
              res.write(JSON.stringify(error));
            }

            //grab the galleryID to insert and store it in a variable:
            var galleryIDtoInsert = tempResults2[0].galleryID;

            //send an insert request to table
            var newSql2 = "INSERT INTO OrdersToGalleries (orderID, galleryID) VALUES (?, ?)";
            var inserts2 = [newOrderID, galleryIDtoInsert];
            newSql2 = mysql.pool.query(newSql2, inserts2, function (error, results, fields) {
              if (error) {
                res.write(JSON.stringify(error));
              }
            });
          }
          )
        }
      });
    });
  });
});




//MAIN Orders PAGE
//Gets all orders from the data base, returns it as dataList
app.get('/orders', function (req, res) {
  var context = {};
  //get the current orders table
  mysql.pool.query('SELECT * FROM Orders INNER JOIN Customers ON Orders.customerID = Customers.customerID ORDER BY orderID', function (err, rows, fields) {
    if (err) { //if error, retur error message
      console.log("Error getting orders");
      return;
    }
    context.dataList = rows;


    //get the ordersToGalleries table
    mysql.pool.query('SELECT * FROM OrdersToGalleries INNER JOIN Galleries ON OrdersToGalleries.galleryID = Galleries.galleryID ORDER BY orderID', function (err, resultsMM, fields) {
      if (err) { //if error, retur error message
        console.log("Error getting OrdersToGalleries");
        return;
      }
      context.dataListMToM = resultsMM;

      //get the customerID's
      mysql.pool.query('SELECT customerID, customerFirstName, customerLastName FROM Customers', function (err, resultsCustomers, fields) {
        if (err) { //if error, retur error message
          console.log("Error getting paintings");
          return;
        }
        context.customers = resultsCustomers;
      });

      //get the paintingID's
      mysql.pool.query('SELECT paintingID, artType FROM Paintings WHERE orderID IS NULL', function (err, resultsPaintingsForSale, fields) {
        if (err) { //if error, retur error message
          console.log("Error getting paintings");
          return;
        }
        context.paintings = resultsPaintingsForSale;

        //finally, render the orders page
        res.render('orders', context);
      });
    });
  });
});




//-------------------SEARCH SECTION--------------------------------------------------------------//

//search page
app.get('/search', function (req, res, next) {
  var context = {};
  context.dataList = [
  ];
  res.render('search', context);
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/search', urlencodedParser, function (req, res) {
  var context = {}
  var Search = req.body.searchForm
  var SearchDatabase = req.body.check
  var SearchType = ""
  //Search = '\'' + Search + '\''
  if (SearchDatabase == "Customers") {
    SearchType = "customerLastName"
  }
  else if (SearchDatabase == "Paintings") {
    SearchType = "paintingID"
  }
  else if (SearchDatabase == "Orders") {
    SearchType = "orderID"
  }
  else if (SearchDatabase == "Artists") {
    SearchType = "artistLastName"
  }
  else if (SearchDatabase == "Galleries") {
    SearchType = "galleryID"
  }

  mysql.pool.query('SELECT * FROM '.concat(SearchDatabase, ' WHERE ', SearchType, ' = \"' + Search + '\"'), function (err, results, fields) {
    if (err) { //if error, return error message
      console.log("Error getting search");
      context.error = [{ error: "Missing checkbox or text input" }]
      res.render('search', context);
    }
    else if (results) {
      if (results[0] == null) {
        context.error = [{ error: "Search Result Not Found; " + SearchType + " of " + Search + " Does Not Exist" }]
      }
      context.dataList = results
      res.render('search', context);
    }
  })
})




//-------------------SERVER SECTION--------------------------------------------------------------//
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on flip1.engr.oregonstate.edu:' + app.get('port') + ' OR localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});





