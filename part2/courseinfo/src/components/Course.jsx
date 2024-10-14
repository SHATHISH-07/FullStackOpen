import React from "react";

const Header = ({ course }) => {
  return <h2>{course.name}</h2>;
};

const Content = ({ course }) => {
  return course.parts.map((part) => {
    return (
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    );
  });
};

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);
  return (
    <b>
      <p>total of {total} exercises</p>
    </b>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
};

export default Course;
