import Web3 from 'web3';

// Dynamically import contract JSON based on contract name
const importContract = async (contractName) => {
  if (!contractName) throw new Error("Contract name must be provided.");
  try {
    return await import(`../contracts/${contractName}.json`);
  } catch (error) {
    throw new Error(`Failed to import contract: ${contractName}. Check if the contract ABI file exists.`);
  }
};

const getContract = async (web3, contractName, defaultAddress = "") => {
  if (!web3) throw new Error("Web3 instance is not initialized.");

  const ContractData = await importContract(contractName);

  if (ContractData) {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ContractData.networks[networkId];

    // Use the provided default address if no deployed address is found for the current network
    const contractAddress = deployedNetwork?.address || defaultAddress;
    if (!contractAddress) throw new Error(`No deployed address found for contract: ${contractName} on network: ${networkId}.`);

    const contract = new web3.eth.Contract(ContractData.abi, contractAddress);
    return contract;
  } else {
    throw new Error(`Contract data for ${contractName} could not be loaded.`);
  }
};

export default getContract;
