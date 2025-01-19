import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Recommend from "./components/Recommend";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("user-token")); // Persist login state

  const logout = () => {
    setToken(null);
    localStorage.removeItem("user-token");
    setPage("authors");
  };

  const navButtons = () => (
    <div>
      <button onClick={() => setPage("authors")}>Authors</button>
      <button onClick={() => setPage("books")}>Books</button>
      {token ? (
        <>
          <button onClick={() => setPage("recommend")}>Recommendations</button>
          <button onClick={() => setPage("add")}>Add Book</button>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => setPage("login")}>Login</button>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div>{navButtons()}</div>

      {/* Page Components */}
      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      {token && <NewBook show={page === "add"} setPage={setPage} />}
      {token && <Recommend show={page === "recommend"} />}
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
      <SignUpForm show={page === "signup"} />
    </div>
  );
};

export default App;
