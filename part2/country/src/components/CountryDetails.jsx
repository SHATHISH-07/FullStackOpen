import React from "react";

const CountryDetails = ({ country, weatherData, weatherIconUrl }) => {
  const flagStyle = {
    border: "1px solid black",
  };
  return (
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
      <h3>flag:</h3>
      <img src={country.flags.png} alt={country.flags.alt} style={flagStyle} />
      <h1>Weather in {country.capital}</h1>

      {weatherData ? (
        <>
          <p>
            temperature - {(weatherData.main.temp - 273.15).toFixed(2)} °Celsius
          </p>
          <img src={weatherIconUrl} />
          <p>wind {weatherData.wind.speed} m/s</p>
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default CountryDetails;
