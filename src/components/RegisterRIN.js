// src/components/RegisterRIN.js
import React, { useState, useEffect } from 'react';
import getWeb3 from '../utils/getWeb3';
import getContract from '../utils/getContract';

const RegisterRIN = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [rin, setRin] = useState('');
  const [metadata, setMetadata] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    };

    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rin || !metadata) {
      alert('Please fill in all fields.');
      return;
    }

    setStatusMessage('Registering RIN...');
    try {
      await contract.methods.registerRIN(rin, metadata).send({ from: accounts[0] });
      setStatusMessage('RIN registered successfully.');
      setRin('');
      setMetadata('');
    } catch (error) {
      setStatusMessage('Failed to register RIN. See console for details.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register a RIN</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>RIN Number:</label>
          <input
            type="text"
            value={rin}
            onChange={(e) => setRin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Metadata:</label>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default RegisterRIN;
