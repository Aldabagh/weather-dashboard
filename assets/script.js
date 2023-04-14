
//5 Day Forecast Api
//pass in coordinates instead of just a city name

/*5-day forecast that displays the date,
 an icon representation of weather conditions,
  the temperature, the wind speed, and the humidity*/

//localStorage

const apiKey = "64a3b92c5913e381167a37aa42725948";



async function getForecast(anything){
  //const cityName = "New York"
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${anything}&appid=${apiKey}`;
  const response = await fetch(forecastUrl)
	.then(response => response.json())
	.then(data => console.log(data))
  // const response = await fetch (forecastUrl)
  // const responseJson = response.json();
  

  console.log(response)
}

function displayWeather(data){
  document.querySelector('#temperature').textContent = Math.round(((data.main.temp-273.15)*1.8)+32) + ' °F';
  
  
  
  
  document.querySelector('#humidity').textContent = data.main.humidity;
  console.log(data.main.temp)
}




async function getWeather(event){
  event.preventDefault();
    
  const city = document.getElementById('cityName');
  console.log(city.value);
  const cityName = city.value;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(currentWeatherUrl)
  console.log(response)
  const data = await response.json()
  console.log(data)
  displayWeather(data)
console.log(data.name)
  getForecast(data.name)
}
document.getElementById('search-button').addEventListener('click',getWeather);

