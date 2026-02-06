// Crash handler
process.on('uncaughtException', (err) => {
  console.error('SERVER CRASHED - Uncaught Exception:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Server.js started - debug mode ON');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('<h1>BrainSimp Backend is ALIVE! 🚀</h1><p>DB connected OK.</p>');
});

// Generate JWT helper
function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, level: user.level },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );

    const token = generateToken({ user_id: result.insertId, username, level: 1 });

    res.status(201).json({
      message: 'User registered successfully',
      user_id: result.insertId,
      username,
      token
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user.user_id]
    );

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user_id: user.user_id,
      username: user.username,
      level: user.level,
      token,
      theme: user.theme || 'light',
      sound_enabled: user.sound_enabled || true
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`BrainSimp server running at http://localhost:${port}`);
});