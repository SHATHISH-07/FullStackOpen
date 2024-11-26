export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_NOTIFICATION":
      return action.payload; // Set the notification message
    case "CLEAR_NOTIFICATION":
      return ""; // Clear the notification
    default:
      return state;
  }
};
