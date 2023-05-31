
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";

import pokeball from "./assets/pokeball.svg";

import 'bootstrap/dist/css/bootstrap.min.css';

// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  // Estado
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
   * Logo abaixo da conta, configure essa propriedade de novo estado.
  */
  const [characterNFT, setCharacterNFT] = useState(null);
  /*
   * Nova propriedade de estado adicionado aqui
   */
  const [isLoading, setIsLoading] = useState(false);
  /*  
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Parece que você não tem a metamask instalada!");
        /*
         * Nós configuramos o isLoading aqui porque usamos o return na proxima linha
         */
        setIsLoading(false);
        return;
      } else {
        console.log("Objeto ethereum encontrado:", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada:", account);
          setCurrentAccount(account);
        } else {
          console.log("Não foi encontrada uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * Nós lançamos a propriedade de estado depois de toda lógica da função
     */
    setIsLoading(false);
  };

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "80001") {
        alert("Please connect to Mumbai!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {

    /*
     * Se esse app estiver carregando, renderize o indicador de carregamento
     */
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://media.tenor.com/15Iw9jpwKDIAAAAC/mewtwo-pokemon.gif"
            alt="Mewtwo Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      /*
      * Se tiver uma carteira conectada e um personagem NFT, é hora de batalhar!
      */
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  };
  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffects
  useEffect(() => {
    /*
     * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
     */
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);
  useEffect(() => {
    checkNetwork();
  }, []);
  /*
  * Adicione esse useEffect logo embaixo do outro useEffect que você está chamando checkIfWalletIsConnected
  */
  // UseEffects
  useEffect(() => {
    /*
     * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
     */
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log("Usuário tem um personagem NFT")
        setCharacterNFT(transformCharacterData(characterNFT))
      } else {
        console.log("Nenhum personagem NFT foi encontrado")
      }

      /*
       * Uma vez que tivermos acabado a busca, configure o estado de carregamento para falso.
       */
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log("Conta Atual:", currentAccount)
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            <img alt="Pokeball" className="pokeball" src={pokeball} />
            <span>Duelo Pokémon</span>
            <img alt="Pokeball" className="pokeball" src={pokeball} />
          </p>
          <p className="sub-text">Junte os amigos e derrote o Pokémon Lendário!!</p>
          {/*
           * Aqui é onde nosso botão e código de imagem ficava! Lembre-se que movemos para o método de renderização.
           */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;