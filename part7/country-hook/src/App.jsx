import React, { useState } from "react";
import { useField, useCountry } from "./hooks";

const Country = ({ country }) => {
  if (!country) {
    return <div>not found...</div>;
  }

  const { name, capital, population, flags } = country;

  return (
    <div>
      <h3>{name.common}</h3>
      <h4>capital {capital}</h4>
      <h4>population {population}</h4>
      <img src={flags.png} height="100" alt={`flag of ${name.common}`} />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
