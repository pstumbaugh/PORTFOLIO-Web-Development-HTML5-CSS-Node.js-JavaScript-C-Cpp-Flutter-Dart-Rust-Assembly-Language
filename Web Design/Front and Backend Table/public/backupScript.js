

//GET - Add a workout to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Submit";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("exerciseAdderButton").appendChild(addButton);

//what happens when we click the submit button:
function addButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  var payloadExerciseName = document.getElementById("exerciseName").value;
  var payloadReps = document.getElementById("reps").value;
  var payloadWeight = document.getElementById("weight").value;
  var payloadDate = document.getElementById("date").value;
  var payloadUnit = document.getElementById("unit").value;

  //if one of the items in the table is not filled out, display error about that item
  if (payloadExerciseName === "") {
    document.getElementById("addErrorName").textContent = "ERROR: Missing exercise name";
  } else document.getElementById("addErrorName").textContent = "";
  if (payloadReps === "") {
    document.getElementById("addErrorReps").textContent = "ERROR: Missing number of reps";
  } else document.getElementById("addErrorReps").textContent = "";
  if (payloadWeight === "") {
    document.getElementById("addErrorWeight").textContent = "ERROR: Missing weight";
  } else document.getElementById("addErrorWeight").textContent = "";
  if (payloadDate === "") {
    document.getElementById("addErrorDate").textContent = "ERROR: Missing date";
  } else document.getElementById("addErrorDate").textContent = "";
  if (payloadUnit === "") {
    document.getElementById("addErrorUnit").textContent = "ERROR: Missing unit type";
  } else document.getElementById("addErrorUnit").textContent = "";

  //check if all items are fileld out. If so, continue on sending the data to the database
  if (payloadExerciseName != "" && payloadReps != "" && payloadWeight != "" && payloadDate != "" && payloadUnit != "") {
    //send an insert request to our server via GET
    req.open("GET", "http://flip3.engr.oregonstate.edu:8229/insert?name=" + payloadExerciseName + "&reps=" + payloadReps + "&weight=" + payloadWeight + "&date=" + payloadDate + "&unit=" + payloadUnit, true);

    //add event listener for async request (function)
    req.addEventListener('load', function() {
      console.log("Adding workout request status: " + req.status); //for testing
      if (req.status >= 200 && req.status < 400) { //if request send is good do this:
        document.getElementById('addSuccess').textContent = "Workout successfully added";
        /*
        var response = JSON.parse(req.responseText); //parse the response
        console.log(JSON.parse(req.responseText)); //for testing
        document.getElementById('cityCitySearch').textContent = response.name;
        var tempF = response.main.temp;
        tempF = ((tempF - 273.15) * 1.8) + 32; //convert Kelvin to F
        tempF = tempF.toFixed(2);
        document.getElementById('currentTempCitySearch').textContent = tempF;
        document.getElementById('humidityCitySearch').textContent = response.main.humidity;
        */
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





//GET - Reset our table
var resetButton = document.createElement("button");
var resetButtonText = document.textContent = "Reset data";
resetButton.appendChild(document.createTextNode(resetButtonText));
document.getElementById("exerciseResetButton").appendChild(resetButton);

//what happens when we click the submit button:
function resetButtonClick() {
  var req = new XMLHttpRequest(); //create new request
  //send an insert request to our server via GET
  req.open("GET", "http://flip3.engr.oregonstate.edu:8229/reset-table", true);
  //add event listener for async request (function)
  req.addEventListener('load', function() {
    console.log("Reset data request status: "+req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:
      document.getElementById("resetCompleted").textContent = "Data cleared successfully";
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

