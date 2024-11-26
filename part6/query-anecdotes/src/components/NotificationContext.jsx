import React, { createContext, useContext, useReducer } from "react";
import { notificationReducer } from "../reducer/notificationReducer";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
