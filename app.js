const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const API_KEY = '52dc6ddc45cf4a8dae9225040230206';

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// POST endpoint to fetch weather for multiple cities
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherPromises = cities.map(city => getWeather(city));
    const weatherData = await Promise.all(weatherPromises);

    const weather = {};
    weatherData.forEach((data, index) => {
      weather[cities[index]] = data;
    });

    res.json({ weather });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Function to fetch weather for a single city
async function getWeather(city) {
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
    const temperature = response.data.current.temp_c;
    return `${temperature}C`;
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}`, error);
    return 'N/A';
  }
}

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
