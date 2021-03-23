var port = globalVariable.number;


//GALLERY ADD BUTTON:
//Button to add a gallery to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("artistAdderButton").appendChild(addButton);

//When client clicks the add a gallery submit button:
function addButtonClick() {
  var req = new XMLHttpRequest(); //create new request

  //get the values entered by user
  var payloadArtistFirstName = document.getElementById("artistFirstNameForm").value;
  var payloadArtistLastName = document.getElementById("artistLastNameForm").value;

  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadArtistLastName == undefined || payloadArtistLastName == "") {
    document.getElementById("addErrorNameArtistLastName").textContent = "ERROR: Missing last name";
    event.preventDefault();
  } else document.getElementById("addErrorNameArtistLastName").textContent = "";
  //artist firstName left out as it can be NULL

  //stuff to send to the POST request
  var payload = {};
  payload.payloadArtistFirstName = payloadArtistFirstName;
  payload.payloadArtistLastName = payloadArtistLastName;

  //check if all items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadArtistLastName != "") {

    //send an insert request to our server via GET
    req.open("POST", "http://flip1.engr.oregonstate.edu:" + port + "/artists", true);

    //for post request, set the header:
    req.setRequestHeader('Content-Type', 'application/json');

    //add event listener for async request (function)
    req.addEventListener('load', function () {
      console.log("Adding artists request status: " + req.status); //for testing

      if (req.status >= 200 && req.status < 400) {
        //if request send is good do this:
        console.log("Success in adding artist");
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
    url: '/deleteArtist/' + id,
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

