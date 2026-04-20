/**
 * ══════════════════════════════════════════════════════════
 *   SMART EXPENSE MANAGER — SERVER
 *   Node.js + Express + MongoDB
 * ══════════════════════════════════════════════════════════
 */

'use strict';

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

// ── Config ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-expense';

// ── Database (Serverless Optimized) ─────────────────────────
// Reuse connection across lambda invocations
let clientPromise;
if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(MONGODB_URI).then(m => {
        console.log('✅ Connected to MongoDB');
        return m.connection.getClient();
    }).catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
}
clientPromise = global._mongoClientPromise;

// Schemas
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    salt: { type: String, required: true },
    currency: { type: String, default: '₹' },
    theme: { type: String, default: 'light' },
    created_at: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: '' },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    created_at: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    monthly_limit: { type: Number, required: true }
});
budgetSchema.index({ user_id: 1, category: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

// ── Helpers ─────────────────────────────────────────────────
function genSalt() { return crypto.randomBytes(16).toString('hex'); }
function hashPwd(pwd, salt) {
    return crypto.createHash('sha256').update(pwd + salt).digest('hex');
}

// ── Express App ─────────────────────────────────────────────
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve index.html + static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'sem_super_secret_2024_xJ9k',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
        httpOnly: true,
        sameSite: 'lax',
    }
}));

// Auth guard middleware
function auth(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    next();
}

// ══════════════════════════════════════════════════════════
//   AUTH ROUTES
// ══════════════════════════════════════════════════════════

app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullname, username, password } = req.body;

        if (!fullname || !username || !password)
            return res.status(400).json({ error: 'All fields are required.' });
        if (username.length < 3)
            return res.status(400).json({ error: 'Username must be at least 3 characters.' });
        if (!/^[a-z0-9_]+$/.test(username.toLowerCase()))
            return res.status(400).json({ error: 'Username: letters, numbers, underscore only.' });
        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });

        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) return res.status(400).json({ error: 'Username already taken.' });

        const salt = genSalt();
        const hash = hashPwd(password, salt);
        
        const newUser = new User({
            fullname: fullname.trim(),
            username: username.toLowerCase(),
            password_hash: hash,
            salt: salt
        });
        await newUser.save();

        res.json({ success: true, message: 'Account created successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ error: 'Username and password required.' });

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

        const hash = hashPwd(password, user.salt);
        if (hash !== user.password_hash)
            return res.status(401).json({ error: 'Invalid username or password.' });

        req.session.userId = user._id.toString();
        res.json({
            success: true,
            user: { id: user._id, fullname: user.fullname, username: user.username, currency: user.currency, theme: user.theme }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId, 'fullname username currency theme');
        if (!user) return res.status(401).json({ error: 'User not found.' });
        
        res.json({
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            currency: user.currency,
            theme: user.theme
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.get('/api/auth/check/:username', async (req, res) => {
    try {
        const exists = await User.findOne({ username: req.params.username.toLowerCase() }, '_id');
        res.json({ available: !exists });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// ══════════════════════════════════════════════════════════
//   TRANSACTION ROUTES
// ══════════════════════════════════════════════════════════

app.get('/api/transactions', auth, async (req, res) => {
    try {
        const rows = await Transaction.find({ user_id: req.session.userId })
            .sort({ date: -1, _id: -1 })
            .lean();
            
        // Map _id to id for frontend compatibility
        const formattedRows = rows.map(r => ({ ...r, id: r._id }));
        res.json(formattedRows);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.post('/api/transactions', auth, async (req, res) => {
    try {
        const { type, category, amount, note, date } = req.body;
        if (!type || !category || !amount || !date)
            return res.status(400).json({ error: 'Missing required fields.' });
            
        const txn = new Transaction({
            user_id: req.session.userId,
            type,
            category,
            amount: parseFloat(amount),
            note: note || '',
            date
        });
        await txn.save();
        
        res.json({ 
            id: txn._id, 
            user_id: req.session.userId, 
            type, 
            category, 
            amount: parseFloat(amount), 
            note: note || '', 
            date 
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.put('/api/transactions/:id', auth, async (req, res) => {
    try {
        const { type, category, amount, note, date } = req.body;
        await Transaction.findOneAndUpdate(
            { _id: req.params.id, user_id: req.session.userId },
            { type, category, amount: parseFloat(amount), note: note || '', date }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.delete('/api/transactions/:id', auth, async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ _id: req.params.id, user_id: req.session.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.delete('/api/transactions', auth, async (req, res) => {
    try {
        await Transaction.deleteMany({ user_id: req.session.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// ══════════════════════════════════════════════════════════
//   BUDGET ROUTES
// ══════════════════════════════════════════════════════════

app.get('/api/budgets', auth, async (req, res) => {
    try {
        const rows = await Budget.find({ user_id: req.session.userId }).lean();
        // Map _id to id
        const formattedRows = rows.map(r => ({ ...r, id: r._id }));
        res.json(formattedRows);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.post('/api/budgets', auth, async (req, res) => {
    try {
        const { category, monthly_limit } = req.body;
        if (!category || !monthly_limit)
            return res.status(400).json({ error: 'Category and limit required.' });
            
        await Budget.findOneAndUpdate(
            { user_id: req.session.userId, category },
            { monthly_limit: parseFloat(monthly_limit) },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.delete('/api/budgets/:id', auth, async (req, res) => {
    try {
        await Budget.findOneAndDelete({ _id: req.params.id, user_id: req.session.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.delete('/api/budgets', auth, async (req, res) => {
    try {
        await Budget.deleteMany({ user_id: req.session.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// ══════════════════════════════════════════════════════════
//   SETTINGS ROUTES
// ══════════════════════════════════════════════════════════

app.put('/api/settings', auth, async (req, res) => {
    try {
        const { fullname, currency, theme } = req.body;
        await User.findByIdAndUpdate(
            req.session.userId,
            { fullname: fullname || 'User', currency: currency || '₹', theme: theme || 'light' }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.put('/api/settings/password', auth, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        if (!current_password || !new_password)
            return res.status(400).json({ error: 'Both passwords required.' });
        if (new_password.length < 6)
            return res.status(400).json({ error: 'New password must be at least 6 characters.' });

        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        const hash = hashPwd(current_password, user.salt);
        if (hash !== user.password_hash)
            return res.status(401).json({ error: 'Current password is incorrect.' });

        const salt = genSalt();
        const newHash = hashPwd(new_password, salt);
        
        user.password_hash = newHash;
        user.salt = salt;
        await user.save();
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.delete('/api/account', auth, async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        const hash = hashPwd(password, user.salt);
        if (hash !== user.password_hash)
            return res.status(401).json({ error: 'Incorrect password.' });

        // Delete user and associated data
        await User.findByIdAndDelete(req.session.userId);
        await Transaction.deleteMany({ user_id: req.session.userId });
        await Budget.deleteMany({ user_id: req.session.userId });
        
        req.session.destroy(() => res.json({ success: true }));
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// ══════════════════════════════════════════════════════════
//   START
// ══════════════════════════════════════════════════════════
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log('\n╔════════════════════════════════════════════╗');
        console.log('║     SMART EXPENSE MANAGER — SERVER         ║');
        console.log('╠════════════════════════════════════════════╣');
        console.log(`║  URL      : http://localhost:${PORT}          ║`);
        console.log('╚════════════════════════════════════════════╝\n');
        console.log('  Press Ctrl+C to stop the server\n');
    });
}

// Export for Vercel Serverless Functions
module.exports = app;
