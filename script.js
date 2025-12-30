console.log("Weather app script loaded");  
  
const cityEl = document.querySelector(".city");  
const countryEl = document.querySelector(".country");  
const mainWeatherIcon = document.getElementById("main-weather-icon");  
const searchBtn = document.getElementById("search");  
const weatherForm = document.getElementById("weather-form");  
const cityInput = document.getElementById("city-input");  
const mainTemperature = document.getElementById("main-temperature");  
const forecastText = document.getElementById("forecast-text");  
const windSpeedEl = document.getElementById("wind-speed");  
const humidityEl = document.getElementById("humidity");  
const sunshineEl = document.getElementById("sunshine");  
const hourlyForecast = [  
  {  
    icon: document.getElementById("hour1-icon"),  
    time: document.getElementById("hour1-time"),  
    temp: document.getElementById("hour1-temp"),  
  },  
  {  
    icon: document.getElementById("hour2-icon"),  
    time: document.getElementById("hour2-time"),  
    temp: document.getElementById("hour2-temp"),  
  },  
  {  
    icon: document.getElementById("hour3-icon"),  
    time: document.getElementById("hour3-time"),  
    temp: document.getElementById("hour3-temp"),  
  },  
  {  
    icon: document.getElementById("hour4-icon"),  
    time: document.getElementById("hour4-time"),  
    temp: document.getElementById("hour4-temp"),  
  }  
];  
const navIcons = document.querySelectorAll(".bottom-nav i");  
  
  
  
  
const today = new Date();  
const todayISO = today.toISOString().split("T")[0];  
  
const maxDate = new Date();  
maxDate.setDate(today.getDate() + 7);   
const maxDateISO = maxDate.toISOString().split("T")[0];  
  
datePicker.min = todayISO;  
datePicker.max = maxDateISO;  
  
datePicker.addEventListener("change", () => {  
  const selected = new Date(datePicker.value);  
  
  if (selected > maxDate) {  
    alert("Weather data is only available for the next 7 days.");  
    datePicker.value = maxDateISO;  
  }  
});  
  
  
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
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);  
        
      if (!response.ok) throw new Error('failed to fetch weather');  
        
      const data = await response.json();  
      console.log('Weather data:', data)  
      updateWeatherUI(data);  
    } catch (error) {  
      console.log('error fetching data', error);  
    }  
}  
  
function updateWeatherUI(data) {  
  cityEl.textContent = data.name;  
  countryEl.textContent = data.sys.country;  
  mainTemperature.textContent = `${Math.round(data.main.temp)}°C`;  
  forecastText.textContent = data.weather[0].description;  
  
  windSpeedEl.textContent = `${data.wind.speed} km/h`;  
  humidityEl.textContent = `${data.main.humidity}%`;  
  sunshineEl.textContent = `${data.sys.sunrise}h`;   
  
  
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
  
weatherForm.addEventListener("submit", async (e) => {  
  e.preventDefault();  
  const city = cityInput.value.trim();  
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