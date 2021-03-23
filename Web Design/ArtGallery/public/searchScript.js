var port = globalVariable.number;
document.getElementById("customerSearch").onchange = customerSearch;
document.getElementById("paintingSearch").onchange = paintingSearch;
document.getElementById("orderSearch").onchange = orderSearch;
document.getElementById("artistSearch").onchange = artistSearch;
document.getElementById("gallerySearch").onchange = gallerySearch;

// Creating exclusive checkboxes and setting searchType
function customerSearch() {
    if (document.getElementById("paintingSearch").checked) {
        document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    if (document.getElementById("artistSearch").checked) {
        document.getElementById("artistSearch").checked = false;
    }
    if (document.getElementById("gallerySearch").checked) {
        document.getElementById("gallerySearch").checked = false;
    }
}

function paintingSearch() {
    if (document.getElementById("customerSearch").checked) {
        document.getElementById("customerSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    if (document.getElementById("artistSearch").checked) {
        document.getElementById("artistSearch").checked = false;
    }
    if (document.getElementById("gallerySearch").checked) {
        document.getElementById("gallerySearch").checked = false;
    }
}

function orderSearch() {
    if (document.getElementById("customerSearch").checked) {
        document.getElementById("customerSearch").checked = false;
    }
    if (document.getElementById("paintingSearch").checked) {
        document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("artistSearch").checked) {
        document.getElementById("artistSearch").checked = false;
    }
    if (document.getElementById("gallerySearch").checked) {
        document.getElementById("gallerySearch").checked = false;
    }
}

function artistSearch() {
    if (document.getElementById("customerSearch").checked) {
        document.getElementById("customerSearch").checked = false;
    }
    if (document.getElementById("paintingSearch").checked) {
        document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    if (document.getElementById("gallerySearch").checked) {
        document.getElementById("gallerySearch").checked = false;
    }
}

function gallerySearch() {
    if (document.getElementById("customerSearch").checked) {
        document.getElementById("customerSearch").checked = false;
    }
    if (document.getElementById("paintingSearch").checked) {
        document.getElementById("paintingSearch").checked = false;
    }
    if (document.getElementById("orderSearch").checked) {
        document.getElementById("orderSearch").checked = false;
    }
    if (document.getElementById("artistSearch").checked) {
        document.getElementById("artistSearch").checked = false;
    }
}