import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Placeholder for the contract ABI and address
const contractABI = require('./contracts/USATRin.json').abi;
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [rin, setRin] = useState('');
  const [metadata, setMetadata] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setWeb3(web3Instance);
          setAccounts(accounts);
          setContract(contractInstance);
        } catch (error) {
          alert('Failed to load web3, accounts, or contract. Check console for details.');
          console.error(error);
        }
      } else {
        alert('Please install MetaMask to use this DApp.');
      }
    };

    initWeb3();
  }, []);

  const handleRegisterRIN = async (e) => {
    e.preventDefault();
    if (contract) {
      setStatus('Registering RIN...');
      try {
        await contract.methods.registerRIN(rin, metadata).send({ from: accounts[0] });
        setStatus('RIN registered successfully.');
      } catch (error) {
        console.error('Error registering RIN:', error);
        setStatus('Failed to register RIN.');
      }
    }
  };

  return (
    <div className="App">
      <h1>USATRin Contract Management</h1>
      <form onSubmit={handleRegisterRIN}>
        <input
          type="text"
          placeholder="RIN Number"
          value={rin}
          onChange={(e) => setRin(e.target.value)}
          required
        />
        <textarea
          placeholder="Metadata"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          required
        />
        <button type="submit">Register RIN</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default App;
