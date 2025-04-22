import { useEffect, useState } from 'react';
import axios from 'axios';

function Logs() {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    //alert("Fetching logs from the server...");
    axios.get("http://localhost:5000/api/logs/all")
      .then(res => setLogs(res.data))
      .catch(err => console.error("Failed to fetch logs:", err));
      //alert(logs);
  }, []);

  if (!logs) return <p>Loading logs...</p>;

  return (
    <div className="page">
      <h1>📜 Transaction Logs</h1>

      <h2>Donation Logs</h2>
      <ul>
        {logs.donations.map((log) => (
          <li key={log.txHash}>
            <strong>{log.donor}</strong> donated {log.amount} ETH on {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Charity Transfer Logs</h2>
      <ul>
        {logs.transfers.map((log) => (
          <li key={log.txHash}>
            Transferred <strong>{log.totalTransferred} ETH</strong> to owner on {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Logs;
