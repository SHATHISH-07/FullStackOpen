import React from "react";
import { useNotification } from "../components/NotificationContext";

const Notification = () => {
  const { notification } = useNotification() || {}; // Prevent destructuring from undefined

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: notification ? "block" : "none", // Show only if there's a message
  };

  return <div style={style}>{notification}</div>;
};

export default Notification;
