require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const app = express();

const cors = require('cors');

// Allow requests from your frontend origin
// For development: allow everything (*)
// Later change to 'http://127.0.0.1:5500' or your Live Server port
app.use(cors({
  origin: '*',           // ← temporary for dev
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// ─── Helper: Generate JWT ────────────────────────────────────────────
function generateToken(user) {
    return jwt.sign(
        { user_id: user.user_id, username: user.username, level: user.level },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// ─── REGISTER (already done) ─────────────────────────────────────────
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
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── LOGIN ENDPOINT ──────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
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

        // Update last_login
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user.user_id]
        );

        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user_id: user.user_id,
            username: user.username,
            level: user.level,
            token,
            theme: user.theme,
            sound_enabled: user.sound_enabled
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// ─── Protected route example (test auth later) ──────────────────────
app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Protected route accessed', user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/', (req, res) => {
    res.send('BrainSimp API is running 🚀');
});


app.listen(port, () => {
    console.log(`BrainSimp server running at http://localhost:${port}`);
});