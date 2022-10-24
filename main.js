const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// Configure dotenv package

require('dotenv').config();

// Set up openweathermap API_KEY

const apiKey = `${process.env.SECRET_KEY}`;

// Setup express app and body-parser configurations
// Setup javascript template view engine
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Setup default display on launch
app.get('/', function(req, res) {

    // will not fetch or display any data in the index page
    res.render('index', { weather: null, error: null });
});

// On a post request, the app gets data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {

    // Get city name passed in the form
    let city = req.body.city;

    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // Request data using the URL
    request(url, function(err, response, body) {

        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);

            //console log it just to make sure that the data being displayed is what we want
            console.log(weather);

            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                // use data to set up the output
                let place = `${weather.name}, ${weather.sys.country}`,
                    /* We shall calculate the current timezone using the data fetched*/
                weatherTimezone = `${new Date(weather.dt * 1000 - (weather.timezone * 1000))}`;
                let weatherTemp = `${weather.main.temp}`,
                  
                    /* fetch the weather icon and its size using the icon data*/
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    main = `${weather.weather[0].main}`;

                // round temp to nearest whole degree
                const roundToTwo= (num) => {
                    return +(Math.round(num + "e+0") + "e-0");
                }
                weatherFahrenheit = roundToTwo(weatherTemp);

                // need to render the data to our page (index.ejs) before displaying it out
                res.render('index', { 
                    weather: weather, 
                    place: place, 
                    temp: weatherTemp,  
                    icon: weatherIcon, 
                    description: weatherDescription, 
                    timezone: weatherTimezone, 
                    fahrenheit: weatherFahrenheit, 
                    main: main, 
                    error: null });
            }
        }
    });
});

// set up  port configurations
app.listen(5000, function() {
    console.log('Weather app listening on port 5000!');
});