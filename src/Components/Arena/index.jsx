import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData, transformPlayerData, specialAbilityInfo } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator"
import TableModal from "../TableModal"
import DamageToast from "../Toasts/DamageToast.jsx";
import HealingToast from "../Toasts/HealingToast.jsx";
import SpecialAbilityToast from "../Toasts/SpecialAbilityToast.jsx";
import infoIcon from "../../assets/info.svg";

/*
 * Passamos os metadados do nosso personagem NFT para que podemos ter um card legal na nossa UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // estado
  const [gameContract, setGameContract] = useState(null);
  const [playerCharacters, setPlayerCharacters] = useState([]);
  const [boss, setBoss] = useState(null);

  const [tableModalOpen, setTableModalOpen] = useState(false);

  const [needsHealing, setNeedsHealing] = useState(false);
  const [healingStatus, setHealingStatus] = useState("");
  const [healingSecondsLeft, setHealingSecondsLeft] = useState(0);

  const [showDamageToast, setShowDamageToast] = useState(false);
  const [toastDamage, setToastDamage] = useState(0);

  const [abilityState, setAbilityState] = useState("");
  const [specialAbilityStatus, setSpecialAbilityStatus] = useState("");
  const [specialAbilitySecondsLeft, setSpecialAbilitySecondsLeft] = useState(0);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAbilityState('attacking');
        console.log('Atacando o Boss...');
        console.log(boss);
        const txn = await gameContract.attackBoss();
        await txn.wait();
        console.log(txn);
        setAbilityState('hit');
      }
    } catch (error) {
      console.error('Erro ao atacar o boss:', error);
      setAbilityState('');
    }
  };

  const useSpecialAbility = async () => {
    try {
      if (gameContract) {

        const specialAbiliyTxn = await gameContract.getTimeSinceSpecialAbilityUse();

        let timeSinceAbility = specialAbiliyTxn.toNumber();

        if (characterNFT.hp == 0) {
          setSpecialAbilityStatus("failedByHP")
        }

        else if (timeSinceAbility < 3600) {
          setSpecialAbilitySecondsLeft(3600 - timeSinceAbility);
          setSpecialAbilityStatus("failedByTime");
        }

        else {
          setAbilityState('special');
          console.log('Usando habilidade especial...');
          console.log(boss);
          const txn = await gameContract.useSpecialAbility();
          await txn.wait();
          console.log(txn);
          setAbilityState('hit');
          setSpecialAbilityStatus("success");
        }
      }
      setTimeout(() => {
        setSpecialAbilityStatus("");
      }, 5000);
    } catch (error) {
      console.error('Erro ao usar habilidade especial:', error);
      setAbilityState('');
    }
  };

  const onModalClose = () => {
    setTableModalOpen(false);
  }

  const tryHealing = async () => {
    try {
      if (gameContract) {
        console.log('Curando o personagem...');
        const timePassedTxn = await gameContract.getTimeSinceDefeat();
        const timePassed = timePassedTxn.toNumber();
        if (timePassed < 28800) {
          setAbilityState('');
          setHealingSecondsLeft(28800 - timePassed);
          setHealingStatus("failed");
        } else {
          const txn = await gameContract.healCharacter();
          await txn.wait();
          console.log(txn);
          setAbilityState('');
          setHealingStatus("success");
        }

        setTimeout(() => {
          setHealingStatus("");
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao curar o personagem:', error);
    }
  };

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Objeto Ethereum não encontrado");
    }
  }, []);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /*
    * Configura a lógica quando esse evento for disparado
    */
    const onAttackComplete = (newBossHp, newPlayerHp, damageDealt) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      const damage = damageDealt.toNumber();

      console.log(boss);

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
      * Atualiza o hp do boss e do player
      */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });

      /*
        * Configura seu estado toast para true e depois Falso 5 segundos depois
        */
      setToastDamage(damage);
      setShowDamageToast(true);
      setTimeout(() => {
        setShowDamageToast(false);
      }, 5000);
    };

    const onSpecialAttackComplete = (newBossHp, damageDealt) => {
      const bossHp = newBossHp.toNumber();
      const damage = damageDealt.toNumber();

      console.log(`SpecialAttackComplete: Boss Hp: ${bossHp}`);

      /*
      * Atualiza o hp do boss e do player
      */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      /*
        * Configura seu estado toast para true e depois Falso 5 segundos depois
        */
      setToastDamage(damage);
      setShowDamageToast(true);
      setTimeout(() => {
        setShowDamageToast(false);
      }, 5000);
    };

    const getPlayerCharacters = async () => {
      try {
        console.log("Trazendo todos os jogadores registrados no contrato");

        const playerCharactersTxn = await gameContract.getAllPlayers();
        console.log("playerCharactersTxn:", playerCharactersTxn);

        const playerCharacters = playerCharactersTxn.map((playerData) =>
          transformPlayerData(playerData)
        );

        setPlayerCharacters(playerCharacters);
      } catch (error) {
        console.error("Algo deu errado ao trazer jogadores:", error);
      }
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
      gameContract.on('SpecialAttackComplete', onSpecialAttackComplete);
      getPlayerCharacters();
    }

    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
        gameContract.off('SpecialAttackComplete', onSpecialAttackComplete);
      }
    }
  }, [gameContract]);

  useEffect(() => {
    if (characterNFT.hp == 0) {
      setNeedsHealing(true);
    } else {
      setNeedsHealing(false);
    }
  }, [characterNFT.hp])

  return (

    <div className="arena-container">
      {/* Add your toast HTML right here */}
      {boss && characterNFT && (
        <DamageToast show={showDamageToast} damage={toastDamage} boss={boss} characterDamage={characterNFT.damage} />
      )}
      {boss && characterNFT && (
        <HealingToast status={healingStatus} seconds={healingSecondsLeft} characterName={characterNFT.name} />
      )}
      {boss && characterNFT && (
        <SpecialAbilityToast status={specialAbilityStatus} seconds={specialAbilitySecondsLeft} characterName={characterNFT.name} />
      )}
      {/* Personagem NFT */}
      {
        characterNFT && (
          <div className="player-container">
            <div className="player" style={{ backgroundColor: `${characterNFT.mainColor}` }}>
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                  alt={`Personagem ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4 style={{ marginBottom: 0 }}>{`⚔️ Dano de Ataque: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        )
      }
      {
        boss && (
          <div className="player-options">
            <div className="attack-container">
              {needsHealing ? (
                <button className="cta-button" onClick={tryHealing}>
                  {`❤️ Cure meu ${characterNFT.name}`}
                </button>
              ) : (
                <button className="cta-button" onClick={runAttackAction}>
                  {`💥 Atacar ${boss.name}`}
                </button>
              )}
            </div>
            {abilityState === "attacking" && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Atacando ⚔️</p>
              </div>
            )}
            {abilityState === "healing" && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Curando... ❤️</p>
              </div>
            )}
            <div className="attack-container">
              <button className="cta-button special-button" onClick={useSpecialAbility}>
                <span>Usar habilidade especial</span>
                <img className="special-info" src={infoIcon} />
                <span className="ability-info">
                  {`${specialAbilityInfo[characterNFT.name]}`}
                </span>
              </button>
            </div>
            {abilityState === "special" && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Ativando Habilidade ⚔️</p>
              </div>
            )}
            <button className="cta-button" onClick={() => setTableModalOpen(true)}>
              Ver os treinadores
            </button>
          </div>
        )
      }
      {/* Boss */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content  ${abilityState}`} style={{ backgroundColor: `${boss.mainColor}` }}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <TableModal show={tableModalOpen} characters={playerCharacters} onClose={onModalClose} />
    </div >
  );
};

export default Arena;