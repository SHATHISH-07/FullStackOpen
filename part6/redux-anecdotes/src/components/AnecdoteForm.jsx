import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/anecdoteReducer";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    dispatch(createAnecdote(anecdote));
    dispatch(setNotification(`Created new anecdote: "${anecdote}"`));
    event.target.anecdote.value = "";
    setTimeout(() => {
      dispatch(setNotification(""));
    }, 5000);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
