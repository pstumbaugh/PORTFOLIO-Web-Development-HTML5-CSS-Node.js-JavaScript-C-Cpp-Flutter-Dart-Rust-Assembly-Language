//Button to update a workout in our table --
var updateButton = document.createElement("button");
var updateButtonText = document.textContent = "Update";
updateButton.appendChild(document.createTextNode(updateButtonText));
document.getElementById("exerciseUpdateButton").appendChild(updateButton);


//Updates the row with whatever attributes are provided from user
function updateButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  var table = document.getElementById("currentTable"); //get the table
  var row = table.rows[1]; //then get the row (using row 0 since only 1 row will show)

  //get the payloads for each item
  var payloadID = row.lastElementChild.textContent; //This is the SQL ID number, hidden to the client
  var payloadExerciseName = document.getElementById("exerciseName").value;
  var payloadReps = document.getElementById("reps").value;
  var payloadWeight = document.getElementById("weight").value;
  var payloadDate = document.getElementById("date").value;
  var payloadUnit = document.getElementById("unit").value;

  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8129/safe-update?id=" + payloadID + "&name=" + payloadExerciseName + "&reps=" + payloadReps + "&weight=" + payloadWeight + "&date=" + payloadDate + "&unit=" + payloadUnit, true);
  //add event listener for async request (function)
  req.addEventListener('load', function() {
    console.log("Updating workout request status: " + req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:
      //refresh the table with our data from input (this assuming the request was successfull)
      //Since request was successful, we can assume the items are in the table. But we will just use 
      //the payload item values to save time
      if (payloadExerciseName != "")
        document.getElementById("originalName").textContent = payloadExerciseName;
      if (payloadDate != "")
        document.getElementById("originalDate").textContent = payloadDate;
      if (payloadReps != "")
        document.getElementById("originalReps").textContent = payloadReps;
      if (payloadUnit != "")
        document.getElementById("originalUnit").textContent = payloadUnit;
      if (payloadWeight != "")
        document.getElementById("originalWeight").textContent = payloadWeight;
      alert("Workout Successfully Updated");
      event.preventDefault();

    } else { //if error:
      alert("ERROR: workout not added");
      console.log("Error in network request: " + req.statusText);
    }
  });

  //send the request
  req.send(null);

  //prevent page refresh
  event.preventDefault();
  return;
}


//gets the details from the SQL table for a specific item based on ID
/*NOTE - this function, while it works, does not do anything for the client. See the section after a successufull
request - It will display in the console the object returned (which works), but nothing is done
with that information. This is done on purpose as it was a test to see specific data and if
it was working properly. One may use it as a base for other opertions if need be.
 */
function refreshTable() {
  var req2 = new XMLHttpRequest(); //create new request
  var table = document.getElementById("currentTable"); //get the table
  var row = table.rows[1]; //then get the row (using row 0 since only 1 row will show)
  var payloadID = row.lastElementChild.textContent;

  //send an insert request to our server via GET
  req2.open("GET", "http://flip3.engr.oregonstate.edu:8129/getItemDetail?id=" + payloadID, true);
  //add event listener for async request (function)
  req2.addEventListener('load', function() {
    console.log("Retrieve current item's details status: " + req2.status); //for testing
    if (req2.status >= 200 && req2.status < 400) { //if request send is good do this:

      var object2 = JSON.parse(req2.responseText); //object containing our returned data
      console.log(object2); //for testing

        //do stuff here if you want to use this function!

      event.preventDefault();
    } else { //if error:
      console.log("Error in network request: " + req2.statusText);
    }
  });

  //send the request
  req2.send(null);

  //prevent page refresh
  event.preventDefault();
  return;
}


document.addEventListener("DOMContentLoaded", function() {
  updateButton.addEventListener("click", updateButtonClick);
});

