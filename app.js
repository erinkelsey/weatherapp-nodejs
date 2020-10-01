/**
 * Setup and initialization.
 */
require("dotenv").config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * GET Method for main route.
 *
 * Sends back the index.html to render as the page.
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/**
 * POST method for main route.
 *
 * Makes a call to the OpenWeather API to retrieve the
 * weather data for the city the user has specified.
 * Returns the current weather data for the city, if found,
 * else returns a response that it could not be found.
 */
app.post("/", (req, res) => {
  const apiKey = process.env.API_KEY;
  const query = req.body.cityName;
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;

  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      let responseString = "";

      try {
        const imageURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        responseString = `
          <h1>The temperature in ${query} is ${weatherData.main.temp} degrees Celsius.</h1>
          <p>The weather is currently ${weatherData.weather[0].description}</p>
          <img src=${imageURL} />
        `;
      } catch (e) {
        responseString = `
          <h1>Could not find city you are looking for.</h1>
          <p>Refresh page to try again.</p>
        `;
      }

      res.send(responseString);
    });
  });
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});
