var myAPIcode = "824dc52d6390a9f7b00535f4e17e8c4f"; //Pat API code

//weather function gets weather according to assigned inputs
function weather(payloadCity, weatherIcon, currentConditions, name) {

  var req = new XMLHttpRequest(); //create new request
  var payloadCityCountryCode = "US";

  //for async request, change last bool to "true"
  //Add our infor and req.open...

  req.open("GET", "http://api.openweathermap.org/data/2.5/weather?q="+payloadCity+","+payloadCityCountryCode+"us&appid=824dc52d6390a9f7b00535f4e17e8c4f", true);

  req.addEventListener('load', function() {
    console.log(req.status); //for testing
    if (req.status >= 200 && req.status < 400) { //if request send is good do this:
      var response = JSON.parse(req.responseText); //parse the response
      console.log(JSON.parse(req.responseText)); //for testing
      
      //get the current weather
      var tempF = response.main.temp;
      tempF = ((tempF - 273.15) * 1.8) + 32; //convert Kelvin to F
      tempF = tempF.toFixed(0);
      document.getElementById(name).textContent = tempF;

      //get the current weather image from open weather api website
      var weatherImage = response.weather[0].icon;
      var img = document.createElement("img");
      img.src = "http://openweathermap.org/img/w/" + weatherImage + ".png";
      document.getElementById(weatherIcon).appendChild(img);
      
      document.getElementById(currentConditions).textContent = response.weather[0].main;

      event.preventDefault();
    } else { //if error:
      console.log("Error in network request: " + req.statusText);
    }
  });


  //send the request
  req.send(null);
}

//call the weather function for assigned cities
var city = "Yacolt";
var weatherIcon = 'silverStarWeatherIcon';
var currentConditions = 'SilverStarCurrentConditions';
var name = 'silverStar';
weather(city, weatherIcon, currentConditions, name);

var city = "Rhododendron";
weatherIcon = 'elkMeadowsWeatherIcon';
currentConditions = 'elkMeadowsCurrentConditions';
name = 'elkMeadows'
weather(city, weatherIcon, currentConditions, name);

var city = "Skamania";
weatherIcon = 'beaconRockWeatherIcon';
currentConditions = 'beaconRockCurrentConditions';
name = 'beaconRock'
weather(city, weatherIcon, currentConditions, name);

var city = "Beaverton";
weatherIcon = 'jenkinsEstateWeatherIcon';
currentConditions = 'jenkinsEstateCurrentConditions';
name = 'jenkinsEstate'
weather(city, weatherIcon, currentConditions, name);



