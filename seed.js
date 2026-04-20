const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const DB_FILE = path.join(__dirname, 'expense.db');
const db = new DatabaseSync(DB_FILE);

function genSalt() { return crypto.randomBytes(16).toString('hex'); }
function hashPwd(pwd, salt) { return crypto.createHash('sha256').update(pwd + salt).digest('hex'); }

function dstr(d) { return d.toISOString().split('T')[0]; }

const CATS = [
    'Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Health',
    'Bills & Utils', 'Education', 'Travel', 'Rent', 'Salary',
    'Freelance', 'Investment', 'Other'
];

try {
    db.exec('BEGIN TRANSACTION');

    const username = 'testUser'; // Lowercase as per server.js checks
    let user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

    if (!user) {
        const salt = genSalt();
        const hash = hashPwd('123456', salt);
        const result = db.prepare('INSERT INTO users (fullname, username, password_hash, salt) VALUES (?, ?, ?, ?)').run('Test User', username, hash, salt);
        user = { id: result.lastInsertRowid };
        console.log('✅ Created testuser with password "123456"');
    } else {
        console.log('✅ Found existing testuser. Clearing old test data...');
        db.prepare('DELETE FROM transactions WHERE user_id = ?').run(user.id);
        db.prepare('DELETE FROM budgets WHERE user_id = ?').run(user.id);
    }

    const userId = user.id;
    let txnCounts = 0;

    // Seed 1 month of recent transactions
    const now = new Date();
    const daysInMonth = 30;

    for (let i = daysInMonth; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const dateString = dstr(date);

        // Income (every 15 days or random)
        if (i === daysInMonth || i === 15) {
            db.prepare('INSERT INTO transactions (user_id, type, category, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)').run(userId, 'income', 'Salary', 15000 + Math.floor(Math.random() * 5000), 'Monthly Salary', dateString);
            txnCounts++;
        }

        if (Math.random() > 0.8) {
            db.prepare('INSERT INTO transactions (user_id, type, category, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)').run(userId, 'income', 'Freelance', 2000 + Math.floor(Math.random() * 3000), 'Freelance Project', dateString);
            txnCounts++;
        }

        // Daily expenses (2-4 per day)
        const expensesCount = 2 + Math.floor(Math.random() * 3);
        const expenseCategories = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills & Utils'];

        for (let j = 0; j < expensesCount; j++) {
            const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
            let amount = 100 + Math.floor(Math.random() * 900);
            if (cat === 'Bills & Utils') amount += 1000; // Bills are higher
            if (cat === 'Shopping') amount += 2000;

            db.prepare('INSERT INTO transactions (user_id, type, category, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)').run(userId, 'expense', cat, amount, cat + ' expense', dateString);
            txnCounts++;
        }
    }
    console.log('✅ Seeded ' + txnCounts + ' dummy transactions for the last ' + daysInMonth + ' days.');

    // Add budgets
    const budgetsToSet = [
        { cat: 'Food & Dining', limit: 12000 },
        { cat: 'Transport', limit: 5000 },
        { cat: 'Shopping', limit: 20000 },
        { cat: 'Bills & Utils', limit: 8000 }
    ];

    for (const b of budgetsToSet) {
        db.prepare('INSERT INTO budgets (user_id, category, monthly_limit) VALUES (?, ?, ?)').run(userId, b.cat, b.limit);
    }
    console.log('✅ Seeded ' + budgetsToSet.length + ' dummy budgets.');

    db.exec('COMMIT');
    console.log('\\n🎉 Database successfully seeded for testuser!\\nLogin with username "testuser" and password "password123"');

} catch (error) {
    db.exec('ROLLBACK');
    console.error('❌ Error during seeding:', error.message);
}
