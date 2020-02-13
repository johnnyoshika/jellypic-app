import React, { useState } from 'react';

const AddComment = ({ postId }) => {
  const [comment, setComment] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    setComment('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        className="card-info-add-comment-input"
        type="text"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
    </form>
  );
};

export default AddComment;
