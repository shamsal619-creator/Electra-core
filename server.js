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
    console.error('❌ MONGODB_URI environment variable is missing.');
}

// Improved connection function for better error reporting
async function connectToDatabase() {
    if (!MONGODB_URI) return;

    console.log('🔍 Attempting to connect to database...');
    
    // Safety check for common password mistake
    if (MONGODB_URI.includes('<') || MONGODB_URI.includes('>')) {
        console.error('⚠️ Warning: MONGODB_URI seems to contain brackets < or >. These should be replaced with your actual password.');
    }

    const mongooseOptions = {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        retryWrites: true,
        w: 'majority'
    };

    try {
        if (MONGODB_URI.startsWith('mongodb+srv')) {
            console.log('🔄 Connecting with SRV record...');
        } else {
            console.log('🔄 Connecting with Standard Connection String...');
        }
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        isConnected = true;
        console.log('✅ MongoDB connected successfully to:', mongoose.connection.name);
    } catch (err) {
        isConnected = false;
        console.error('❌ MongoDB connection error details:');
        console.error('- Name:', err.name);
        console.error('- Message:', err.message);
        
        if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
            console.error('\n💡 DNS Lookup Failed. Possible causes:');
            console.error('   1. Internet connection issue');
            console.error('   2. Invalid MongoDB URI in .env file');
            console.error('   3. MongoDB Atlas cluster address is incorrect');
        }
        
        if (err.message.includes('IP address not whitelisted')) {
            console.error('\n💡 IP Whitelist Issue: Add your IP to MongoDB Atlas IP whitelist.');
            console.error('   Go to Atlas > Network Access > Add IP Address');
        }
        
        if (err.reason) console.error('- Reason:', err.reason);
    }
}

let isConnected = false;
// Start connection attempt immediately
connectToDatabase().catch(err => {
    console.error('Unexpected error during DB connection:', err);
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
    isConnected = false;
    console.error('❌ MongoDB runtime error:', err.message);
});

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register new user
app.post('/api/register', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    try {
        const { first, last, email, password } = req.body;
        
        // Trim all inputs
        const trimmedFirst = (first || '').trim();
        const trimmedLast = (last || '').trim();
        const trimmedEmail = (email || '').trim().toLowerCase();
        const trimmedPassword = (password || '').trim();
        
        // Input Validation
        if (!trimmedFirst || !trimmedLast || !trimmedEmail || !trimmedPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (trimmedFirst.length < 2 || trimmedLast.length < 2) {
            return res.status(400).json({ error: 'First and last name must be at least 2 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (trimmedPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        // Check for duplicate email using case-insensitive search
        const existingUser = await User.findOne({ email: trimmedEmail }).lean();
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        
        // Create and save new user
        const user = new User({ 
            first: trimmedFirst, 
            last: trimmedLast, 
            email: trimmedEmail, 
            password: trimmedPassword 
        });
        await user.save();
        
        res.status(201).json({
            ok: true,
            message: 'Registration successful',
            user: { 
                id: user._id, 
                first: user.first, 
                last: user.last, 
                email: user.email, 
                created: user.created 
            }
        });
    } catch (err) {
        // Handle MongoDB unique constraint violation
        if (err && err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0] || 'email';
            return res.status(409).json({ error: `${field} is already registered` });
        }
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: 'Validation failed: ' + messages.join(', ') });
        }
        console.error('❌ Register error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const trimmedEmail = String(email).trim().toLowerCase();
        
        // Find user and explicitly select password field
        const user = await User.findOne({ email: trimmedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        res.status(200).json({
            ok: true,
            message: 'Login successful',
            user: { 
                id: user._id, 
                first: user.first, 
                last: user.last, 
                email: user.email,
                nick: user.nick || '',
                gender: user.gender || '',
                language: user.language || '',
                country: user.country || '',
                timezone: user.timezone || '',
                address: user.address || '',
                created: user.created
            }
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Update profile (supports all fields)
app.put('/api/profile', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
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
        
        // Build update object, trimming string fields
        const updateData = {};
        if (first !== undefined) updateData.first = String(first).trim();
        if (last !== undefined) updateData.last = String(last).trim();
        if (nick !== undefined) updateData.nick = String(nick).trim();
        if (gender !== undefined) updateData.gender = String(gender).trim();
        if (language !== undefined) updateData.language = String(language).trim();
        if (country !== undefined) updateData.country = String(country).trim();
        if (timezone !== undefined) updateData.timezone = String(timezone).trim();
        if (address !== undefined) updateData.address = String(address).trim();
        
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            ok: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                first: user.first,
                last: user.last,
                email: user.email,
                nick: user.nick || '',
                gender: user.gender || '',
                language: user.language || '',
                country: user.country || '',
                timezone: user.timezone || '',
                address: user.address || '',
                created: user.created
            }
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: 'Validation failed: ' + messages.join(', ') });
        }
        console.error('❌ Profile update error:', err);
        res.status(500).json({ error: 'Profile update failed. Please try again.' });
    }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    try {
        const users = await User.find().select('-password').lean();
        res.status(200).json({ ok: true, count: users.length, users });
    } catch (err) {
        console.error('❌ Get users error:', err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Test route to confirm server is working
app.get('/ping', (req, res) => res.send('pong'));

// Debug route to check connection status (NOT for production use!)
app.get('/api/status', (req, res) => {
    res.json({
        ok: true,
        databaseConnected: isConnected,
        envLoaded: !!MONGODB_URI,
        port: PORT
    });
});

// Static files (must come after API routes so /api/* and /ping are not treated as file paths)
app.use(express.static(path.join(__dirname, 'public')));

const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    } else {
        console.error('❌ Server startup error:', err);
    }
});

