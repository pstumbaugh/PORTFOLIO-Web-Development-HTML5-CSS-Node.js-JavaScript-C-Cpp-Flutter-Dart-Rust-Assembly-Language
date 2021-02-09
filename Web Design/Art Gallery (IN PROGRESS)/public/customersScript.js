

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
  //firstName left out because it can remain NULL


  //check if all items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadCustomerLastName != "") {
    //send an insert request to our server via GET
    req.open("GET", "http://flip1.engr.oregonstate.edu:8877insert?galleryID=" + payloadGalleryName, true);

    //add event listener for async request (function)
    req.addEventListener('load', function () {
      console.log("Adding gallery request status: " + req.status); //for testing

      if (req.status >= 200 && req.status < 400) { //if request send is good do this:
        var object = JSON.parse(req.responseText); //object containing our returned data

        /* DO STUFF WITH RESPONSE TEXT
        //print to console the object items (for testing)
        console.log("SQL-> reponsding object: ");
        console.log(object);

        //get the table info in order to add gallery to the table
        var table = document.getElementById("currentTable");
        var rowCount = table.rows.length;
        console.log("HTML-> Row being added: " + (rowCount + 1));
        var row = table.insertRow(rowCount);

        //create a new row of cells
        var addGalleryID = row.insertCell(0);
        var addGalleryName = row.insertCell(1);
        
        //add the new cell's attributes
        addGalleryID.textContent = object.galleryID;
        addGalleryName.textContent = object.galleryName;
 
        //add the buttons using innerHTML
        addRowDeleteButton.innerHTML = '<button type="button" onclick="deleteRow(\'currentTable\',this)">Delete</button>';
        var updateButtonTextLink = "http://flip1.engr.oregonstate.edu:8877/updateItem?id=" + object.galleryID;
        var updateButtonText = "<button type=\"button\" onclick=\"location.href='" + updateButtonTextLink + "'\">Update</button>";
        addRowUpdateButton.innerHTML = updateButtonText;

        //remove the "no data in table" text if table was empty
        document.getElementById("noDataTag").textContent = "";

        */
        alert("Gallery Successfully Added");

        event.preventDefault();
      } else { //if error:
        console.log("Error in network request: " + req.statusText);
      }
    });

    //send the request
    req.send(null);

  }

  //prevent page refresh
  event.preventDefault();
  return;
}





//function delete's the row in the table given in parameters. 
function deleteRow(tableID, currentRow) {
  try {
    //get table info
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length; //size of table, including header row

    //loop through until we reach the row we want to delete
    for (var i = 0; i < rowCount; i++) {
      var row = table.rows[i]; //gets the current loop row number
      if (row == currentRow.parentNode.parentNode) { //check if the loop row number equals the requested row number
        //if we're at the correct row, get the ID number (this is the SQL ID number, which is hidden)
        var IDtoDelete = row.lastElementChild.textContent;
        SQLdeleteRow(IDtoDelete); //send to the delete function to delete from SQL table
        console.log("HTML-> Row Being deleted: " + i);
        if (rowCount <= 2) { //if no more rows to delete, add empty table text
          document.getElementById("noDataTag").textContent = "No data in table to display";
        }
        table.deleteRow(i); //delete the viewable table row (HTML side)
        rowCount--;
        i--;
      }
    }
  } catch (e) {
    alert(e);
  }
}

//Delete a row from our mySQL table
function SQLdeleteRow(idNumber) {
  var req = new XMLHttpRequest(); //create new request
  var payloadIDNumber = idNumber;
  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8129/delete?id=" + payloadIDNumber, true);

  //add event listener for async request (function)
  req.addEventListener('load', function () {
    console.log("Delete gallery request status: " + req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:
      console.log("SQL-> Deleting Row: " + payloadIDNumber);
      event.preventDefault();
    } else { //if error:
      console.log("Error in network request: " + req.statusText);
    }
  });

  //send the request
  req.send(null);
  //prevent page refresh
  event.preventDefault();
  return;
}



document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addButtonClick);
});

