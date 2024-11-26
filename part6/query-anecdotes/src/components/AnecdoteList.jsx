import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAnecdote, getAnecdotes } from "../service/anecdote";
import { useState } from "react";
import { useNotification } from "../components/NotificationContext";

const AnecdoteForm = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  // Fetch the list of anecdotes
  const {
    data: anecdotes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });

  const mutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries(["anecdotes"]);
      dispatch({
        type: "SHOW_NOTIFICATION",
        payload: `Added anecdote: "${newAnecdote.content}"`,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_NOTIFICATION",
        payload: `Error: ${error.message || "Failed to add anecdote."}`,
      });
      setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ content }); // Ensure mutation receives object form
    setContent(""); // Clear form input
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {isLoading ? (
        <p>Loading anecdotes...</p>
      ) : isError ? (
        <p>Error loading anecdotes.</p>
      ) : (
        <ul>
          {anecdotes.map((anecdote) => (
            <li key={anecdote.id}>{anecdote.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnecdoteForm;
