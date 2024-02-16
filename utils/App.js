import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Assuming .env file contains REACT_APP_CONTRACT_ADDRESS
const contractABI = require('./contracts/USATRin.json').abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

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
        const web3Instance = new Web3(window.ethereum);
        try {
          const accounts = await web3Instance.eth.requestAccounts(); // Updated method call
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setWeb3(web3Instance);
          setAccounts(accounts);
          setContract(contractInstance);
        } catch (error) {
          setStatus('Failed to load web3, accounts, or contract.');
          console.error(error);
        }
      } else {
        setStatus('Please install MetaMask to use this DApp.');
      }
    };

    initWeb3();

    // Cleanup function to reset state on unmount
    return () => {
      setWeb3(null);
      setAccounts([]);
      setContract(null);
    };
  }, []);

  const handleRegisterRIN = async (e) => {
    e.preventDefault();
    if (!rin || !metadata) {
      setStatus('Please fill in all the fields.');
      return;
    }

    setStatus('Registering RIN...');
    try {
      await contract.methods.registerRIN(rin, metadata).send({ from: accounts[0] });
      setStatus('RIN registered successfully.');
      setRin('');
      setMetadata('');
    } catch (error) {
      setStatus('Failed to register RIN. Check console for details.');
      console.error('Error registering RIN:', error);
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
      <p>{status}</p>
    </div>
  );
};

export default App;
