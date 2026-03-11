const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000; // Render سيحدد المنفذ تلقائيًا

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI غير موجود في .env');
    process.exit(1);
}

console.log('🔍 محاولة الاتصال بقاعدة البيانات...');

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

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'قاعدة البيانات غير متصلة' });
    }
    try {
        const { first, last, email, password } = req.body;
        if (!first || !last || !email || !password) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'البريد الإلكتروني موجود بالفعل' });
        }
        const user = new User({ first, last, email: normalizedEmail, password });
        await user.save();
        res.status(201).json({
            ok: true,
            message: 'تم التسجيل بنجاح',
            user: { id: user._id, first, last, email: normalizedEmail, created: user.created }
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({ error: 'البريد الإلكتروني موجود بالفعل' });
        }
        console.error('❌ Register error:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

// تسجيل الدخول
app.post('/api/login', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'قاعدة البيانات غير متصلة' });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }
        res.json({
            ok: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: { id: user._id, first: user.first, last: user.last, email: user.email }
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

// جلب جميع المستخدمين
app.get('/api/users', async (req, res) => {
    if (!isConnected) {
        return res.status(503).json({ error: 'قاعدة البيانات غير متصلة' });
    }
    try {
        const users = await User.find().select('-password');
        res.json({ ok: true, count: users.length, users });
    } catch (err) {
        console.error('❌ Get users error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});