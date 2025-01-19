import { useQuery, gql } from "@apollo/client";

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

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

const Recommend = ({ show }) => {
  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  console.log(favoriteGenre); // Check if favoriteGenre is correctly fetched

  const { data, loading, error } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (!show) return null;

  if (userLoading || loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;

  if (!data || !data.allBooks) return <div>No books available</div>;

  const books = data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
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

export default Recommend;
