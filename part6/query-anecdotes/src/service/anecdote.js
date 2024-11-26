import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes"; // Ensure correct base URL

export const getAnecdotes = async () => {
  const response = await axios.get(baseUrl);
  return response.data; // Return the list of anecdotes
};

export const addAnecdote = async (anecdote) => {
  if (anecdote.content.length < 5) {
    throw new Error("Anecdote content must be at least 5 characters long.");
  }
  const response = await axios.post(baseUrl, anecdote);
  return response.data; // Return the newly created anecdote
};

export const updateAnecdote = async (updatedAnecdote) => {
  const response = await axios.put(
    `${baseUrl}/${updatedAnecdote.id}`,
    updatedAnecdote
  );
  return response.data; // Return the updated anecdote
};
