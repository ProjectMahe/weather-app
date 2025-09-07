// Replace with your actual API key from OpenWeatherMap
const apiKey = 'YOUR_OPENWEATHER_API_KEY';

const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const hourlyChart = document.getElementById('hourly-chart');
const dailyForecastContainer = document.getElementById('daily-forecast');

searchButton.addEventListener('click', async () => {
    const city = cityInput.value;
    if (city) {
        await fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.length === 0) {
            cityNameEl.textContent = 'City not found!';
            return;
        }

        const { lat, lon } = geocodeData[0];
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,alerts`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        displayCurrentWeather(weatherData.current, geocodeData[0].name);
        displayHourlyChart(weatherData.hourly);
        displayDailyForecast(weatherData.daily);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        cityNameEl.textContent = 'Error: ' + error.message;
        temperatureEl.textContent = '';
        descriptionEl.textContent = '';
        humidityEl.textContent = '';
    }
}

function displayCurrentWeather(currentData, cityName) {
    cityNameEl.textContent = cityName;
    temperatureEl.textContent = `Temperature: ${currentData.temp}°C`;
    descriptionEl.textContent = `Condition: ${currentData.weather[0].description}`;
    humidityEl.textContent = `Humidity: ${currentData.humidity}%`;
}

function displayHourlyChart(hourlyData) {
    const hourlyTemps = hourlyData.slice(0, 24).map(hour => hour.temp);
    const hourlyTimes = hourlyData.slice(0, 24).map(hour => {
        const date = new Date(hour.dt * 1000);
        return `${date.getHours()}:00`;
    });

    new Chart(hourlyChart, {
        type: 'line',
        data: {
            labels: hourlyTimes,
            datasets: [{
                label: 'Temperature (°C)',
                data: hourlyTemps,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }]
        }
    });
}

function displayDailyForecast(dailyData) {
    dailyForecastContainer.innerHTML = ''; // Clear previous forecast
    dailyData.slice(1, 8).forEach(day => { // Skip current day
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        const date = new Date(day.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconCode = day.weather[0].icon;

        dayCard.innerHTML = `
            <div>${dayOfWeek}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon">
            <div>${Math.round(day.temp.day)}°C</div>
        `;
        dailyForecastContainer.appendChild(dayCard);
    });
}
