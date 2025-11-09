const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();

// App setup
const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);



// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check existing
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ err: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    res.send({ message: "User registered", user: newUser });

  } catch (err) {
    console.log(err);
    res.status(500).send("Signup failed");
  }
});



// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    // user not found
    if (!user) {
      return res.status(401).send({err:"Unauthorized Credentials"});
    }

    // compare passwords
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({err:"Unauthorized Credentials"});
    }

    // generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.send({ token });

  } catch (err) {
    console.log(err);
    res.status(500).send({err:"Login failed"});
  }
});



// AUTHORIZATION MIDDLEWARE
function authorizeMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Invalid Authorization");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token invalid or expired");

    req.user = user;
    next();
  });
}



// PROTECTED ROUTE
app.get("/auth", authorizeMiddleware, (req, res) => {
  res.send({
    message: "Authenticated Access",
    user: req.user
  });
});



// SERVER
app.listen(PORT, () => console.log("Server running on port 3000"));
