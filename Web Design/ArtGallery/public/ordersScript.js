var port = globalVariable.number;


//GALLERY ADD BUTTON:
//Button to add a gallery to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("orderAdderButton").appendChild(addButton);

//When client clicks the add a gallery submit button:
function addButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  //get the values entered by user
  var payloadCustomerID = document.getElementById("customersToChoose").value;
  var payloadPaintingID = [];
  payloadPaintingID[0] = document.getElementById("paintingsToChoose1").value;
  payloadPaintingID[1] = document.getElementById("paintingsToChoose2").value;
  payloadPaintingID[2] = document.getElementById("paintingsToChoose3").value;
  payloadPaintingID[3] = document.getElementById("paintingsToChoose4").value;
  payloadPaintingID[4] = document.getElementById("paintingsToChoose5").value;

  //check if nothing was selected, if so, use 0
  for (var a = 0; a < payloadPaintingID.length; a++) {
    console.log("Choose painting " + (a + 1) + ":");
    if (payloadPaintingID[a] == "Choose painting " + (a + 1) + ":")
      payloadPaintingID[a] = 0;
  }

  console.log(payloadCustomerID);

  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadCustomerID == undefined || payloadCustomerID == "Choose customer:") {
    document.getElementById("addErrorNameCustomerID").textContent = "ERROR: Missing customer ID";
    event.preventDefault();
  } else document.getElementById("addErrorNameCustomerID").textContent = "";
  if (payloadPaintingID[0] == undefined || payloadPaintingID[0] == "") {
    document.getElementById("addErrorPaintingsID").textContent = "ERROR: Missing first paintingID";
    event.preventDefault();
  } else document.getElementById("addErrorPaintingsID").textContent = "";


  //stuff to send to the POST request
  var payload = {};
  payload.payloadCustomerID = payloadCustomerID;
  payload.payloadPaintingID = payloadPaintingID;

  //check if all (required) items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadCustomerID != "Choose customer:" && payloadPaintingID[0] != "") {

    //SEND INITIAL ORDER (CREATES A NEW ORDER AND ADDS FIRST PAINTING)
    //send an insert request to our server via GET
    req.open("POST", "http://flip1.engr.oregonstate.edu:" + port + "/orders", true);

    //for post request, set the header:
    req.setRequestHeader('Content-Type', 'application/json');

    //add event listener for async request (function)
    req.addEventListener('load', function () {
      console.log("Adding order request status: " + req.status); //for testing
      if (req.status >= 200 && req.status < 400) {
        //if request send is good do this:
        console.log("Success in adding order");
      } else { //if error:
        console.log("Error in network request: " + req.statusText);
        if (req.status === 409) //bad customer request:
        {
          alert("Invalid Customer ID given, please try again.");
          return;
        }
        else if (req.status === 400) //gallery ID not found
        {
          alert("First Painting ID invalid, please try again.");
          return;
        }
        event.preventDefault();
      }
    });

    event.preventDefault();
    //send the request
    req.send(JSON.stringify(payload));
    event.preventDefault();

    //wait 1 second, then add other paintings in order:
    var delayInMilliseconds = 500; //half second
    setTimeout(function () {
      //add in any extra paintings to new order number
      for (var i = 1; i < payloadPaintingID.length; i++) {
        //check if there is a painting to add (if not, do nothing, loop to next item):
        if (payloadPaintingID[i] != 0) {
          var req2 = new XMLHttpRequest();
          payload.currentPayloadPaintingID = payloadPaintingID[i];

          //send an insert request to our server via GET
          req2.open("POST", "http://flip1.engr.oregonstate.edu:" + port + "/moreOrders", true);

          //for post request, set the header:
          req2.setRequestHeader('Content-Type', 'application/json');

          //add event listener for async request (function)
          req2.addEventListener('load', function () {
            console.log("Adding order request status: " + req2.status); //for testing
            if (req2.status >= 200 && req2.status < 400) {
              //if request send is good do this:
              console.log("Success in adding order");
            } else { //if error:
              console.log("Error in network request: " + req2.statusText);
              if (req2.status === 409) //bad customer request:
              {
                alert("Invalid Customer ID given, please try again.");
                event.preventDefault();
                window.location.replace('./orders');
                return;
              }
              else if (req2.status === 400) //gallery ID not found
              {
                alert("Invalid Painting ID given, please try again.\n NOTE: Paintings before this ID were added successfully");
                event.preventDefault();
                window.location.replace('./orders');
                return;
              }
              event.preventDefault();
            }
            event.preventDefault();
          });

          //send the request
          req2.send(JSON.stringify(payload));
        }
      }
    }, delayInMilliseconds);

    alert("Painting(s) added successfully to order");
    event.preventDefault();
    window.location.replace('./orders');
    event.preventDefault();
  }
  return;
}




//AJAX delete request:
function deleteID(id) {
  $.ajax({
    url: '/deleteOrder/' + id,
    type: 'DELETE',
    success: function (result) {
      window.location.reload(true);
      event.preventDefault();
    }
  })
};

//AJAX delete request (for OrdersToGalleries table):
function deleteOTG(orderID, galleryID) {
  if (confirmComplete() == true) {
    $.ajax({
      url: '/deleteOTG/' + orderID + "," + galleryID,
      type: 'DELETE',
      success: function (result) {
        window.location.reload(true);
        event.preventDefault();
      }
    })
  }
};

//confirm if user should continue or not
function confirmComplete() {
  var answer = confirm("This will also remove the order ID from any paintings in this order associated with this gallery. \n\n Are you sure you want to continue");
  if (answer == true) {
    return true;
  }
  else {
    return false;
  }
}







document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addButtonClick);
});

