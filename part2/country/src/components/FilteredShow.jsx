import React, { useState, useEffect } from "react";
import axios from "axios";
import CountryDetails from "./CountryDetails";

const FilteredShow = ({ filteredCountries, filter, handleShow, show }) => {
  const [weatherData, setWeatherData] = useState(null);
  // console.log("✌️weatherData --->", weatherData);

  // console.log("filteredCountries", filteredCountries);

  const city =
    filteredCountries.length === 1
      ? filteredCountries[0].capital[0].toLowerCase()
      : "";

  //console.log("city", city);

  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  // console.log("✌️apiKey --->", apiKey);

  const url = city
    ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`
    : "";
  //console.log("✌️url --->", url);

  const weatherIcon = weatherData ? weatherData.weather[0].icon : null; // Get the weather icon code
  const weatherIconUrl = weatherIcon
    ? `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    : "";

  useEffect(() => {
    const fetchWeather = async () => {
      if (city) {
        try {
          const response = await axios.get(url);
          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setWeatherData(null);
        }
      }
    };

    fetchWeather();
  }, [city]);

  if (filteredCountries.length === 1) {
    //console.log("✌️weatherIconUrl --->", weatherIconUrl);

    const country = filteredCountries[0];

    return (
      <CountryDetails
        country={country}
        weatherData={weatherData}
        weatherIconUrl={weatherIconUrl}
      />
    );
  }

  if (filteredCountries.length > 1 && filteredCountries.length <= 30) {
    const flagStyle = {
      border: "1px solid black",
    };

    return filteredCountries.map((country) => (
      <div key={country.name.official}>
        <b>{country.name.common}</b>

        <button onClick={() => handleShow(country.name.official)}>
          {show[country.name.official] ? "hide" : "show"}
        </button>
        {show[country.name.official] && (
          <div key={country.name.official}>
            <h1>{country.name.common}</h1>

            <h4>capital: {country.capital}</h4>
            <h4>area: {country.area}</h4>

            <h3>languages:</h3>

            <ul>
              <b>
                {Object.entries(country.languages).map(([code, language]) => (
                  <li key={code}>{language}</li>
                ))}
              </b>
            </ul>

            <img
              src={country.flags.png}
              alt={country.flags.alt}
              style={flagStyle}
            />
          </div>
        )}
        <hr />
      </div>
    ));
  }

  if (filter && filteredCountries.length > 30) {
    return <h4>Too many matches, specify another filter</h4>;
  }

  return;
};

export default FilteredShow;
