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
  var payloadCustomerID = document.getElementById("customerIDForm").value;
  var payloadPaintingIDinitial = document.getElementById("paintingsIDForm").value;


  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadCustomerID == undefined || payloadCustomerID == "") {
    document.getElementById("addErrorNameCustomerID").textContent = "ERROR: Missing customer ID";
    event.preventDefault();
  } else document.getElementById("addErrorNameCustomerID").textContent = "";
  if (payloadPaintingIDinitial == undefined || payloadPaintingIDinitial == "") {
    document.getElementById("addErrorPaintingsID").textContent = "ERROR: Missing paintingID";
    event.preventDefault();
  } else document.getElementById("addErrorPaintingsID").textContent = "";

  //remove any whitespace characters
  payloadPaintingIDinitial.replace(/ /g, "");
  //split the string into numbers by splitting it
  var payloadPaintingID = payloadPaintingIDinitial.split(",");

  console.log(payloadPaintingID);

  //stuff to send to the POST request
  var payload = {};
  payload.payloadCustomerID = payloadCustomerID;
  payload.payloadPaintingID = payloadPaintingID;


  //check if all (required) items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadCustomerID != "" && payloadPaintingID[0] != "") {

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
        }
        else if (req.status === 400) //gallery ID not found
        {
          alert("Invalid Painting ID given, please try again.");
        }
        event.preventDefault();
        window.location.reload(true);
      }
    });

    //send the request
    req.send(JSON.stringify(payload));

    //refreshing page
    window.location.reload(true);

  }
  window.location.reload(true);
  return;
}




//AJAX delete request:
function deleteID(id) {
  console.log(id);
  $.ajax({
    url: '/deleteOrder/' + id,
    type: 'DELETE',
    success: function (result) {
      window.location.reload(true);
      event.preventDefault();
    }
  })
};



document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addButtonClick);
});

