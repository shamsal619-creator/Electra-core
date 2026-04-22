const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first: { type: String, required: true, trim: true, minlength: 2 },
    last: { type: String, required: true, trim: true, minlength: 2 },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    password: { type: String, required: true, select: false, minlength: 6 },
    googleId: { type: String, trim: true, unique: false, sparse: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // Optional fields (can be empty)
    nick: { type: String, trim: true },
    gender: { type: String, trim: true },
    language: { type: String, trim: true },
    country: { type: String, trim: true },
    timezone: { type: String, trim: true },
    address: { type: String, trim: true },
    created: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
    // Always trim string fields for consistency
    if (this.first) this.first = this.first.trim();
    if (this.last) this.last = this.last.trim();
    if (this.email) this.email = this.email.trim().toLowerCase();
    
    // Only hash if password is new or modified
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);