var port = globalVariable.number;


//GALLERY ADD BUTTON:
//Button to add a gallery to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("paintingAdderButton").appendChild(addButton);

//When client clicks the add a gallery submit button:
function addButtonClick() {

  var req = new XMLHttpRequest(); //create new request

  //get the values entered by user
  var payloadArtistID = document.getElementById("artistIDForm").value;
  var payloadArtType = document.getElementById("artTypeForm").value;
  var payloadPrice = document.getElementById("priceForm").value;
  var payloadGalleryID = document.getElementById("galleryIDForm").value;

  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadArtistID == undefined || payloadArtistID == "Artists:") {
    document.getElementById("addErrorNameArtistID").textContent = "ERROR: Missing artist";
    event.preventDefault();
  } else document.getElementById("addErrorNameArtistID").textContent = "";
  if (payloadArtType == undefined || payloadArtType == "") {
    document.getElementById("addErrorNameArtType").textContent = "ERROR: Missing art type";
    event.preventDefault();
  } else document.getElementById("addErrorNameArtType").textContent = "";
  if (payloadPrice == undefined || payloadPrice == "") {
    document.getElementById("addErrorNamePrice").textContent = "ERROR: Missing price";
    event.preventDefault();
  } else document.getElementById("addErrorNamePrice").textContent = "";
  if (payloadGalleryID == undefined || payloadGalleryID == "Galleries:") {
    document.getElementById("addErrorNameGalleryID").textContent = "ERROR: Missing gallery";
    event.preventDefault();
  } else document.getElementById("addErrorNameGalleryID").textContent = "";

  //stuff to send to the POST request
  var payload = {};
  payload.payloadArtistID = payloadArtistID;
  payload.payloadArtType = payloadArtType;
  payload.payloadPrice = payloadPrice;
  payload.payloadGalleryID = payloadGalleryID;

  debugger;

  //check if all (required) items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadArtistID != "Artists:" && payloadArtType != "" && payloadPrice != "" && payloadGalleryID != "Galleries:") {

    //send an insert request to our server via GET
    req.open("POST", "http://flip1.engr.oregonstate.edu:" + port + "/paintings", true);

    //for post request, set the header:
    req.setRequestHeader('Content-Type', 'application/json');

    //add event listener for async request (function)
    req.addEventListener('load', function () {
      console.log("Adding paintings request status: " + req.status); //for testing
      if (req.status >= 200 && req.status < 400) {
        //if request send is good do this:
        console.log("Success in adding painting");
      } else { //if error:
        console.log("Error in network request: " + req.statusText);
        if (req.status === 409) //bad artist request:
        {
          alert("Invalid Artist ID given, please try again.");
        }
        else if (req.status === 400) //gallery ID not found
        {
          alert("Invalid Gallery ID given, please try again.");
        }
        event.preventDefault();
      }
    });

    //send the request
    req.send(JSON.stringify(payload));

    //reload the window with new painting
    /*
    setTimeout(function () {
      window.location.reload();
    }, 3000);
    */

    alert("Painting Added Successfully!");
    //reload the window without refreshing page
    window.location.reload(true);
    event.preventDefault();

    //window.location.href = window.location.href;
  }
  return;
}



//AJAX delete request:
function deleteID(paintingID, orderID, galleryID) {
  console.log("TEST")
  console.log(galleryID);
  $.ajax({
    url: '/deletePainting/' + paintingID + "," + orderID + "," + galleryID,
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

