import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $password: String!
    $favoriteGenre: String!
  ) {
    createUser(
      username: $username
      password: $password
      favoriteGenre: $favoriteGenre
    ) {
      username
    }
  }
`;

const SignUpForm = ({ show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [message, setMessage] = useState("");

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onError: (error) => {
      setMessage(error?.graphQLErrors?.[0]?.message || "");
    },
    onCompleted: () => {
      setMessage("Sign up successful!");
      setTimeout(() => setMessage(""), 5000);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    if (loading) return;

    try {
      await createUser({ variables: { username, password, favoriteGenre } });
      setUsername("");
      setPassword("");
      setFavoriteGenre("");
    } catch (e) {
      console.error(e);
    } finally {
      setMessage("");
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={submit}>
        <h3>Sign up</h3>
        <div>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="username"
          />
        </div>
        <div>
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <input
            value={favoriteGenre}
            onChange={({ target }) => setFavoriteGenre(target.value)}
            placeholder="favorite genre"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "loading..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
