import React from "react";

//Persons ShowCase component
const Persons = ({ persons, filter, handleDelete }) => {
  const filteredShow = persons.filter((person) => {
    return person.name.toLowerCase().includes(filter.toLowerCase());
  });

  return filteredShow.map((person) => (
    <div key={person.id}>
      {person.name} {person.number} {}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </div>
  ));
};

export default Persons;
