import React from "react";

//Filter Component
const Filter = ({ handleFilter }) => {
  return (
    <div>
      filter shown with <input onChange={handleFilter} />
    </div>
  );
};

export default Filter;
