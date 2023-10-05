// function: show day and time
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let hour = date.getHours();
  let minute = date.getMinutes();

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  return (dateTime.innerHTML = `${day} ${hour}:${minute}`);
}

// function: format day for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// function: display forecast
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row justify-content-center">`;

  forecast.forEach(function (forecastDay) {
    forecastHTML += `
      <div class="col forecast-preview">
        <div class="forecast-day">${formatDay(forecastDay.time)}</div>
        <img
          src="${forecastDay.condition.icon_url}"
          alt="${forecastDay.condition.description}"
          class="forecast-icon"
        />
        <div class="temperature">
          <span class="forecast-high">${Math.round(
            forecastDay.temperature.maximum
          )}°</span>
          <span class="forecast-low">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
      </div>
    `;
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// function: get forecast
function getForecast(city) {
  let unit = "metric";
  let apiKey = "d60fd2e148aef51f4643441eotf6b3fb";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

// function: show weather
function showCurrentWeather(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#date-time").innerHTML = formatDate(new Date());
  document.querySelector("#sky-description").innerHTML =
    response.data.condition.description;

  // current temperature
  let iconElement = document.querySelector("#current-temperature-icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  // temperature units
  let celsius = document.querySelector("#celsius");
  celsius.classList.add("unclickable");
  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.classList.remove("unclickable");

  // weather stats: feels like, humidity, wind
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.temperature.feels_like
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  getForecast(response.data.city);
}

// function: search for city
function searchCity(city) {
  let unit = "metric";
  let apiKey = "d60fd2e148aef51f4643441eotf6b3fb";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

// function: handle submit
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

// for "current" button: search location
function searchLocation(position) {
  let apiKey = "d60fd2e148aef51f4643441eotf6b3fb";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}`;

  axios.get(apiUrl).then(showCurrentWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);

  document.querySelector("#city-input").value = "";
}

// function: change temperature units
function changeTempUnit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = temperatureElement.innerHTML;

  let celsius = document.querySelector("#celsius");
  let fahrenheit = document.querySelector("#fahrenheit");

  let feelsLikeElement = document.querySelector("#feels-like");
  let feelsLike = feelsLikeElement.innerHTML;

  if (celsius.classList.contains("unclickable")) {
    // converts to fahrenheit
    let fahrenheitTemp = temperature * (9 / 5) + 32;
    temperatureElement.innerHTML = `${Math.round(fahrenheitTemp)}`;

    celsius.classList.remove("unclickable");
    fahrenheitLink.classList.add("unclickable");

    let feelsLikeTemp = feelsLike * (9 / 5) + 32;
    feelsLikeElement.innerHTML = `${Math.round(feelsLikeTemp)}`;
    document.querySelector("#feels-like-unit").innerHTML = "F";
  } else {
    // converts to celsius
    let celsiusTemp = (temperature - 32) * (5 / 9);
    temperatureElement.innerHTML = `${Math.round(celsiusTemp)}`;

    fahrenheit.classList.remove("unclickable");
    celsius.classList.add("unclickable");

    let feelsLikeTemp = (feelsLike - 32) * (5 / 9);
    feelsLikeElement.innerHTML = `${Math.round(feelsLikeTemp)}`;
    document.querySelector("#feels-like-unit").innerHTML = "C";
  }
}

// call functions

// show city, date, and time on refresh
searchCity("Jersey City");
let dateTime = document.querySelector("#date-time");
formatDate(new Date());

// handle search --> show city and weather
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// get current position --> weather in current position
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentPosition);

// convert temperature
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", changeTempUnit);
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeTempUnit);
