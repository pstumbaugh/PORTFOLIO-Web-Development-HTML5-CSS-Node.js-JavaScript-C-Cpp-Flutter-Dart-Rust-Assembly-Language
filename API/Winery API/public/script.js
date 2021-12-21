//---------------------------------------------------------
//Functions:
const url = "http://localhost:8080";
// const url = "https://winery-coop.wn.r.appspot.com";

//When client user clicks the submit button
function googleAuthRequestClick() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (password === "" || password === undefined || email === "" || email === undefined) {
        alert("Missing a value, please try again.");
        return;
    }

    const local = url + "/requestAuth?email=" + email + "&password=" + password;
    console.log(local);
    window.location = local;
    return;
}

//When client user clicks the submit button
function goHome() {
    const local = url + "/";
    window.location = local;
    return;
}
