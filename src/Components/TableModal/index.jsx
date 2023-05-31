import React from 'react';
import "./TableModal.css";
import CloseButton from 'react-bootstrap/CloseButton'

const TableModal = ({ show, characters, onClose }) => {

  if (!show) return null;

  return (
    <div className="table-overlay" onClick={() => onClose()}>
      <div className="table-modal" onClick={e => e.stopPropagation()}>
        <CloseButton className="btn-close-white" style={{ width: "100%", opacity: 1 }} onClick={() => onClose()} />
        <table className="player-table">
          <thead>
            <tr>
              <th>Endereço do Portador</th>
              <th>Token ID</th>
              <th>Dano causado</th>
              <th>Ícone do Personagem</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character, index) => (
              <tr key={character.holderAddress} className="player-row">
                <td>{character.holderAddress}</td>
                <td>{character.tokenId}</td>
                <td>{character.damageDealt}</td>
                <td>
                  <img style={{ height: "50px", width: "50px" }} src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableModal;