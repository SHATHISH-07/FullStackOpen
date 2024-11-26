import { useSelector, useDispatch } from "react-redux";
import {
  setNotification,
  clearNotification,
} from "../reducers/anecdoteReducer";
import { voteAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  // console.log(anecdotes);

  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdote(id));
    const votedAnecdote = anecdotes.find((a) => a.id === id);

    if (votedAnecdote) {
      const message = `You voted anecdote "${votedAnecdote.content}"`;
      const timeout = 5000; // Timeout in milliseconds

      dispatch(setNotification(message));

      setTimeout(() => {
        dispatch(clearNotification());
      }, timeout);
    }
  };

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes
  );
  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
