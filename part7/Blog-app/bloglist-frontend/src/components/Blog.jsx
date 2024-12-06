import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, handleLike, handleRemove, handleAddComment }) => {
  const [showAll, setShowAll] = useState(false);
  const [comment, setComment] = useState('');

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

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      handleAddComment(blog.id, comment); // Passing the blog id and the new comment to the parent
      setComment(''); // Clear the input field after submitting
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
            Likes: {blog.likes}{' '}
            <button className="like-button" onClick={handleLikeClick}>
              Like
            </button>
          </div>
          <div className="user">{blog.author}</div>
          <div>
            <button className="remove-button" onClick={handleRemoveBlog}>
              Remove
            </button>
          </div>

          {/* Comment Section */}
          <div className="comment-form">
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
              />
              <button type="submit">Add Comment</button>
            </form>
          </div>

          <div className="comment-list">
            <h4>Comments</h4>
            <ul>
              {blog.comments &&
                blog.comments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
            </ul>
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
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    comments: PropTypes.arrayOf(PropTypes.string), // New prop for comments
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired, // Prop for adding comments
};

export default Blog;
