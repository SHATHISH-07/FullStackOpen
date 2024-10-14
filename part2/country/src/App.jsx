import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import countryService from "./services/country";
import FilteredShow from "./components/FilteredShow";

function App() {
  const [countryData, setCountryData] = useState([]);

  const [filter, setFilter] = useState("");

  const [show, setShow] = useState({});

  useEffect(() => {
    countryService
      .getAll()
      .then((response) => {
        setCountryData(response);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // console.log("✌️event.target.value --->", event.target.value);
  };

  const filteredCountries = countryData.filter((country) => {
    const filterLower = filter.toLowerCase();
    return (
      country.name.common.toLowerCase().includes(filterLower) ||
      country.name.official.toLowerCase().includes(filterLower)
    );
  });

  const handleShow = (countryName) => {
    setShow((prevState) => ({
      ...prevState,
      [countryName]: !prevState[countryName],
    }));
    // console.log("show", [countryName]);
  };

  return (
    <>
      <div>
        <h1>Search for countries</h1>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <br />
      <div>
        <FilteredShow
          filteredCountries={filteredCountries}
          filter={filter}
          handleShow={handleShow}
          show={show}
        />
      </div>
    </>
  );
}

export default App;
