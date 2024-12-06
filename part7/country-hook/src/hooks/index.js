import { useState, useEffect } from "react";
import axios from "axios";

export const useField = (type) => {
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) {
      setCountry(null);
      return;
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        );
        setCountry(response.data);
      } catch (error) {
        setCountry(null);
      }
    };

    fetchCountry();
  }, [name]);

  return country;
};
