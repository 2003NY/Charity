import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/etherCharity';
import './App.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [contractBalance, setContractBalance] = useState("0");
  const [amount, setAmount] = useState("");

  // Connect wallet to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(account);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Get contract instance with signer
  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  // Deposit function to send Ether
  const deposit = async () => {
    if (!amount || isNaN(amount)) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait();
      alert("✅ Deposit successful!");

      setAmount("");
      fetchContractBalance(); // update balance after deposit
    } catch (err) {
      console.error(err);
      alert("❌ Deposit failed.");
    }
  };

  // Fetch balance of the contract
  const fetchContractBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const balance = await contract.getContractBalance();
      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch contract balance");
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchContractBalance();
    }
  }, [wallet]);

  return (
    <div style={{ padding: 30 }}>
      <h1>🌍 Ether Charity Fund</h1>
      <button onClick={connectWallet}>
        {wallet ? "Wallet Connected" : "Connect Wallet"}
      </button>
      <p><strong>Connected Wallet:</strong> {wallet || "Not Connected"}</p>

      <hr />

      <h2>Contract Balance</h2>
      <button onClick={fetchContractBalance}>Refresh Balance</button>
      <p>{contractBalance} ETH</p>

      <hr />

      <h2>Make a Donation 💝</h2>
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Donate</button>
    </div>
  );
}

export default App;
