import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const LoginForm = ({ setToken, show, token, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [login, { data, error }] = useMutation(LOGIN, {
    onCompleted: () => {
      setMessage("Login successful!");
      setTimeout(() => setMessage(""), 5000);
    },
  });

  useEffect(() => {
    if (data?.login?.value) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
    }
  }, [data, setToken, setPage]);

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });

    setUsername("");
    setPassword("");
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <h3>Login Form</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setPage("signup")}>Sign Up</button>
    </div>
  );
};

export default LoginForm;
