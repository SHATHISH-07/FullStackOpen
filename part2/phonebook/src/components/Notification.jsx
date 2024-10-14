import React from "react";

const Notification = ({ message, type }) => {
  if (message === null) return null;

  const notificationStyle = {
    color: type === "success" ? "green" : "red",
    background: "lightgray",
    fontSize: "20px",
    border: `2px solid ${type === "success" ? "green" : "red"}`,
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "20px",
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
