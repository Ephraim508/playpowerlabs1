import React from 'react';
import moment from 'moment-timezone';
import './style.css'

const TimeZoneDisplay = ({ timeZone, currentTime, onDelete }) => {
  const timeInZone = moment(currentTime).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');

  return (
    <div className="timezone-display">
      <span>{timeZone}: {timeInZone}</span>
      <button onClick={onDelete}>Remove</button>
    </div>
  );
};

export default TimeZoneDisplay;
