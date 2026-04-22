const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./models/User');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
/** Public HTTPS URL of this app (same host as OAuth routes). Used when GOOGLE_CALLBACK_URL is unset. */
const PUBLIC_URL = (process.env.PUBLIC_URL || FRONTEND_URL).replace(/\/$/, '');
const isProduction = process.env.NODE_ENV === 'production';
const forceSecureCookies = process.env.USE_SECURE_COOKIES === 'true';

if (process.env.TRUST_PROXY !== '0') {
    app.set('trust proxy', 1);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'electra-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        // "auto" allows local HTTP while still using secure cookies behind HTTPS proxy in production.
        secure: forceSecureCookies ? true : 'auto',
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

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
    if (process.env.MONGODB_DB && String(process.env.MONGODB_DB).trim()) {
        mongooseOptions.dbName = String(process.env.MONGODB_DB).trim();
    }

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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean();
        done(null, user || false);
    } catch (err) {
        done(err);
    }
});

const DEFAULT_GOOGLE_CALLBACK_PATH = '/auth/google/callback';
const staticGoogleCallbackURL = process.env.GOOGLE_CALLBACK_URL || `${PUBLIC_URL}${DEFAULT_GOOGLE_CALLBACK_PATH}`;

function getRuntimeCallbackURL(req) {
    if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = (typeof forwardedProto === 'string' && forwardedProto.length)
        ? forwardedProto.split(',')[0].trim()
        : req.protocol;
    return `${protocol}://${req.get('host')}${DEFAULT_GOOGLE_CALLBACK_PATH}`;
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: staticGoogleCallbackURL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Google account has no email'));

        const trimmedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: trimmedEmail }).select('+password');
        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = new User({
                first: profile.name?.givenName || 'Google',
                last: profile.name?.familyName || 'User',
                email: trimmedEmail,
                password: randomPassword,
                googleId: profile.id
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

async function sendResetEmail(toEmail, resetUrl) {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Reset your ElectraCore password',
            text: `Use this link to reset your password:\n${resetUrl}`,
            html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
        });
        return true;
    }
    console.log('Password reset link for', toEmail, resetUrl);
    return false;
}

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

app.get('/api/session', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ ok: false, error: 'Not authenticated' });
    }
    const user = { 
        id: req.user._id,
        first: req.user.first,
        last: req.user.last,
        email: req.user.email,
        nick: req.user.nick || '',
        gender: req.user.gender || '',
        language: req.user.language || '',
        country: req.user.country || '',
        timezone: req.user.timezone || '',
        address: req.user.address || ''
    };
    res.json({ ok: true, user });
});

app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.json({ ok: true });
        });
    });
});

app.get('/auth/google', (req, res, next) => {
    const callbackURL = getRuntimeCallbackURL(req);
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        callbackURL
    })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
    const callbackURL = getRuntimeCallbackURL(req);
    passport.authenticate('google', {
        failureRedirect: '/signin.html?error=google',
        callbackURL
    })(req, res, next);
}, (req, res) => {
    res.redirect('/?google=success');
});

app.post('/api/forgot-password', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const trimmedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return res.json({ ok: true, message: 'If the email exists, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${FRONTEND_URL}/reset-password.html?token=${token}`;
        const emailSent = await sendResetEmail(user.email, resetUrl);
        const payload = { ok: true, message: 'If the email exists, a reset link has been sent.' };
        if (!emailSent) payload.debugLink = resetUrl;
        return res.json(payload);
    } catch (err) {
        console.error('❌ Forgot password error:', err);
        res.status(500).json({ error: 'Unable to start password reset. Please try again.' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ ok: true, message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('❌ Reset password error:', err);
        res.status(500).json({ error: 'Unable to reset password. Please try again.' });
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
        port: PORT,
        mongooseReadyState: mongoose.connection.readyState,
        googleOAuthConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    });
});

// Static files (must come after API routes so /api/* and /ping are not treated as file paths)
app.use(express.static(path.join(__dirname, 'public')));

const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    if (process.env.GOOGLE_CLIENT_ID) {
        console.log('🔐 Google OAuth callback URL:', staticGoogleCallbackURL);
    }
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    } else {
        console.error('❌ Server startup error:', err);
    }
});

