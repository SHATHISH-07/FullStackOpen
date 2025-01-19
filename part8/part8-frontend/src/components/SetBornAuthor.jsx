import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Select from "react-select";

const SET_BORN = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`;

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const SetBornAuthor = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState();

  const { data, loading, error: queryError } = useQuery(ALL_AUTHORS);

  const options =
    data?.allAuthors.map((a) => ({
      value: a.name,
      label: a.name,
    })) || [];

  const [editAuthor] = useMutation(SET_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "An error occurred");
    },
    onCompleted: () => {
      setMessage("updated author born successfully!");
      setTimeout(() => setMessage(""), 5000);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    if (!name || !born) {
      setError("Both fields are required");
      return;
    }

    editAuthor({ variables: { name, born: Number(born) } });

    setName("");
    setBorn("");
    setError(null);
  };

  return (
    <div>
      <p>{message}</p>
      <h2>Set Birth Year</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={submit}>
          <div>
            <Select
              value={options.find((option) => option.value === name)}
              onChange={(option) => setName(option.value)}
              options={options}
            />
          </div>
          <div>
            <label htmlFor="born">Born</label>
            <input
              id="born"
              type="number"
              value={born}
              onChange={(event) => setBorn(event.target.value)}
            />
          </div>
          <button type="submit">Update Author</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {queryError && <p style={{ color: "red" }}>{queryError.message}</p>}
        </form>
      )}
    </div>
  );
};

export default SetBornAuthor;
