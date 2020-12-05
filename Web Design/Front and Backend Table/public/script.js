//Button to reset the table
var resetButton = document.createElement("button");
var resetButtonText = document.textContent = "Reset data";
resetButton.appendChild(document.createTextNode(resetButtonText));
document.getElementById("exerciseResetButton").appendChild(resetButton);


//Button to add a workout to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("exerciseAdderButton").appendChild(addButton);



//When client clicks the add a workout submit button:
function addButtonClick() {
  var req = new XMLHttpRequest(); //create new request

  //get the values entered by user
  var payloadExerciseName = document.getElementById("exerciseName").value;
  var payloadReps = document.getElementById("exerciseReps").value;
  var payloadWeight = document.getElementById("exerciseWeight").value;
  var payloadDate = document.getElementById("exerciseDate").value;
  var payloadUnit = document.getElementById("exerciseUnit").value;

  //if one of the items in the table is not filled out, display error about that item
  //(after this, it will check all items are filled in. If not, it will error and not add to table)
  if (payloadExerciseName == undefined || payloadExerciseName == "") {
    document.getElementById("addErrorName").textContent = "ERROR: Missing exercise name";
  } else document.getElementById("addErrorName").textContent = "";
  if (payloadReps == undefined || payloadReps == "") {
    document.getElementById("addErrorReps").textContent = "ERROR: Missing number of reps";
  } else document.getElementById("addErrorReps").textContent = "";
  if (payloadWeight == undefined || payloadWeight == "") {
    document.getElementById("addErrorWeight").textContent = "ERROR: Missing weight";
  } else document.getElementById("addErrorWeight").textContent = "";
  if (payloadDate == undefined || payloadDate == "") {
    document.getElementById("addErrorDate").textContent = "ERROR: Missing date";
  } else document.getElementById("addErrorDate").textContent = "";
  if (payloadUnit == undefined || payloadUnit == "") {
    document.getElementById("addErrorUnit").textContent = "ERROR: Missing unit type";
  } else document.getElementById("addErrorUnit").textContent = "";

  //check if all items are fileld out. If so, continue on sending the data to the database, else display error and don't do anything
  if (payloadExerciseName != "" && payloadReps != "" && payloadWeight != "" && payloadDate != "" && payloadUnit != "") {
    //send an insert request to our server via GET
    req.open("GET", "http://flip3.engr.oregonstate.edu:8129/insert?name=" + payloadExerciseName + "&reps=" + payloadReps + "&weight=" + payloadWeight + "&date=" + payloadDate + "&unit=" + payloadUnit, true);
    //add event listener for async request (function)
    req.addEventListener('load', function() {
      console.log("Adding workout request status: " + req.status); //for testing
      if (req.status >= 200 && req.status < 400) { //if request send is good do this:
        var object = JSON.parse(req.responseText); //object containing our returned data

        //print to console the object items (for testing)
        console.log("SQL-> reponsding object: ");
        console.log(object);

        //get the table info in order to add added workout to the table
        var table = document.getElementById("currentTable");
        var rowCount = table.rows.length;
        console.log("HTML-> Row being added: " + (rowCount + 1));
        var row = table.insertRow(rowCount);

        //create a new row of cells
        var addRowName = row.insertCell(0);
        var addRowReps = row.insertCell(1);
        var addRowWeight = row.insertCell(2);
        var addRowDate = row.insertCell(3);
        var addRowUnit = row.insertCell(4);
        var addRowDeleteButton = row.insertCell(5);
        var addRowUpdateButton = row.insertCell(6);
        var addRowId = row.insertCell(7);
        addRowId.style.display = 'none'; //hide the ID cell

        //add the new cell's attributes
        addRowName.textContent = object.name;
        addRowReps.textContent = object.reps;
        addRowWeight.textContent = object.weight;
        addRowDate.textContent = object.date;
        addRowUnit.textContent = object.unit;
        //add the buttons using innerHTML
        addRowDeleteButton.innerHTML = '<button type="button" onclick="deleteRow(\'currentTable\',this)">Delete</button>';
        var updateButtonTextLink = "http://flip3.engr.oregonstate.edu:8129/updateItem?id=" + object.id;
        var updateButtonText = "<button type=\"button\" onclick=\"location.href='" + updateButtonTextLink + "'\">Update</button>";
        addRowUpdateButton.innerHTML = updateButtonText;
        //finish by adding the object's ID (SQL ID#)
        addRowId.innerHTML = object.id; //this item is added in a hidden state

        //remove the "no data in table" text if table was empty
        document.getElementById("noDataTag").textContent = "";

        alert("Workout Successfully Added");

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




//what happens when we click the reset button:
function resetButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8129/reset-table", true);
  //add event listener for async request (function)
  req.addEventListener('load', function() {
    console.log("Reset data request status: " + req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:
      alert("Data Table Reset Successfully");
      event.preventDefault();
      deleteAllRows(); //deletes all the rows from the table, excluding the header row. 
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



//Delete's all the rows in a table, except the first row (which is the header row)
//displays the noDataTag text
function deleteAllRows() {
  var table = document.getElementById("currentTable");
  var rowCount = table.rows.length;
  //iterate through all rows, except the header row
  while (rowCount != 1) {
    table.deleteRow(1); //delete row one (also delete's sql row)
    rowCount = table.rows.length;
  }
  //set the noDataTag to display empty table text
  document.getElementById("noDataTag").textContent = "No data in table to display";
}


//checks to see if the table is empty. If true, it will add the noDataTag text
//If there are items in the table, it will remove the noDataTag text
function checkForEmptyTable() {
  var table = document.getElementById("currentTable");
  var rowCount = table.rows.length;

  if (rowCount <= 1) //one row for the header row
  {
    //set the noDataTag to display empty table text
    document.getElementById("noDataTag").textContent = "No data in table to display";
  }
  else
  {
    //delete the noDataTag text (hide it)
    document.getElementById("noDataTag").textContent = "";
  }
}

//call the empty table check
checkForEmptyTable();


//Delete a workout (row) from our mySQL table
function SQLdeleteRow(idNumber) {
  var req = new XMLHttpRequest(); //create new request
  var payloadIDNumber = idNumber;
  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8129/delete?id=" + payloadIDNumber, true);

  //add event listener for async request (function)
  req.addEventListener('load', function() {
    console.log("Delete workout request status: " + req.status); //for testing
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



document.addEventListener("DOMContentLoaded", function() {
  addButton.addEventListener("click", addButtonClick);
  resetButton.addEventListener("click", resetButtonClick);
});

