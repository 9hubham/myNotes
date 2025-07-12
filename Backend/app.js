require('dotenv').config()
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
// Configure CORS more specifically
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from React app
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(PORT, () => {
  console.log(`iNotebook backend listening at http://localhost:${PORT}`);
});