//GALLERY ADD BUTTON:
//Button to add a gallery to our table
var addButton = document.createElement("button");
var addButtonText = document.textContent = "Search";
addButton.appendChild(document.createTextNode(addButtonText));
document.getElementById("searchButton").appendChild(addButton);
document.getElementById("customerSearch").onchange = customerSearch;
document.getElementById("paintingSearch").onchange = paintingSearch;
document.getElementById("orderSearch").onchange = orderSearch;
var searchType = null;

//When client clicks the search buttonpp
function addButtonClick() {
    var req = new XMLHttpRequest(); //create new request
  }

// Creating exclusive checkboxes and setting searchType
function customerSearch() {
    if (document.getElementById("paintingSearch").checked) {
            document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    searchType = "customer"
}

function paintingSearch() {
    if (document.getElementById("customerSearch").checked) {
            document.getElementById("customerSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    searchType = "painting"
}

function orderSearch() {
    if (document.getElementById("paintingSearch").checked) {
            document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("customerSearch").checked) {
        document.getElementById("customerSearch").checked = false;
    }
    searchType = "order"
}