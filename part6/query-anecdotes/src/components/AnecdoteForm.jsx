import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAnecdote } from "../service/anecdote";
import { useState } from "react";
import { useNotification } from "../components/NotificationContext";

const AnecdoteForm = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

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
    <form onSubmit={handleSubmit}>
      <h2>Create new</h2>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" disabled={mutation.isLoading}>
        Add
      </button>
    </form>
  );
};

export default AnecdoteForm;
