import React from 'react';
import "./Toast.css"

const DamageToast = ({show, damage, boss, characterDamage}) => {
  return (
    <div id="toast" className={show ? "show" : ""}>
      {damage==2*characterDamage ? (
        <div id="desc">
          {`💥 ${boss.name} tomou ${damage} de dano! Dano CRÍTICO!`}
        </div>     
      ):(
        <div id="desc">
          {`💥 ${boss.name} tomou ${damage} de dano!`}
        </div>        
      )}
    </div>
  )
}

export default DamageToast;