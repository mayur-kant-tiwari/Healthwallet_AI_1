import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [claimResult, setClaimResult] = useState(null);

  const analyzeHealth = async () => {
    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        healthHistory: [
          { bp: 150, sugar: 190, opdVisits: 3 },
          { bp: 145, sugar: 170, opdVisits: 2 }
        ]
      })
    });

    const data = await res.json();
    setResult(data);
  };

  const claim = async () => {
    const res = await fetch("http://localhost:5000/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        riskToken: result.riskToken,
        amount: 15000
      })
    });

    const data = await res.json();
    setClaimResult(data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🏥 HealthWallet AI v2.0</h1>

      <button onClick={analyzeHealth}>Run Health Analysis</button>

      {result && (
        <>
          <h3>Risk Level: {result.riskLevel}</h3>
          <p>Predicted Event: {result.predictedEvent}</p>

          <pre>
            {JSON.stringify(result.autoFinancialAction, null, 2)}
          </pre>

          <button onClick={claim}>Simulate Hospital Claim</button>
        </>
      )}

      {claimResult && (
        <pre>{JSON.stringify(claimResult, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
