import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, ArrowDownLeft, Clock, Hash, User } from 'lucide-react';
import axios from 'axios';

function Logs() {
  const [logs, setLogs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/logs/all");
        setLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Failed to load transaction logs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    
    // Refresh logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalDonations = () => {
    if (!logs?.donations) return 0;
    return logs.donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
  };

  const getTotalTransfers = () => {
    if (!logs?.transfers) return 0;
    return logs.transfers.reduce((sum, transfer) => sum + parseFloat(transfer.totalTransferred), 0);
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
          Loading transaction logs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <motion.div 
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Transaction History</h1>
        <p>
          Track all donations and transfers in real-time. Complete transparency 
          for every transaction on the blockchain.
        </p>
      </motion.div>

      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-value">{logs?.donations?.length || 0}</div>
          <div className="stat-label">Total Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getTotalDonations().toFixed(4)}</div>
          <div className="stat-label">Total Donated (ETH)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{logs?.transfers?.length || 0}</div>
          <div className="stat-label">Charity Transfers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getTotalTransfers().toFixed(4)}</div>
          <div className="stat-label">Total Transferred (ETH)</div>
        </div>
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2><ArrowUpRight className="inline mr-2" size={24} />Recent Donations</h2>
        
        {logs?.donations?.length > 0 ? (
          <div className="space-y-3">
            {logs.donations.slice(0, 10).map((log, index) => (
              <motion.div 
                key={log.txHash}
                className="log-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {formatAddress(log.donor)}
                      </div>
                      <div className="log-meta flex items-center gap-2">
                        <Clock size={14} />
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="log-amount text-lg">
                      {parseFloat(log.amount).toFixed(4)} ETH
                    </div>
                    <div className="log-meta flex items-center gap-1">
                      <Hash size={12} />
                      {formatAddress(log.txHash)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>No donations recorded yet</p>
          </div>
        )}
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2><ArrowDownLeft className="inline mr-2" size={24} />Charity Transfers</h2>
        
        {logs?.transfers?.length > 0 ? (
          <div className="space-y-3">
            {logs.transfers.map((log, index) => (
              <motion.div 
                key={log.txHash}
                className="log-item transfer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowDownLeft size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        Transfer to Charity
                      </div>
                      <div className="log-meta flex items-center gap-2">
                        <Clock size={14} />
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="log-amount text-lg text-green-600">
                      {parseFloat(log.totalTransferred).toFixed(4)} ETH
                    </div>
                    <div className="log-meta flex items-center gap-1">
                      <Hash size={12} />
                      {formatAddress(log.txHash)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ArrowDownLeft size={48} className="mx-auto mb-4 opacity-50" />
            <p>No charity transfers yet</p>
            <p className="text-sm mt-2">Transfers happen automatically when the funding goal is reached</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Logs;