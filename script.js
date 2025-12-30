console.log("Weather app script loaded");  
  
const cityEl = document.querySelector(".city");  
const countryEl = document.querySelector(".country");  
const mainWeatherIcon = document.getElementById("main-weather-icon");  
const searchBtn = document.getElementById("search");  
const weatherForm = document.getElementById("weather-form");  
const cityInput = document.getElementById("city-input");
const autocompleteContainer = document.getElementById("autocomplete-container");

const mainTemperature = document.getElementById("main-temperature");  
const forecastText = document.getElementById("forecast-text");  
const windSpeedEl = document.getElementById("wind-speed");  
const humidityEl = document.getElementById("humidity");  
const sunshineEl = document.getElementById("sunshine");


let cities = [];

async function loadCities() {
  try {
    const response = await fetch('/cities.json');
    if (!response.ok) throw new Error('Failed to load cities');
    cities = await response.json();
  } catch (error) {
    console.error(error);
  }
}


loadCities();

const navIcons = document.querySelectorAll(".bottom-nav i");  
  
  
  
  
if ("geolocation" in navigator) {  
  navigator.geolocation.getCurrentPosition(  
    (position) => {  
      
      const lat = position.coords.latitude;  
      const lon = position.coords.longitude;  
      getWeatherByCoords(lat, lon);  
      console.log("Latitude:", lat, "Longitude:", lon);  
    },  
    (error) => {  
  
      console.warn("Geolocation error:", error.message);  
      weatherForm.classList.add('active')  
    }  
  );  
} else {  
  weatherForm.classList.add('active')  
}  
  
const API_KEY = "43d3e8ad029c76b64663d20d3270e33a";  
  
  
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();
    console.log("Weather by location:", data);

    updateWeatherUI(data);

  
    cityInput.value = data.name;

  } catch (error) {
    console.error(error);
  }
}
  
function updateWeatherUI(data) {  
  cityEl.textContent = data.name;  
  countryEl.textContent = data.sys.country;  
  mainTemperature.textContent = `${Math.round(data.main.temp)}°C`;  
  forecastText.textContent = data.weather[0].description;  
  
  windSpeedEl.textContent = `${data.wind.speed} km/h`;  
  humidityEl.textContent = `${data.main.humidity}%`;  
  
  const sunriseDate = new Date(data.sys.sunrise * 1000);
sunshineEl.textContent = `${sunriseDate.getHours()}h`;
  
  
  mainWeatherIcon.className = `fas ${getWeatherIcon(data.weather[0].main)}`;  
}  
  
function getWeatherIcon(weatherMain) {  
  switch (weatherMain.toLowerCase()) {  
    case "clear":  
      return "fa-sun";  
    case "clouds":  
      return "fa-cloud";  
    case "rain":  
      return "fa-cloud-showers-heavy";  
    case "drizzle":  
      return "fa-cloud-rain";  
    case "thunderstorm":  
      return "fa-bolt";  
    case "snow":  
      return "fa-snowflake";  
    case "mist":  
    case "fog":  
      return "fa-smog";  
    default:  
      return "fa-question";  
  }  
}
cityInput.addEventListener("input", () => {
  const query = cityInput.value.toLowerCase();
  autocompleteContainer.innerHTML = "";

  if (!query) return;

  const matches = cities.filter(c => c.city.toLowerCase().startsWith(query));

  matches.forEach(c => {
    const div = document.createElement("div");
    div.textContent = `${c.city}, ${c.country}`;
    div.classList.add("autocomplete-item");

    div.addEventListener("click", () => {
      cityInput.value = c.city;
      autocompleteContainer.innerHTML = "";
    });

    autocompleteContainer.appendChild(div);
  });
});
weatherForm.addEventListener("submit", async (e) => {  
  e.preventDefault();  
  const city = cityInput.value.trim();  
  autocompleteContainer.innerHTML = "";
  if (!city) return;  
  
  try {  
    const response = await fetch(  
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`  
    );  
    if (!response.ok) throw new Error("City not found");  
    const data = await response.json();  
    updateWeatherUI(data);  

  } catch (error) {  
    alert(error.message);  
  }  
});

