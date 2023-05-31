const CONTRACT_ADDRESS = "0xE0CF1ddFc3b939CC809dacB06a88c95118164932";

/*
 * Adicione esse método e tenha certeza de exportá-lo no final!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    mainColor: characterData.mainColor,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    lastSpecialAbilityUse: 0
  };
};

const transformPlayerData = (playerData) => {
  return {
    holderAddress: playerData.holderAddress,
    imageURI: playerData.imageURI,
    tokenId: playerData.tokenId.toNumber(),
    damageDealt: playerData.damageDealt.toNumber(),
  };
}

const specialAbilityInfo = {
  "Charizard": "Charizard ataca causando seu dano de ataque e QUEIMA o inimigo, fazendo com que os ataques de todos os pokémons causem dano dobrado por uma hora.",
  "Blastoise": "Blastoise ataca causando seu dano de ataque e CONGELA o inimigo, fazendo com que ele sofra metade do dano durante 5 minutos, mas também com que seus ataques tenham 90% de chance de não causar dano nos pokémons aliados.",
  "Venusaur": "Venusaur cria uma rede de plantas curativas fazendo com que todos os pokémons aliados sofram apenas 50% do dano recebido por uma hora."
};

export { CONTRACT_ADDRESS, transformCharacterData, transformPlayerData, specialAbilityInfo };