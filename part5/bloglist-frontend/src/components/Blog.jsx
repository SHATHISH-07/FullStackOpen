import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleVisibility = () => {
    setShowAll(!showAll);
  };

  const handleLikeClick = () => {
    handleLike(blog);
  };

  const handleRemoveBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleRemove(blog.id);
    }
  };

  return (
    <div className="blog-container">
      {showAll ? (
        <div className="blog-details">
          <h3>
            {blog.title} - {blog.author}
          </h3>
          <button className="toggle-button" onClick={toggleVisibility}>
            Hide
          </button>
          <div className="url">{blog.url}</div>
          <div className="likes">
            Likes: {blog.likes}{" "}
            <button className="like-button" onClick={handleLikeClick}>
              Like
            </button>
          </div>
          <div className="user">{blog.user.name}</div>
          <div>
            <button className="remove-button" onClick={handleRemoveBlog}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="blog-summary">
          <h3>
            {blog.title} - {blog.author}
          </h3>
          <button className="toggle-button" onClick={toggleVisibility}>
            View
          </button>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default Blog;
