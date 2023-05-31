import React from 'react';
import "./Toast.css"
import TimeDisplay from "../TimeDisplay";

const SpecialAbilityToast = ({ status, seconds, characterName }) => {

  if (status === "success") {
    return (
      <div id="toast" className={"show"}>
        <div id="desc">
          {`Seu ${characterName} usou a habilidade especial!`}
        </div>
      </div>
    )
  } else if (status === "failedByTime") {
    return (
      <div id="toast" className={"show"}>
        <TimeDisplay time={seconds} desc={"para você poder usar sua habilidade especial!"} />
      </div>
    )
  } else if (status === "failedByHP") {
    return (
      <div id="toast" className={"show"}>
        <div id="desc">
          {`Você não pode usar a habilidade especial sem HP.`}
        </div>
      </div>
    )
  }
}

export default SpecialAbilityToast;