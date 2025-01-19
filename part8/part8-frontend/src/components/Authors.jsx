import { gql, useQuery } from "@apollo/client";
import SetBornAuthor from "./SetBornAuthor";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const Authors = (props) => {
  const { data, loading, error } = useQuery(ALL_AUTHORS);

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p>error: {error.message}</p>;
  }

  const authors = data.allAuthors;

  if (!props.show) {
    return null;
  }

  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SetBornAuthor />
    </>
  );
};

export default Authors;
