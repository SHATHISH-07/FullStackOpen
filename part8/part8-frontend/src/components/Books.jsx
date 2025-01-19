import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL Queries and Mutations
const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
        born
      }
      genres
    }
  }
`;

// Books Component
const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });

  if (!show) return null;

  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;

  const books = data.allBooks;
  const genres = [...new Set(books.flatMap((book) => book.genres))];

  return (
    <div>
      <h2>books</h2>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
