import React from 'react';
import "../Toasts/Toast.css";

const TimeDisplay = ({time, desc}) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div id="desc">
      <span>Faltam </span>
      <span style={{paddingLeft: "10px"}}>{hours < 10 ? `0${hours}` : hours}:</span>
      <span>{minutes < 10 ? `0${minutes}` : minutes}:</span>
      <span style={{paddingRight: "10px"}}>{seconds < 10 ? `0${seconds}` : seconds}</span>
      <span>{`${desc}`}</span>
    </div>
  );
}

export default TimeDisplay;