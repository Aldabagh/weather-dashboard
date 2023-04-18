


const apiKey = "64a3b92c5913e381167a37aa42725948";

// API requests current weather
async function getWeather(event) {
  event.preventDefault();
  const foreCastContainer = document.querySelector(".foreCastContainer");
  foreCastContainer.innerHTML = "";
  const city = document.getElementById("cityName");
  console.log(city.value);
  const cityName = city.value;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  // make a request to the url
  const response = await fetch(currentWeatherUrl);
  const data = await response.json();
  displayWeather(data);
  console.log(data.name);
  getForecast(data.name);

  
  $("#city-list").append(
    '<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' +
      cityName,
  );
// get the coordinates
  const lat = data.coord.lat;
  const lon = data.coord.lon;
console.log(data);
  var latLonPair = lat.toString() + " " + lon.toString();
  // save the search city to local storage
  localStorage.setItem(cityName, latLonPair);
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

// API requests 5 day forecast
async function getForecast(coordinates) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${coordinates}&appid=${apiKey}&cnt=120`;
  const response = await fetch(forecastUrl);
  // This converts the UNIX time that is received from the server.
  let timeStamp = moment.unix(1681516800).format("MM/DD/YYYY");
  let res = await response.json();
  console.log(res);
  // get every 8th value (24hours) in the returned array from the api call
  res.list.forEach((item, i) =>
    i === 0
      ? createForecastItem(item)
      : i % 8 === 0
      ? createForecastItem(item)
      : null,
  );
  
}

//Function to create/display forecast cards
const createForecastItem = (item) => {
  const foreCastContainer = document.querySelector(".foreCastContainer");
  let parse = new DOMParser();
  let date = moment.unix(item.dt).format("MM/DD/YYYY");
  console.log({ item });
  let textData = `<div class="col">
                              
                                  <h5 id="day-0">${date}</h5>
                              </div>
                                <div class="card-body">
                                    <img src="" alt="" id="currentIcon">
                                    <h4>Temp</h4>
                                    <p class="card-text" id="temp-0">${(
                                      ((parseFloat(item.main.temp) - 273.15) *
                                        9) /
                                        5 +
                                      32
                                    ).toFixed()}°F</p>
                                    <h4>Humidity</h4>
                                    <p class="card-text" id="humidity-0">${
                                      item.main.humidity
                                    } %</p>
                                    <h4></h4>
                                    <p class="card-text-dis" id="wind-speed">${
                                      item.weather[0].description
                                    }</p>
                                </div>
                  </div>`;
  let parsedEl = parse.parseFromString(textData, "text/html");
  foreCastContainer.appendChild(parsedEl.documentElement);
};



// event handler
document.getElementById("search-button").addEventListener("click", getWeather);

$(".city-list-box").on("click", ".city-name", async function () {
  $("#city-name")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";
  var cityName = $(this)[0].textContent;
  console.log(cityName);
  // var cordenates = localStorage.getItem(cityName)
var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
let response = await fetch(url)
let data = await response.json()
displayWeather(data);
getForecast(data.name);
  
  // var previousSearch = $(this)[0].textContent;
  // document.querySelector("#cityName").value = previousSearch ?? "minneapolis";
  
  // update cityName input content
  // click search-button
});


