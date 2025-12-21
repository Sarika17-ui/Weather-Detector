let tempChart, humidityChart;

async function getWeather() {
    const city = document.getElementById("cityInput").value;

    const res = await fetch(`http://127.0.0.1:5000/weather?city=${city}`);
    const data = await res.json();

    // CURRENT WEATHER
    document.getElementById("currentWeather").innerHTML = `
        <h3>${data.city}</h3>
        <p><b>Temperature:</b> ${data.temperature}°C</p>
        <p><b>Humidity:</b> ${data.humidity}%</p>
        <p><b>Wind:</b> ${data.wind} m/s</p>
        <p><b>Description:</b> ${data.description}</p>
        <p style="color:red;"><b>${data.alert ?? ""}</b></p>
    `;

    // FORECAST CARDS
    let html = "";
    let forecastTemps = [];
    let forecastHumidity = [];
    let forecastDates = [];

    data.forecast.forEach(f => {
        html += `
            <div class="forecast-card">
                <p><b>${f.date.split(" ")[0]}</b></p>
                <img src="https://openweathermap.org/img/wn/${f.icon}.png">
                <p>${f.temp}°C</p>
                <p>Min: ${f.min}</p>
                <p>Max: ${f.max}</p>
            </div>
        `;

        forecastDates.push(f.date.split(" ")[0]);
        forecastTemps.push(f.temp);
        forecastHumidity.push(f.humidity);
    });

    document.getElementById("forecast").innerHTML = html;

    // GRAPH — Temperature
    renderChart("tempChart", forecastDates, forecastTemps, "Temperature (°C)");

    // GRAPH — Humidity
    renderChart("humidityChart", forecastDates, forecastHumidity, "Humidity (%)");
}

function renderChart(canvasId, labels, data, labelName) {
    const ctx = document.getElementById(canvasId);

    if (canvasId === "tempChart" && tempChart) tempChart.destroy();
    if (canvasId === "humidityChart" && humidityChart) humidityChart.destroy();

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: labelName,
                data: data,
                borderWidth: 3
            }]
        }
    });

    if (canvasId === "tempChart") tempChart = chart;
    else humidityChart = chart;
}

