import React from "react";

// Persons Form Component
const PersonForm = ({
  handleNameChange,
  handleNewName,
  handleNewNumber,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={handleNameChange}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
