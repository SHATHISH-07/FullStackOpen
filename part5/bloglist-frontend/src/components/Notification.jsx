import React, { useEffect } from "react";

const Notification = ({ message, type, clearNotification }) => {
  if (!message) {
    return null;
  }

  const notificationClass = type === "error" ? "error" : "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      clearNotification();
    }, 5000);

    // Cleanup timeout when the component unmounts or message changes
    return () => clearTimeout(timer);
  }, [clearNotification]);

  return <div className={notificationClass}>{message}</div>;
};

export default Notification;
