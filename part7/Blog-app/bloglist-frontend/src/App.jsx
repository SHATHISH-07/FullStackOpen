import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import BlogView from './components/BlogView';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Users from './components/Users';
import userService from './services/users';
import loginService from './services/login';
import SignupForm from './components/SignupForm';
import Notification from './components/Notification';
import NewBlog from './components/NewBlog';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log('Logged in user:', user);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
    }
  }, [user]);

  useEffect(() => {
    userService.getAll().then((initialUsers) => {
      console.log('Users fetched:', initialUsers); // Debug here
      setUsers(initialUsers);
    });
  }, []); // Add an empty dependency array to prevent infinite fetch

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
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      console.log('User logged in:', user);
      setNotification('Login successful', 'success');
    } catch (exception) {
      setNotification('Invalid username or password', 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    blogService.setToken(null);
    setNotification('Logged out', 'success');
  };

  const handleSignup = async ({ username, password, name }) => {
    try {
      const user = await userService.create({ username, password, name });

      console.log('User created:', user);

      // Now log the user in using the created credentials
      const loggedInUser = await loginService.login({ username, password });

      // Store the logged-in user and token
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(loggedInUser)
      );
      blogService.setToken(loggedInUser.token);

      // Set user state
      setUser(loggedInUser);

      // Notify success
      setNotification('Signup and login successful', 'success');

      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Error during signup or login:', error); // Log error
      setNotification('Error signing up', 'error');
    }
  };

  const addNewBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      console.log('Returned blog from backend:', returnedBlog);
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
      setNotification(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      );
      setShowNewBlogForm(false);
    } catch (error) {
      setNotification('Error creating blog', 'error');
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
      setNotification(`Liked blog ${blog.title}`, 'success');
    } catch (error) {
      setNotification('Error liking blog', 'error');
    }
  };

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      setNotification('Blog removed', 'success');
    } catch (error) {
      setNotification('Error removing blog', 'error');
    }
  };

  const handleAddComment = async (blogId, comment) => {
    try {
      await blogService.addComment(blogId, comment); // This will hit the new API endpoint
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b.id === blogId ? { ...b, comments: [...b.comments, comment] } : b
        )
      );
      setNotification('Comment added', 'success');
    } catch (error) {
      setNotification('Error adding comment', 'error');
    }
  };

  return (
    <>
      {!user && (
        <Routes>
          <Route
            path="/"
            element={
              <LoginForm
                handleLogin={handleLogin}
                notificationMessage={notificationMessage}
                notificationType={notificationType}
              />
            }
          />

          <Route
            path="/signup"
            element={
              <SignupForm
                handleSignup={handleSignup}
                notificationMessage={notificationMessage}
                notificationType={notificationType}
              />
            }
          />
        </Routes>
      )}
      {user && (
        <div>
          <h3 className="userLogesInfo">
            <Navigation />
            {user.username ? user.username : 'No user name available'} logged in
            <button onClick={handleLogout} id="logout">
              logout
            </button>
          </h3>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>All Blogs</h1>

                  <ul>
                    {blogs.map((blog) => (
                      <li key={blog.id}>
                        <h2>
                          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </h2>
                      </li>
                    ))}
                  </ul>
                  {notificationMessage && (
                    <Notification
                      message={notificationMessage}
                      type={notificationType}
                      clearNotification={() => setNotificationMessage(null)}
                    />
                  )}
                </>
              }
            />

            <Route
              path="/blogs/:id"
              element={
                <BlogView
                  blogs={blogs}
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                  handleAddComment={handleAddComment}
                />
              }
            />

            <Route
              path="/blogs"
              element={
                <>
                  <h1>My Blogs</h1>
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
                          handleAddComment={handleAddComment}
                        />
                      ))}
                  </ul>
                </>
              }
            />
            <Route
              path="/users"
              element={
                <div>
                  <Users users={users} />
                </div>
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
