// Replace with your actual API key from OpenWeatherMap

const apiKey = '8d998e4bfd69d3e9c4d3a265fcb4fd24';

const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        if (!response.ok) {
            throw new Error('City not found!');
        }

        const data = await response.json();
        displayWeatherData(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        cityNameEl.textContent = 'Error: ' + error.message;
        temperatureEl.textContent = '';
        descriptionEl.textContent = '';
        humidityEl.textContent = '';
    }
}

function displayWeatherData(data) {
    cityNameEl.textContent = data.name;
    temperatureEl.textContent = `Temperature: ${data.main.temp}°C`;
    descriptionEl.textContent = `Condition: ${data.weather[0].description}`;
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
}
