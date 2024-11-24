import { useState } from "react";

const NewBlog = ({ createNewBlog, setShowNewBlogForm, showNewBlogForm }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: "",
  });

  const addNewBlog = (event) => {
    event.preventDefault();

    const blogToCreate = {
      ...newBlog,
      likes: newBlog.likes ? Number(newBlog.likes) : 0,
    };

    createNewBlog(blogToCreate);
    setNewBlog({
      title: "",
      author: "",
      url: "",
      likes: "",
    });
    setShowNewBlogForm(false);
  };

  const handleChange = (event) => {
    setNewBlog({
      ...newBlog,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      {showNewBlogForm ? (
        <form onSubmit={addNewBlog} className="new-blog-form">
          <h2>create new</h2>
          <div>
            <label htmlFor="title">title:</label>
            <input
              id="title"
              name="title"
              value={newBlog.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="author">author:</label>
            <input
              id="author"
              name="author"
              value={newBlog.author}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="url">url:</label>
            <input
              id="url"
              name="url"
              value={newBlog.url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="likes">likes:</label>
            <input
              id="likes"
              name="likes"
              value={newBlog.likes}
              onChange={handleChange}
            />
          </div>
          <button type="submit">create</button>
          <button onClick={() => setShowNewBlogForm(false)}>Cancel</button>
        </form>
      ) : (
        <button
          onClick={() => setShowNewBlogForm(true)}
          className="create-blog-button"
          id="create-new-blog"
        >
          create new blog
        </button>
      )}
    </>
  );
};

export default NewBlog;
