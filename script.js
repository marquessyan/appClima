// API Key para Atual (https://openweathermap.org/)
const API_KEY = "dbf3e17475d2d628435ac442e41c7361";
// API Key para Futura (https://www.weatherapi.com/)
const API_KEY_CAST = "8bd57aa62d264113a32155758250106";

// Elementos do DOM
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

// Validação e detectar a tecla Enter

document.getElementById("city-input").onkeydown = function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("search-btn").click();
  }
};

// Atualizar UI
function updateUI(data, datacast) {
  document.querySelector("body").style.backgroundImage =
    "url(img/" + data.weather[0].main + ".jpg)";
  document.getElementById(
    "weather-icon-img"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temperature").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.getElementById("weather-description").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${Math.round(
    data.wind.speed
  )} km/h`;
  // Previsão de 5 dias
  var cast;
  for (cast = 0; cast < 5; cast++) {
    let div = document.getElementById("for-day-" + cast);
    let img = div.querySelector("img");
    img.src =
      "https://" + datacast.forecast.forecastday[cast].day.condition.icon;
    let tMin = div.querySelector(".temp-min");
    let tMax = div.querySelector(".temp-max");
    tMin.textContent = datacast.forecast.forecastday[cast].day.mintemp_c + "°C";
    tMax.textContent = datacast.forecast.forecastday[cast].day.maxtemp_c + "°C";
    // Dias da semana
    const data = new Date();
    const days = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
    const currDay = days[(data.getDay() + cast) % 7];
    let dayW = div.querySelector(".day-week");
    dayW.textContent = currDay;
  }
}

// Buscar clima por cidade
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`
    );
    if (!response.ok) throw new Error("Local não encontrado (OpenWeather)"); // Verifica se a resposta é válida

    const responsecast = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY_CAST}&q=${city}&days=5&aqi=no&alerts=no`
    );
    if (!responsecast.ok) throw new Error("Local não encontrado (WeatherAPI)"); // Verifica a segunda API

    const datacast = await responsecast.json();
    const data = await response.json();
    return [data, datacast];
  } catch (error) {
    alert(`Erro ao buscar dados: ${error.message}`); // Exibe o erro em um alerta
    console.error(error); // Log para debug
    return null; // Retorna null ou pode lançar o erro novamente com `throw error`
  }
}

// Event Listeners
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value;
  const weatherData = await getWeather(city);
  updateUI(...weatherData);
  // console.log(weatherData);
});

// Geolocalização
navigator.geolocation.getCurrentPosition(async (position) => {
  // let ctn = 5;
  const { latitude, longitude } = position.coords;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
  );
  console.log(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
  );
  const responsecast = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY_CAST}&q=${latitude}, ${longitude}&days=5&aqi=no&alerts=no`
  );
  console.log(
    `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY_CAST}&q=${latitude}, ${longitude}&days=5&aqi=no&alerts=no`
  );
  const data = await response.json();
  const datacast = await responsecast.json();
  updateUI(data, datacast);
});
