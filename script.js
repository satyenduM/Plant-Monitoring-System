document.addEventListener('DOMContentLoaded', function() {
    fetchDataFromThingSpeak();
    setInterval(fetchDataFromThingSpeak, 10000);
});

function fetchDataFromThingSpeak() {
    const apiURL = 'https://api.thingspeak.com/channels/2319438/feeds.json?results=2';

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        if (data.feeds.length > 0) {
            const latestData = data.feeds[data.feeds.length - 1];
            predictOptimalConditions(latestData);
            displayData(latestData);
            toggleDarkMode(latestData.field4);
        }
    })
    .catch(error => console.error('Error:', error));
}

function predictOptimalConditions(data) {
    fetch('http://127.0.0.1:5000/predict/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(data),
    })
    .then(result => {
        console.log('Prediction:', result.prediction);
        updateDisplayWithPrediction(result.prediction);
    })
    .catch(error => console.error('Error:', error));
}

function updateDisplayWithPrediction(prediction) {
    const predictionContainer = document.getElementById('prediction-container');
    if (!predictionContainer) {
        console.error('Prediction container element not found');
        return;
    }

    if (prediction === 1) {
        predictionContainer.innerHTML = '<p style="color: green;">Conditions are optimal for plant growth ✅</p>';
    } else {
        predictionContainer.innerHTML = '<p style="color: red;">Conditions are not optimal for plant growth ❌</p>';
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Clear existing content

    const fieldNames = {
        field1: "Temperature (°C)",
        field2: "Humidity (%)",
        field3: "Soil Moisture (%)",
        field4: "Light",
        field5: "Pressure (Pa)"
    };

    for (let key in fieldNames) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const isInRange = checkRange(key, value);
            const fieldElement = document.createElement('div');
            fieldElement.classList.add('field');
            fieldElement.innerHTML = `
                <h3>${fieldNames[key]}</h3>
                <p>Value: ${value} ${isInRange ? '✅' : '❌'}</p>
            `;
            container.appendChild(fieldElement);
        }
    }
}

function checkRange(field, value) {
    switch(field) {
        case 'field1': // Temperature
            return value >= 14 && value <= 24;
        case 'field2': // Humidity
            return value >= 90 && value <= 95;
        case 'field3': // Soil Moisture
            return value >= 20 && value <= 50;
        case 'field4': // Light
            return value >= 300 && value <= 800;
        case 'field5': // Pressure
            return value >= 81060 && value <= 121590;
        default:
            return false;
    }
}
function toggleDarkMode(lightValue) {
    if (lightValue = 100) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

