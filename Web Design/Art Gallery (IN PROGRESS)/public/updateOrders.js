//Button to update a order in our table --
var updateButton = document.createElement("button");
var updateButtonText = document.textContent = "Update";
updateButton.appendChild(document.createTextNode(updateButtonText));
document.getElementById("updateButton").appendChild(updateButton);


//Updates the row with whatever attributes are provided from user
function updateButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  var table = document.getElementById("currentTable"); //get the table
  var row = table.rows[1]; //then get the row (using row 0 since only 1 row will show)

  //get the payloads for each item
  var payloadOrderID = row.lastElementChild.textContent; //This is the SQL ID number
  var payloadCustomerID = document.getElementById("customerIDForm").value;

  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8129/safe-update?orderID=" + payloadOrderID + "&customerID=" + payloadCustomerID, true);
  //add event listener for async request (function)
  req.addEventListener('load', function() {
    console.log("Updating order request status: " + req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:

      alert("Order Successfully Updated");
      event.preventDefault();

    } else { //if error:
      alert("ERROR: Order update failed");
      console.log("Error in network request: " + req.statusText);
    }
  });

  //send the request
  req.send(null);
debugger;
  //prevent page refresh
  event.preventDefault();
  return;
}


document.addEventListener("DOMContentLoaded", function() {
  updateButton.addEventListener("click", updateButtonClick);
});

