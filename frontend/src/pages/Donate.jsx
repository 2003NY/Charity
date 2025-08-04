import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { Wallet, Heart, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../contracts/etherCharity';
import axios from 'axios';

function Donate() {
  const [wallet, setWallet] = useState(null);
  const [contractBalance, setContractBalance] = useState("0");
  const [totalAmount, setTotalAmount] = useState("0");
  const [threshold, setThreshold] = useState("0.1");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(account);
        setMessage({ type: 'success', text: 'Wallet connected successfully!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to connect wallet' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage({ type: 'error', text: 'Please install MetaMask!' });
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const deposit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      
      const contract = await getContract();
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      
      setMessage({ type: 'success', text: 'Transaction submitted! Waiting for confirmation...' });
      
      await tx.wait();

      setMessage({ type: 'success', text: '✅ Donation successful! Thank you for your generosity!' });

      // Store in backend
      await axios.post("http://localhost:5000/api/donate", {
        donor: wallet,
        amount: amount,
        txHash: tx.hash,
      });

      setAmount("");
      await fetchContractData();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '❌ Donation failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContractData = async () => {
    try {
      setIsRefreshing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const [balance, total, thresholdValue] = await Promise.all([
        contract.getContractBalance(),
        contract.totalAmount(),
        contract.threshold()
      ]);
      
      setContractBalance(ethers.formatEther(balance));
      setTotalAmount(ethers.formatEther(total));
      setThreshold(ethers.formatEther(thresholdValue));
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to fetch contract data' });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchContractData();
    }
  }, [wallet]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const progressPercentage = Math.min((parseFloat(totalAmount) / parseFloat(threshold)) * 100, 100);

  return (
    <div className="page">
      <motion.div 
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Make a Difference Today</h1>
        <p>
          Join our mission to create positive change in the world. Every donation counts, 
          and together we can reach our goals faster.
        </p>
      </motion.div>

      {message && (
        <motion.div 
          className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {message.text}
        </motion.div>
      )}

      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-value">{parseFloat(contractBalance).toFixed(4)}</div>
          <div className="stat-label">Contract Balance (ETH)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parseFloat(totalAmount).toFixed(4)}</div>
          <div className="stat-label">Total Raised (ETH)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parseFloat(threshold).toFixed(1)}</div>
          <div className="stat-label">Threshold (ETH)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressPercentage.toFixed(1)}%</div>
          <div className="stat-label">Progress to Goal</div>
        </div>
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2><Target className="inline mr-2" size={24} />Funding Progress</h2>
        <div className="progress-container">
          <motion.div 
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage >= 100 
            ? "🎉 Goal reached! Funds will be transferred to charity." 
            : `${(parseFloat(threshold) - parseFloat(totalAmount)).toFixed(4)} ETH remaining to reach the goal`
          }
        </p>
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2><Wallet className="inline mr-2" size={24} />Wallet Connection</h2>
        
        <div className={`wallet-status ${wallet ? '' : 'disconnected'}`}>
          <div className={`wallet-indicator ${wallet ? '' : 'disconnected'}`}></div>
          <div>
            <div className="font-semibold">
              {wallet ? 'Wallet Connected' : 'Wallet Disconnected'}
            </div>
            <div className="text-sm opacity-75">
              {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Please connect your wallet to continue'}
            </div>
          </div>
        </div>

        <button 
          className={`btn ${wallet ? 'btn-secondary' : ''}`}
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Connecting...
            </>
          ) : wallet ? (
            'Wallet Connected'
          ) : (
            'Connect Wallet'
          )}
        </button>
      </motion.div>

      {wallet && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2><Heart className="inline mr-2" size={24} />Make Your Donation</h2>
          
          <div className="form-group">
            <label className="form-label">Donation Amount (ETH)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button 
              className="btn btn-large flex-1"
              onClick={deposit}
              disabled={isLoading || !amount}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="inline mr-2" size={20} />
                  Donate Now
                </>
              )}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={fetchContractData}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <RefreshCw size={20} />
              )}
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Your donation is securely stored in a smart contract. 
              When the total reaches {threshold} ETH, all funds are automatically transferred to the charity organization.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Donate;