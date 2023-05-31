import React from 'react';
import "./Toast.css"
import TimeDisplay from "../TimeDisplay";

const HealingToast = ({status, seconds, characterName}) => {
  if (status==="success") {
    return (
      <div id="toast" className={"show"}>
        <div id="desc">
          {`Seu ${characterName} foi curado!`}
        </div>   
      </div>
    )    
  } else if (status==="failed") {
    return (
      <div id="toast" className={"show"}>
        <TimeDisplay time={seconds} desc={"para seu personagem ser curado"}/>
      </div>
    )
  }
}

export default HealingToast;