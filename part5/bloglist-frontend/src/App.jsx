import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NewBlog from "./components/NewBlog";
import LoginForm from "./components/LoginForm";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);

  // console.log(blogs);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
    }
  }, [user]);

  const setNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
      setNotificationType(null);
    }, 5000);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setNotification("Login successful", "success");
    } catch (exception) {
      setNotification("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    setNotification("Logged out", "success");
  };

  const addNewBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      console.log("Returned blog from backend:", returnedBlog);

      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);

      setNotification(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        "success"
      );
      setShowNewBlogForm(false);
    } catch (error) {
      setNotification("Error creating blog", "error");
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      await blogService.update(blog.id, updatedBlog);

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b.id === blog.id ? { ...b, likes: b.likes + 1 } : b
        )
      );

      setNotification(`Liked blog ${blog.title}`, "success");
    } catch (error) {
      setNotification("Error liking blog", "error");
    }
  };

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      setNotification("Blog removed", "success");
    } catch (error) {
      setNotification("Error removing blog", "error");
    }
  };

  return (
    <>
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          notificationMessage={notificationMessage}
          notificationType={notificationType}
        />
      )}
      {user && (
        <div>
          <h1>blogs</h1>
          {notificationMessage && (
            <Notification
              message={notificationMessage}
              type={notificationType}
            />
          )}
          <h3 className="userLogesInfo">
            {user.name} logged in{" "}
            <button onClick={handleLogout} id="logout">
              logout
            </button>
          </h3>

          <NewBlog
            createNewBlog={addNewBlog}
            setShowNewBlogForm={setShowNewBlogForm}
            showNewBlogForm={showNewBlogForm}
          />

          <ul>
            {blogs
              .filter((blog) => blog.user.id === user.id)
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                />
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default App;
