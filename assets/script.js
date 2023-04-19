const apiKey = "64a3b92c5913e381167a37aa42725948";

let savedCities = JSON.parse(localStorage.getItem("savedCities"))
savedCities.forEach(function(item){
  if (item) {
  $("#city-list").append(
    '<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' +
      item,
  );
  }
});


// API requests current weather
async function getWeather(event) {
  event.preventDefault();
  const foreCastContainer = document.querySelector(".foreCastContainer");
  foreCastContainer.innerHTML = "";
  const city = document.getElementById("cityName");
  
  const cityName = city.value;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  // make a request to the url
  const response = await fetch(currentWeatherUrl);
  const data = await response.json();
  displayWeather(data);

  getForecast(data.name);

  // save searched cities to localstorage 

  let savedCities = JSON.parse(localStorage.getItem("savedCities"))

  if (savedCities) {
    let updatedCities = [...savedCities,cityName ]
    localStorage.setItem("savedCities",JSON.stringify(updatedCities))

  } else {
    localStorage.setItem("savedCities",JSON.stringify([cityName]))
  }

  $("#city-list").append(
    '<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' +
      cityName,
  );

  
}

//Function to display current weather card
function displayWeather(data) {
  const resultsPanel = document.querySelector(".results-panel");
  resultsPanel.classList.add("visible");

  document.querySelector("#temperature").textContent =
    Math.round((data.main.temp - 273.15) * 1.8 + 32) + " °F"; //convert kelvin to fahrenheit
  document.querySelector("#city-name").textContent =
    data.name + " (" + moment().format("M/D/YYYY") + ")";
  document.querySelector("#wind-speed").textContent =
    data.wind.speed.toFixed(1) + " MPH"; //round this off
  document.querySelector("#humidity").textContent = data.main.humidity + "%";
  // get the weather Icon
  const currentIcon = document.getElementById("currentIcon");
  currentIcon.src =
    "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
}

//Function to create/display forecast cards
const createForecastItem = (item) => {
  const foreCastContainer = document.querySelector(".foreCastContainer");
  let parse = new DOMParser();
  let date = moment.unix(item.dt).format("MM/DD/YYYY");

  let textData = `<div class="col">
                      <h5 id="day-0">${date}</h5>
                  </div>
                        <div class="card-body">
                            <img src="" alt="" id="currentIcon">
                            <h4>Temp</h4>
                            <p class="card-text" id="temp-0">${(((parseFloat(item.main.temp) - 273.15) * 9) / 5 + 32).toFixed()}°F</p>
                            <h4>Humidity</h4>
                            <p class="card-text" id="humidity-0">${item.main.humidity} %</p>
                            <h4></h4>
                            <p class="card-text-dis" id="wind-speed">${item.weather[0].description}</p>
                        </div>`;
  let parsedEl = parse.parseFromString(textData, "text/html");
  foreCastContainer.appendChild(parsedEl.documentElement);
};

// API requests 5 day forecast
async function getForecast(cityName) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&appid=${apiKey}&cnt=120`;
  const response = await fetch(forecastUrl);
  // This converts the UNIX time that is received from the server.
  let timeStamp = moment.unix(1681516800).format("MM/DD/YYYY");
  let res = await response.json();
  

  // clear the existing forecast cards
  const foreCastContainer = document.querySelector(".foreCastContainer");
  foreCastContainer.innerHTML = "";


  // get every 8th value (24hours) in the returned array from the api call
  res.list.forEach((item, i) =>
    i === 0
      ? createForecastItem(item)
      : i % 8 === 0
      ? createForecastItem(item)
      : null,
  );
}

// event handlers
document.getElementById("search-button").addEventListener("click", getWeather);

$(".city-list-box").on("click", ".city-name", async function (e) {
console.log(e.target.innerText)
  
  let city = e.target.innerText
var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
let response = await fetch(url)
let data = await response.json()
displayWeather(data)
getForecast(city);
  
});
