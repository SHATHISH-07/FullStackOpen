import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnecdotes } from "./service/anecdote"; // Ensure correct path
import { NotificationProvider } from "./components/NotificationContext"; // Correct path to context
import AnecdoteForm from "./components/AnecdoteForm"; // Form for adding anecdotes
import AnecdoteList from "./components/AnecdoteList"; // List to display anecdotes
import Notification from "./components/Notification"; // Notification component

const App = () => {
  // Fetching anecdotes using React Query
  const {
    data: anecdotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["anecdotes"], // queryKey as an array
    queryFn: getAnecdotes, // function to fetch data
  });

  if (isLoading) return <div>Loading...</div>; // Show loading state while fetching data
  if (isError) return <div>Error: {error.message}</div>; // Show error if fetching fails

  return (
    <NotificationProvider>
      <Notification />
      <AnecdoteForm />
      {/* Pass the fetched anecdotes data to AnecdoteList */}
      <AnecdoteList anecdotes={anecdotes} />
    </NotificationProvider>
  );
};

export default App;
