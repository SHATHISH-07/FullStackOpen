import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/anecdoteReducer";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    event.preventDefault();
    dispatch(setFilter(event.target.value.trim()));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
