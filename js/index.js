async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '629cf73c911596053a9b99c7d959e935'; 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`);
    const data = await response.json();
    displayWeather(data);
}

function displayWeather(data) {
    const weatherCards = document.getElementById('weatherCards');
    weatherCards.innerHTML = '';

    const cityName = data.city.name;
    const cityHeader = document.createElement('h2');
    cityHeader.textContent =` Weather in ${cityName}`;
    cityHeader.style.width = '100%';
    cityHeader.style.textAlign = 'center';
    cityHeader.style.margin = '30px 0';
    weatherCards.appendChild(cityHeader);

    const uniqueDays = new Set();
    const forecasts = [];

    for (let forecast of data.list) {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!uniqueDays.has(day) && uniqueDays.size < 3) {
            uniqueDays.add(day);
            forecasts.push(forecast);
        }

        if (uniqueDays.size >= 3) break;
    }

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;
        const windSpeed = forecast.wind.speed;
        const isDayTime = isDay(date, data.city.timezone);
        const iconCode = getWeatherIcon(forecast.weather[0].main, isDayTime);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i class="${iconCode}" style="font-size: 48px; color: white;"></i>
            <h2>${day}</h2>
            <p>${temp} °C</p>
            <p>${description}</p>
            <p><i class="fas fa-wind"></i> Wind Speed: ${windSpeed} m/s</p>
        `;
        weatherCards.appendChild(card);
    });
}

function isDay(date, timezone) {
    const utcHour = date.getUTCHours();
    const localHour = (utcHour + timezone / 3600) % 24;
    return localHour >= 6 && localHour < 18;
}

function getWeatherIcon(weatherMain, isDay) {
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            return isDay ? 'fas fa-sun' : 'fas fa-moon';
        case 'clouds':
            return 'fas fa-cloud';
        case 'rain':
            return 'fas fa-cloud-showers-heavy';
        case 'drizzle':
            return 'fas fa-cloud-rain';
        case 'thunderstorm':
            return 'fas fa-poo-storm';
        case 'snow':
            return 'fas fa-snowflake';
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
};

async function getWeatherByLocation(latitude, longitude) {
    const apiKey = '629cf73c911596053a9b99c7d959e935'; 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&cnt=40&appid=${apiKey}`);
    const data = await response.json();
    displayWeather(data);
}