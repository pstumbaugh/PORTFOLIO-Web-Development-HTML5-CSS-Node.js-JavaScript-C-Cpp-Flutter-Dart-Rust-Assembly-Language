var goButton = document.getElementById("goButton");
var numberOfResults = document.getElementById("ideaSize");
var wikiSearchTermFromHTML = document.getElementById("wikiTermEntry");

function checkForErrorsInNumResults(numberOfResultsValue, htmlItem) {
    //check number of ideas entered correctly
    if (numberOfResultsValue <= 0) {
        document.getElementById(htmlItem).textContent =
            "Please enter a positive number";
        ideasFlag = true;
        event.preventDefault();
    } else if (numberOfResultsValue == "") {
        document.getElementById(htmlItem).textContent = "Please enter a number";
        ideasFlag = true;
        event.preventDefault();
    } else {
        document.getElementById(htmlItem).style.visibility = "hidden";
        ideasFlag = false;
        event.preventDefault();
    }
}

function checkForErrorsInWikiSearchItem(wikiSearchTerm, searchItem) {
    //check wiki URL validity
    if (wikiSearchTerm == "") {
        document.getElementById(searchItem).textContent =
            "Please enter a keyword";
        wikiFlag = true;
        event.preventDefault();
    } else {
        document.getElementById(searchItem).style.visibility = "hidden";
        wikiFlag = false;
        event.preventDefault();
    }
}

function goButtonClick() {
    var numberOfResultsValue = numberOfResults.value;
    var wikiSearchTerm = wikiSearchTermFromHTML.value;
    //error flags
    wikiFlag = true;
    ideasFlag = true;

    checkForErrorsInNumResults(numberOfResultsValue, "ideaSizeError");
    checkForErrorsInWikiSearchItem(wikiSearchTerm, "wikiTermEntryError");

    event.preventDefault();

    //make sure no error flags set, if good continue on. (else do nothing)
    if (ideasFlag == false && wikiFlag == false) {
        //set the redirect option (precise results)
        var redirectOption;
        if (document.getElementById("redirectOption").checked == true)
            redirectOption = "redirect";
        else redirectOption = "!redirect";

        //fade out the main page
        fadeItemOut("main");
        console.log("Go button clicked");
        var delayInMilliseconds2 = 500;
        setTimeout(function () {
            document.getElementById("loader").style.opacity = "1";
        }, delayInMilliseconds2);

        //get our results loaded
        //start with top words since it is a .get request, top words:
        $.get("http://flip1.engr.oregonstate.edu:7788/topWords", {
            searchItem: wikiSearchTerm,
            searchSize: numberOfResultsValue,
        })
            .fail(function (data) {
                alert(
                    "We're experiencing issues right now, please try again later."
                );
                fadeItemIn("main");
                console.log("ERROR in get request");
            })
            .done(function (data) {
                var size = data.arrayResults.length - 2; //because results add two blank lines at end
                for (var p in data.arrayResults) {
                    if (p < size) {
                        var table = document.getElementById("resultsWordsBox");
                        //create a new "a" and add the title and link
                        var type = document.createElement("a");
                        var child = document.createTextNode(
                            data.arrayResults[p]
                        );
                        type.appendChild(child);
                        table.appendChild(type);
                        //add a line break in after each word
                        linebreak = document.createElement("br");
                        table.appendChild(linebreak);
                    }
                }

                //finish loading our results
                //common links:
                linkshere(wikiSearchTerm, numberOfResultsValue, redirectOption);
                //get the main image:
                imageAPI(wikiSearchTerm);

                //fade in results page after main has faded out
                var delayInMilliseconds1 = 1000;
                setTimeout(function () {
                    fadeItemIn("results");
                    var delayInMilliseconds3 = 2000;
                    setTimeout(function () {
                        document.getElementById("loader").style.opacity = "0";
                    }, delayInMilliseconds3);
                }, delayInMilliseconds1);
            });
    }
    event.preventDefault();
}

function enterKeyCheck(ID) {
    //if user wants to hit the enter key while on the amount input field to submit:
    var wikiButtonClick = document.getElementById(ID);
    wikiButtonClick.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            // Number 13 is the "Enter" key on the keyboard
            goButtonClick();
            event.preventDefault();
        }
    });
}

//-------------------RESULTS FUNCTIONS------------------------

getResultsTitle(); //run the function when page loads
function getResultsTitle() {
    var resultsLinksTitle = [
        "WOW! Now those are some neat results:",
        "Ooooh, links!",
        "Your students will love these topics:",
        "Enjoy these fabulous results!",
        "You get a link, and you get link! Everone gets a link!",
    ];
    var resultsLinksVar = document.getElementById("resultsLinksTitle");

    var position = Math.floor(Math.random() * resultsLinksTitle.length);
    resultsLinksVar.textContent = resultsLinksTitle[position];
}

getWordsTitle(); //run the function when page loads
function getWordsTitle() {
    var resultsLinksTitle = [
        "So ... many ... words!",
        "Enjoy this curated list of words!",
        "So many words, so little time...",
        "Word: a single distinct meaninful element.",
        "Those are some popular words!",
    ];
    var resultsLinksVar = document.getElementById("resultsWordsTitle");

    var position = Math.floor(Math.random() * resultsLinksTitle.length);
    resultsLinksVar.textContent = resultsLinksTitle[position];
}

var startOverButton = document.getElementById("startOverButton");

function startOverButtonClick() {
    numberOfResults.value = "";
    wikiSearchTermFromHTML.value = "";
    fadeItemOut("results");
    var delayInMilliseconds1 = 1000;
    setTimeout(function () {
        document.getElementById("ideaSizeError").style.visibility = "visible";
        document.getElementById("wikiTermEntryError").style.visibility =
            "visible";
        fadeItemIn("main");
        //clear out results boxes:
        document.getElementById("resultsLinksBox").innerHTML = "";
        document.getElementById("resultsWordsBox").innerHTML = "";
    }, delayInMilliseconds1);
    console.log("Start Over button clicked");
}

//gets all links on a specific page
function linksAPI(search, ideaNumber) {
    var table = document.getElementById("resultsLinksBox");
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        inprop: "url",
        action: "query",
        format: "json",
        titles: search,
        prop: "info",
        pllimit: "max",
        gpllimit: ideaNumber,
        generator: "links",
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var pages = response.query.pages;
            for (var p in pages) {
                var type = document.createElement("a");
                var child = document.createTextNode(pages[p].title);

                type.appendChild(child);
                type.title = pages[p].title;
                type.href = pages[p].fullurl;
                type.target = "_blank";
                table.appendChild(type);

                linebreak = document.createElement("br");
                table.appendChild(linebreak);
                //console.log(pages[p]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//gets common links shared between search term and links on that page
function linkshere(search, ideaNumber, redirectOption) {
    var table = document.getElementById("resultsLinksBox");
    var url = "https://en.wikipedia.org/w/api.php";
    var whitespace = checkForSpaces(search);
    if (whitespace == true) redirectOption = "!redirect";

    var params = {
        action: "query",
        titles: search,
        prop: "linkshere",
        format: "json",
        lhlimit: ideaNumber,
        lhshow: redirectOption,
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            var pages = response.query.pages;
            var pageID = Object.keys(pages);
            var links = pages[pageID].linkshere;
            for (var p in links) {
                //create a new "a" and add the title and link
                var type = document.createElement("a");
                var child = document.createTextNode(links[p].title);
                type.appendChild(child);
                type.title = links[p].title;
                console.log(type.title);
                var removedSpaces = removeSpaces(links[p].title);
                type.href = "https://en.wikipedia.org/wiki/" + removedSpaces;
                type.onclick = "location.href=" + type.href;
                type.target = "_blank";
                table.appendChild(type);

                linebreak = document.createElement("br");
                table.appendChild(linebreak);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function topWordsAPI(wikiSearchTerm, numberOfResultsValue) {
    $.get("http://flip1.engr.oregonstate.edu:7788/topWords", {
        searchItem: wikiSearchTerm,
        searchSize: numberOfResultsValue,
    }).done(function (data) {
        var size = data.arrayResults.length - 2; //because results add two blank lines at end
        for (var p in data.arrayResults) {
            if (p < size) {
                var table = document.getElementById("resultsWordsBox");
                //create a new "a" and add the title and link
                var type = document.createElement("a");
                var child = document.createTextNode(data.arrayResults[p]);
                type.appendChild(child);
                table.appendChild(type);
                //add a line break in after each word
                linebreak = document.createElement("br");
                table.appendChild(linebreak);
            }
        }
    });
}

// Function to get image URLs from a given Wikipedia page
function imageAPI(search, res) {
    var url = "https://en.wikipedia.org/w/api.php";
    var params = {
        action: "query",
        prop: "imageinfo",
        generator: "images",
        iiprop: "url",
        titles: search,
        format: "json",
    };

    url = url + "?origin=*&gimlimit=max";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            for (var page in response.query.pages) {
                for (var info in response.query.pages[page].imageinfo) {
                    console.log(response.query.pages[page].imageinfo[info].url);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//fades an item in, changes opacity to 1 and sets the z-index to 0
function fadeItemIn(item) {
    document.getElementById(item).style.animation = "fadeIn 1.5s"; //fade  in
    document.getElementById(item).style.opacity = "1"; //keep displayed on
    document.getElementById(item).style.zIndex = "0"; //move z-index
    return;
}

//fades an item out, changes opacity to 0 and sets the z-index to -50
function fadeItemOut(item) {
    document.getElementById(item).style.animation = "fadeOut 1s"; //fade out
    document.getElementById(item).style.opacity = "0"; //keep out
    document.getElementById(item).style.zIndex = "-50"; //move z-index
}

function removeSpaces(originalText) {
    removedSpacesText = originalText.split(" ").join("_");
    return removedSpacesText;
}

function checkForSpaces(value) {
    return value.indexOf(" ") >= 0;
}

document.addEventListener("DOMContentLoaded", function () {
    goButton.addEventListener("click", goButtonClick);
    wikiSearchTermFromHTML.addEventListener(
        "keyup",
        enterKeyCheck("wikiTermEntry")
    );
    numberOfResults.addEventListener("keyup", enterKeyCheck("ideaSize"));
    startOverButton.addEventListener("click", startOverButtonClick);
});
