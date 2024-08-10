import React, { useState } from 'react';
import './style.css'

const AddTimeZone = ({ onAdd }) => {
  const [timeZone, setTimeZone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeZone) {
      onAdd(timeZone);
      setTimeZone('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-timezone-form">
      <input
        type="text"
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        placeholder="Enter time zone"
        className='enterTime'
      />
      <button type="submit">Add Time Zone</button>
    </form>
  );
};

export default AddTimeZone;
