import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => setValue("");

  return {
    fieldService: {
      type,
      value,
      onChange,
    },

    reset,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      setResources(response.data);
    });
  }, [baseUrl]);

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then((response) =>
        setResources((prevResources) => [...prevResources, response.data])
      );
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.fieldService.value });
    content.reset();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({
      name: name.fieldService.value,
      number: number.fieldService.value,
    });
    name.reset();
    number.reset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input
          type={content.fieldService.type}
          value={content.fieldService.value}
          onChange={content.fieldService.onChange}
        />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name{" "}
        <input
          type={name.fieldService.type}
          value={name.fieldService.value}
          onChange={name.fieldService.onChange}
        />{" "}
        <br />
        number{" "}
        <input
          type={number.fieldService.type}
          value={number.fieldService.value}
          onChange={number.fieldService.onChange}
        />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
