import axios from "axios";
import { useState, useEffect } from "react";
import personService from "./services/phoneBook";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";

//App Component
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationTYpe, setNotificationType] = useState(null);

  //TimeOut for the Notification
  const notify = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  //UseEffect to fetch data from db.json server
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  //Function to handle the newName Obj and duplicate removal part
  const handleNameChange = (event) => {
    event.preventDefault();

    const newObj = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phoneBook, replace the old number with the new one?`
        )
      ) {
        personService
          .update(existingPerson.id, newObj)
          .then((updatedPerson) => {
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson
              )
            );
            notify(
              `${newObj.name}'s number was updated successfully!`,
              "success"
            );
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              notify(
                `Information for ${newObj.name} has already been removed from the server`,
                "error"
              );
              setPersons((prevPersons) =>
                prevPersons.filter((p) => p.id !== existingPerson.id)
              );
            } else {
              notify(
                `Failed to update ${newObj.name}. Error: ${error.response.data.error}`,
                "error"
              );
            }
          })
          .finally(() => {
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      personService
        .create(newObj)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          notify(`${newObj.name} was added successfully!`, "success");
        })
        .catch((error) => {
          notify(
            `Failed to add ${newObj.name}. Error: ${error.response.data.error}`,
            "error"
          );
        })
        .finally(() => {
          setNewName("");
          setNewNumber("");
        });
    }
  };

  //Function to handle newName and update
  const handleNewName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };

  //Function to handle new Number and Update
  const handleNewNumber = (event) => {
    event.preventDefault();
    setNewNumber(event.target.value);
  };

  //Function to handle Filter and Update
  const handleFilter = (event) => {
    event.preventDefault();

    setFilter(event.target.value);
  };

  // Function to handle delete name from the server and the page
  const handleDelete = (id) => {
    const personToDelete = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          notify(`${personToDelete.name} was deleted successfully`, "success");
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            notify(
              `Information for ${personToDelete.name} has already been removed from the server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== id));
          } else {
            notify(`Unable to delete ${personToDelete.name}`, "error");
          }
        });
    }
  };

  return (
    <div>
      <h2>PhoneBook</h2>

      <Notification message={notification} type={notificationTYpe} />

      <Filter handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm
        handleNameChange={handleNameChange}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
