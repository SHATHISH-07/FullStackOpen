import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogView.css';

const BlogView = ({ blogs, handleLike, handleRemove, handleAddComment }) => {
  const { id } = useParams(); // Get the blog ID from the URL
  const blog = blogs.find((b) => b.id === id); // Find the blog that matches the ID

  if (!blog) {
    return <div>Blog not found</div>; // Display this if no matching blog is found
  }

  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      handleAddComment(blog.id, comment);
      setComment('');
    }
  };

  return (
    <div className="blog-details">
      <h3>
        {blog.title} - {blog.author}
      </h3>
      <div className="url">{blog.url}</div>
      <div className="likes">
        Likes: {blog.likes}
        <button onClick={() => handleLike(blog)}>Like</button>
      </div>
      <div className="user">{blog.author}</div>
      <button onClick={() => handleRemove(blog.id)} className="remove">
        Remove
      </button>

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
  );
};

export default BlogView;
