const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
const riskVault = {};
const walletVault = {};

// Health risk engine
function calculateHealthRisk(healthHistory) {
  let risk = 0;

  healthHistory.forEach((record) => {
    if (record.bp > 140) risk += 20;
    if (record.sugar > 180) risk += 25;
    if (record.opdVisits > 2) risk += 15;
  });

  if (risk < 30) return "LOW";
  if (risk < 60) return "MEDIUM";
  return "HIGH";
}

function predictHealthEvent(riskLevel) {
  if (riskLevel === "HIGH") return "Hospitalization Likely";
  if (riskLevel === "MEDIUM") return "OPD Frequency Rising";
  return "Stable";
}

function financialAction(event) {
  if (event === "Hospitalization Likely") {
    return { creditLimit: 50000, instantClaim: true };
  }
  if (event === "OPD Frequency Rising") {
    return { creditLimit: 20000, preventiveSubsidy: true };
  }
  return { creditLimit: 10000 };
}

app.post("/api/analyze", (req, res) => {
  const { healthHistory } = req.body;

  const riskLevel = calculateHealthRisk(healthHistory);
  const predictedEvent = predictHealthEvent(riskLevel);
  const finance = financialAction(predictedEvent);

  const riskToken = uuidv4();

  riskVault[riskToken] = { riskLevel, predictedEvent };
  walletVault[riskToken] = { balance: finance.creditLimit };

  res.json({
    riskToken,
    riskLevel,
    predictedEvent,
    autoFinancialAction: finance,
  });
});

app.post("/api/claim", (req, res) => {
  const { riskToken, amount } = req.body;

  if (!walletVault[riskToken]) {
    return res.status(404).json({ error: "Invalid token" });
  }

  if (walletVault[riskToken].balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  walletVault[riskToken].balance -= amount;

  res.json({
    status: "APPROVED",
    remainingBalance: walletVault[riskToken].balance,
  });
});
const path = require("path");

// This tells the server: "When someone visits the home page, send them index.html"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5000, () => {
  console.log("✅ HealthWallet AI backend running on port 5000");
});
