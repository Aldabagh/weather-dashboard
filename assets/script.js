const apiKey = "64a3b92c5913e381167a37aa42725948";

const createForecastItem = (item) => {
  const foreCastConainer = document.querySelector(".foreCastConainer");
  let parse = new DOMParser();
  let date = moment.unix(item.dt).format("MM/DD/YYYY");
  console.log({ item });
  let textData = `<div class="col">
                            <div class="card">
                                <div class="card-header">
                                    <h5 id="day-0">${date}</h5>
                                </div>
                                <div class="card-body">
                                    <img src="" alt="" id="img-0">
                                    <h4>Temp</h4>
                                    <p class="card-text" id="temp-0">${item.main.temp}</p>
                                    <h4>Humidity</h4>
                                    <p class="card-text" id="hum-0">${item.main.humidity}</p>
                                </div>
                            </div>
                        </div>`;
  let parsedEl = parse.parseFromString(textData, "text/html");
  foreCastConainer.appendChild(parsedEl.documentElement);
};

// API requests 5 day forecast
async function getForecast(coordinates) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${coordinates}&appid=${apiKey}&cnt=120`;
  const response = await fetch(forecastUrl);
  let timeStamp = moment.unix(1681516800).format("MM/DD/YYYY");
  let res = await response.json();
  console.log(res);
  res.list.forEach((item, i) =>
    i === 0
      ? createForecastItem(item)
      : i % 8 === 0
      ? createForecastItem(item)
      : null,
  );
}

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

// API requests current weather
async function getWeather(event) {
  event.preventDefault();
  const foreCastConainer = document.querySelector(".foreCastConainer");
  foreCastConainer.innerHTML = "";
  const city = document.getElementById("cityName");
  console.log(city.value);
  const cityName = city.value;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(currentWeatherUrl);
  const data = await response.json();
  displayWeather(data);
  console.log(data.name);
  getForecast(data.name);
  let btn = document.createElement("button");
  btn.className =
    "list-group-item list-group-item-light list-group-item-action city-name";
  btn.textContent = cityName;
  btn.addEventListener("click", (e) => {
    console.log("clock");
    getForecast(data.name);
  });
  // bnt.click(e=>alert('make api call'))
  console.log(btn);
  $("#city-list").append(btn);
}
document.getElementById("search-button").addEventListener("click", getWeather);
