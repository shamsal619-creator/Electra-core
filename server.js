const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

console.log('🔍 Attempting to connect to database...');

const mongooseOptions = {
    serverSelectionTimeoutMS: 10000,
};

let isConnected = false;

mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        isConnected = false;
    });

mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.log('🟡 MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('🟢 MongoDB reconnected');
});
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB runtime error:', err);
});

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register new user
app.post('/api/register', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected' });
    }
    try {
        const { first, last, email, password } = req.body;
        
        // Basic Input Validation
        if (!first || !last || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (first.length < 2 || last.length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        
        // Prevent duplicate email registration
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        const user = new User({ first, last, email: normalizedEmail, password });
        await user.save();
        
        res.status(201).json({
            ok: true,
            message: 'Registration successful',
            user: { id: user._id, first, last, email: normalizedEmail, created: user.created }
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('❌ Register error:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected' });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({
            ok: true,
            message: 'Login successful',
            user: { id: user._id, first: user.first, last: user.last, email: user.email }
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update profile (supports all fields)
app.put('/api/profile', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected' });
    }
    try {
        const { userId, first, last, nick, gender, language, country, timezone, address } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required. Please sign in again.' });
        }
        const id = String(userId).trim();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID. Please sign in again.' });
        }
        const user = await User.findByIdAndUpdate(
            id,
            { first, last, nick, gender, language, country, timezone, address },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            ok: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                first: user.first,
                last: user.last,
                email: user.email,
                nick: user.nick,
                gender: user.gender,
                language: user.language,
                country: user.country,
                timezone: user.timezone,
                address: user.address,
                created: user.created
            }
        });
    } catch (err) {
        console.error('❌ Profile update error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected' });
    }
    try {
        const users = await User.find().select('-password');
        res.json({ ok: true, count: users.length, users });
    } catch (err) {
        console.error('❌ Get users error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Test route to confirm server is working
app.get('/ping', (req, res) => res.send('pong'));

// Static files (must come after API routes so /api/* and /ping are not treated as file paths)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});