var port = globalVariable.number;


//GALLERY ADD BUTTON:
//Button to add a gallery to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("customerAdderButton").appendChild(addButton);

//When client clicks the add a gallery submit button:
function addButtonClick() {
  var req = new XMLHttpRequest(); //create new request

  //get the values entered by user
  var payloadCustomerFirstName = document.getElementById("customerFirstNameForm").value;
  var payloadCustomerLastName = document.getElementById("customerLastNameForm").value;

  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadCustomerLastName == undefined || payloadCustomerLastName == "") {
    document.getElementById("addErrorNameCustomerLastName").textContent = "ERROR: Missing last name";
    event.preventDefault();
  } else document.getElementById("addErrorNameCustomerLastName").textContent = "";
  //customer firstName left out as it can be NULL

  //stuff to send to the POST request
  var payload = {};
  payload.payloadCustomerFirstName = payloadCustomerFirstName;
  payload.payloadCustomerLastName = payloadCustomerLastName;

  //check if all items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadCustomerLastName != "") {

    //send an insert request to our server via GET
    req.open("POST", "http://flip1.engr.oregonstate.edu:" + port + "/customers", true);

    //for post request, set the header:
    req.setRequestHeader('Content-Type', 'application/json');

    //add event listener for async request (function)
    req.addEventListener('load', function () {
      console.log("Adding customers request status: " + req.status); //for testing

      if (req.status >= 200 && req.status < 400) {
        //if request send is good do this:
        console.log("Success in adding customer");
      } else { //if error:
        console.log("Error in network request: " + req.statusText);
      }
    });

    //send the request
    req.send(JSON.stringify(payload));

    //reload the window without refreshing page
    window.location.reload(true);
    event.preventDefault();

  }
  return;
}




//AJAX delete request:
function deleteID(id) {
  console.log(id);
  $.ajax({
    url: '/deleteCustomer/' + id,
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

