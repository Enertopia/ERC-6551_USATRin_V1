// src/utils/getContract.js
import Web3 from 'web3';
import USATRinContract from '../contracts/USATRin.json'; // Path to your contract's ABI

const getContract = async (web3) => {
  // Ensure web3 and the contract ABI are loaded
  if (web3 && USATRinContract) {
    const networkId = await web3.eth.net.getId(); // Get the current network ID
    const deployedNetwork = USATRinContract.networks[networkId]; // Get the contract deployment on the current network
    const contract = new web3.eth.Contract(
      USATRinContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    return contract;
  } else {
    throw new Error('Web3 or contract ABI not initialized.');
  }
};

export default getContract;
