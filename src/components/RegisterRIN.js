import React, { useState, useEffect } from 'react';
import getWeb3 from '../utils/getWeb3';
import getContract from '../utils/getContract';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config'; // Assuming these are defined

const RegisterRIN = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [rin, setRin] = useState('');
  const [metadata, setMetadata] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS); // Directly using imported ABI and address
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

  const validateInput = () => {
    if (!rin || !metadata) {
      alert('Please fill in all fields.');
      return false;
    }
    // Add more specific validation logic here if necessary
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsLoading(true);
    setStatusMessage('Registering RIN...');

    try {
      await contract.methods.registerRIN(rin, metadata).send({ from: accounts[0] });
      setStatusMessage('RIN registered successfully.');
      setRin('');
      setMetadata('');
    } catch (error) {
      setStatusMessage('Failed to register RIN. See console for details.');
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Submit'}</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default RegisterRIN;
