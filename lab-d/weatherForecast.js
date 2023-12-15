document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('locationInput');
    const checkButton = document.getElementById('checkButton');
    const weatherResultsContainer = document.getElementById('weather-results-container');
    let apiKey; 

    checkButton.addEventListener('click', function () {
        const location = locationInput.value;

        if (location.trim() !== '') {
            apiKey = '7ded80d91f2b280ec979100cc8bbba94'; 
            const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=pl`;
            const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pl`;

           
            const xhr = new XMLHttpRequest();
            xhr.open('GET', currentWeatherApiUrl, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    displayWeather(response);
                    logForecastQuery(location, apiKey);
                }
            };
            xhr.send();

           
            fetch(forecastApiUrl)
                .then(response => response.json())
                .then(data => displayForecast(data))
                .catch(error => console.error('Error fetching forecast:', error));
        } else {
            alert('Wprowadź nazwę miejscowości.');
        }
    });

    function displayForecast(data) {
        const forecastBlock = document.createElement('div');
        forecastBlock.classList.add('weather-block'); // ta sama clasa z cssa
    
        
        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000);
            const formattedDate = date.toLocaleDateString("pl-PL");
    
            const forecastInfo = document.createElement('div');
            forecastInfo.classList.add('forecast-info'); 
    
            forecastInfo.innerHTML = `
                <p>Data: ${formattedDate}</p>
                <p>Pogoda: ${forecast.weather[0].description}</p>
                <p>Temperatura: ${forecast.main.temp.toFixed(2)} °C</p>
                <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">
                <hr>
            `;
    
            forecastBlock.appendChild(forecastInfo);
        }
    
        
        weatherResultsContainer.appendChild(forecastBlock);
    
        
        console.log('5-dniowa prognoza:', data);
    }


    function logForecastQuery(location, apiKey) {
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pl`;

        const forecastXhr = new XMLHttpRequest();

        forecastXhr.open('GET', forecastApiUrl, true);

        forecastXhr.onreadystatechange = function () {
            if (forecastXhr.readyState === 4 && forecastXhr.status === 200) {
                console.log('Dzisiejsza prognoza:', JSON.parse(forecastXhr.responseText));
            }
        };

        forecastXhr.send();
    }

    function displayWeather(data) {
        const weatherBlock = document.createElement('div');
        weatherBlock.classList.add('weather-block'); // ta sama clasa z cssa
        
        
        const temperatureCelsius = data.main.temp;
        const feelsLikeCelsius = data.main.feels_like;

       
        const timestamp = data.dt * 1000; 
        const date = new Date(timestamp);
        const formattedDateTime = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

        weatherBlock.innerHTML = `
            <p>Miejsce: ${data.name}</p>
            <p>Pogoda: ${data.weather[0].description}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperatura: ${temperatureCelsius.toFixed(2)} °C</p>
            <p>Odczuwalna temperatura: ${feelsLikeCelsius.toFixed(2)} °C</p>
            <p>Data i czas: ${formattedDateTime}</p>
        `;
        weatherResultsContainer.appendChild(weatherBlock);
        
    }
});



