const express = require("express");
const cors = require("cors"); // Add this line to import cors to solve Cors error when sending POST request from Angular app to Node.js server
const app = express();

app.use(cors({
  // Add these lines to solve Cors error when sending POST request from Angular app to Node.js server
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'] 
}));

app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password, email, fullname } = req.body;

  if (!username || !password || !email) {
    console.log("Error:", "Username, password and email are required");
    return res.status(400).json({
      status: "error",
      message: "Username, password and email are required",
    });
  }

  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Email:", email);

  const response = {
    status: "success",
    message: "Registration data received successfully",
  };

  res.status(200).json(response);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});