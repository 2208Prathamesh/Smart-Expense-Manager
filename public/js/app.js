/**
 * ══════════════════════════════════════════════════════════
 *   SMART EXPENSE MANAGER — CLIENT APPLICATION
 *   Extracted from index.html for clean project structure
 * ══════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════
// CATEGORIES CONFIG
// ═══════════════════════════════════════════════
const CATS = [
    { name: 'Food & Dining', icon: '🍔', color: '#e07a5f' },
    { name: 'Transport', icon: '🚗', color: '#3d405b' },
    { name: 'Shopping', icon: '🛍️', color: '#81b29a' },
    { name: 'Entertainment', icon: '🎬', color: '#f2cc8f' },
    { name: 'Health', icon: '💊', color: '#e76f51' },
    { name: 'Bills & Utils', icon: '⚡', color: '#264653' },
    { name: 'Education', icon: '📚', color: '#2a9d8f' },
    { name: 'Travel', icon: '✈️', color: '#457b9d' },
    { name: 'Rent', icon: '🏠', color: '#6d6875' },
    { name: 'Salary', icon: '💼', color: '#2d6a4f' },
    { name: 'Freelance', icon: '💻', color: '#40916c' },
    { name: 'Investment', icon: '📈', color: '#1b4332' },
    { name: 'Other', icon: '📦', color: '#9e9890' },
];
const gc = n => CATS.find(c => c.name === n) || { name: n, icon: '📦', color: '#9e9890' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let CU = null;          // Current user object
let EID = null;         // Editing transaction ID
let CT = 'income';      // Current modal type
let CHARTS = {};        // Chart instances
let ALL_TXN = [];       // Cached transactions
let CUR = '₹';         // Currency symbol
let UNAME = 'User';

// ═══════════════════════════════════════════════
// API HELPER
// ═══════════════════════════════════════════════
async function api(method, path, body) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch('/api' + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

function loading(show) {
    document.getElementById('glob-loader').classList.toggle('show', show);
}

// ═══════════════════════════════════════════════
// AUTH UI HELPERS
// ═══════════════════════════════════════════════
function switchTab(t) {
    ['login', 'register'].forEach(x => {
        document.getElementById('tab-' + x).classList.toggle('active', x === t);
        document.getElementById('form-' + x).classList.toggle('active', x === t);
    });
    clearErr();
}
function clearErr() {
    ['login-err', 'reg-err', 'reg-ok'].forEach(id => {
        const e = document.getElementById(id); e.classList.remove('show'); e.textContent = '';
    });
}
function showErr(id, m) { const e = document.getElementById(id); e.textContent = m; e.classList.add('show'); }
function showOk(id, m) { const e = document.getElementById(id); e.textContent = m; e.classList.add('show'); }

function tpwd(id, btn) {
    const el = document.getElementById(id);
    const ip = el.type === 'password';
    el.type = ip ? 'text' : 'password';
    btn.querySelector('i').className = ip ? 'fa fa-eye-slash' : 'fa fa-eye';
}
function chkStr(p) {
    const f = document.getElementById('sf'), l = document.getElementById('sl');
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++; if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++; if (/[^a-zA-Z0-9]/.test(p)) s++;
    const w = [0, 20, 40, 65, 85, 100][s] || 0, c = ['', '#e57373', '#f4a261', '#f2cc8f', '#52b788', '#2d6a4f'][s] || '';
    const lb = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][s] || '';
    f.style.width = w + '%'; f.style.background = c;
    l.textContent = lb; l.style.color = c || 'var(--text3)';
}
async function chkUser(v) {
    const el = document.getElementById('uc');
    if (!v) { el.textContent = ''; return; }
    try {
        const r = await api('GET', '/auth/check/' + encodeURIComponent(v));
        el.textContent = r.available ? '✅ Available' : '❌ Taken';
        el.style.color = r.available ? 'var(--accent)' : 'var(--danger)';
    } catch (e) { el.textContent = ''; }
}

// ═══════════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════════
async function doRegister() {
    clearErr();
    const fn = document.getElementById('reg-n').value.trim();
    const un = document.getElementById('reg-u').value.trim().toLowerCase();
    const pw = document.getElementById('reg-p').value;
    const cf = document.getElementById('reg-c').value;
    if (!fn) { showErr('reg-err', 'Enter your full name.'); return; }
    if (un.length < 3) { showErr('reg-err', 'Username needs 3+ characters.'); return; }
    if (!/^[a-z0-9_]+$/.test(un)) { showErr('reg-err', 'Username: letters, numbers, underscore only.'); return; }
    if (pw.length < 6) { showErr('reg-err', 'Password needs 6+ characters.'); return; }
    if (pw !== cf) { showErr('reg-err', 'Passwords do not match.'); return; }

    const btn = document.getElementById('reg-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creating…';
    try {
        await api('POST', '/auth/register', { fullname: fn, username: un, password: pw });
        btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> Create Account';
        ['reg-n', 'reg-u', 'reg-p', 'reg-c'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('uc').textContent = '';
        document.getElementById('sf').style.width = '0';
        showOk('reg-ok', '✅ Account created! You can now sign in.');
        toast('Account created!', 'success');
        setTimeout(() => switchTab('login'), 1700);
    } catch (err) {
        btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> Create Account';
        showErr('reg-err', err.message);
    }
}

// ═══════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════
async function doLogin() {
    clearErr();
    const un = document.getElementById('login-u').value.trim().toLowerCase();
    const pw = document.getElementById('login-p').value;
    if (!un || !pw) { showErr('login-err', 'Enter username and password.'); return; }

    const btn = document.getElementById('login-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Signing in…';
    try {
        const data = await api('POST', '/auth/login', { username: un, password: pw });
        CU = data.user;
        document.getElementById('login-p').value = '';
        btn.disabled = false; btn.innerHTML = '<i class="fa fa-arrow-right-to-bracket"></i> Sign In';
        await launchApp();
    } catch (err) {
        btn.disabled = false; btn.innerHTML = '<i class="fa fa-arrow-right-to-bracket"></i> Sign In';
        showErr('login-err', err.message);
    }
}

// ═══════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════
async function doLogout() {
    if (!confirm('Sign out?')) return;
    try { await api('POST', '/auth/logout'); } catch (e) { }
    CU = null; ALL_TXN = [];
    Object.values(CHARTS).forEach(c => c.destroy()); CHARTS = {};
    document.getElementById('app').classList.remove('visible');
    document.getElementById('auth-screen').style.display = 'flex';
    switchTab('login');
    toast('Signed out', 'info');
}

// ═══════════════════════════════════════════════
// LAUNCH APP
// ═══════════════════════════════════════════════
async function launchApp() {
    UNAME = CU.fullname || CU.username;
    CUR = CU.currency || '₹';

    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    document.getElementById('sun').textContent = UNAME;
    document.getElementById('sav').textContent = UNAME.charAt(0).toUpperCase();
    document.getElementById('s-name').value = UNAME;
    document.getElementById('s-cur').value = CUR;

    setTheme(CU.theme || 'light');
    updCSym();
    popChips();
    popCatSelects();

    await loadAllTxn();
    nav('dashboard');
}

async function restoreSession() {
    loading(true);
    try {
        const user = await api('GET', '/me');
        CU = user;
        await launchApp();
    } catch (e) {
        document.getElementById('auth-screen').style.display = 'flex';
    } finally {
        loading(false);
    }
}

// ═══════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════
function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const d = t === 'dark';
    const al = document.getElementById('auth-tlbl');
    const apl = document.getElementById('app-tlbl');
    if (al) al.textContent = d ? '🌙 Dark Mode' : '☀️ Light Mode';
    if (apl) apl.textContent = d ? '🌙 Dark' : '☀️ Light';
    updChartTheme();
}
async function toggleTheme() {
    const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(n);
    if (CU) { try { await api('PUT', '/settings', { fullname: UNAME, currency: CUR, theme: n }); } catch (e) { } }
}

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════
const PM = {
    dashboard: { t: 'Dashboard', s: 'Overview of your finances' },
    transactions: { t: 'Transactions', s: 'All income & expense records' },
    budget: { t: 'Budget Planner', s: 'Set and track monthly budgets' },
    reports: { t: 'Reports & Analytics', s: 'Insights into your spending' },
    settings: { t: 'Settings', s: 'Manage your preferences' },
};
function nav(p) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.ni[data-page]').forEach(x => x.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    document.querySelector(`.ni[data-page="${p}"]`).classList.add('active');
    const m = PM[p] || {};
    document.getElementById('ptitle').textContent = m.t || p;
    document.getElementById('psub').textContent = m.s || '';
    closeSB();
    rfPage(p);
}
document.querySelectorAll('.ni[data-page]').forEach(b => b.addEventListener('click', () => nav(b.dataset.page)));
function rfPage(p) {
    if (p === 'dashboard') rdash();
    if (p === 'transactions') rtxn();
    if (p === 'budget') rbud();
    if (p === 'reports') rrep();
}
async function rfAll() {
    await loadAllTxn();
    const a = document.querySelector('.page.active');
    if (a) rfPage(a.id.replace('page-', ''));
}

// Sidebar mobile
function openSB() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sbo').classList.add('open'); }
function closeSB() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sbo').classList.remove('open'); }

// ═══════════════════════════════════════════════
// LOAD TRANSACTIONS (cache)
// ═══════════════════════════════════════════════
async function loadAllTxn() {
    try { ALL_TXN = await api('GET', '/transactions'); }
    catch (e) { ALL_TXN = []; }
}

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════
function openModal(type = 'expense', id = null) {
    EID = id; CT = type;
    document.getElementById('modal-title').textContent = id ? 'Edit Transaction' : 'Add Transaction';
    const cs = document.getElementById('txn-cat');
    cs.innerHTML = CATS.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
    document.getElementById('txn-date').value = new Date().toISOString().split('T')[0];
    if (id) {
        const t = ALL_TXN.find(x => x.id === id);
        if (t) {
            CT = t.type;
            document.getElementById('txn-note').value = t.note;
            document.getElementById('txn-amt').value = t.amount;
            document.getElementById('txn-date').value = t.date;
            cs.value = t.category;
        }
    } else {
        document.getElementById('txn-note').value = '';
        document.getElementById('txn-amt').value = '';
    }
    updTT(CT);
    document.getElementById('txn-modal').classList.add('open');
}
function closeModal() { document.getElementById('txn-modal').classList.remove('open'); EID = null; }
function updTT(t) {
    document.querySelectorAll('.tyb').forEach(b => { b.classList.remove('active'); if (b.dataset.type === t) b.classList.add('active'); });
    CT = t;
}
document.querySelectorAll('.tyb').forEach(b => b.addEventListener('click', () => updTT(b.dataset.type)));
document.getElementById('txn-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.getElementById('msave').addEventListener('click', async () => {
    const note = document.getElementById('txn-note').value.trim();
    const amount = parseFloat(document.getElementById('txn-amt').value);
    const date = document.getElementById('txn-date').value;
    const cat = document.getElementById('txn-cat').value;
    if (!note) { toast('Enter a description', 'error'); return; }
    if (!amount || amount <= 0) { toast('Enter a valid amount', 'error'); return; }
    if (!date) { toast('Select a date', 'error'); return; }

    document.getElementById('msave').disabled = true;
    try {
        if (EID) {
            await api('PUT', '/transactions/' + EID, { type: CT, category: cat, amount, note, date });
            toast('Transaction updated!', 'success');
        } else {
            await api('POST', '/transactions', { type: CT, category: cat, amount, note, date });
            toast('Transaction added!', 'success');
        }
        closeModal();
        await rfAll();
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        document.getElementById('msave').disabled = false;
    }
});

// ═══════════════════════════════════════════════
// DELETE TXN
// ═══════════════════════════════════════════════
async function delTxn(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        await api('DELETE', '/transactions/' + id);
        toast('Deleted', 'error');
        await rfAll();
    } catch (e) { toast(e.message, 'error'); }
}
async function delBud(id) {
    if (!confirm('Remove this budget?')) return;
    try {
        await api('DELETE', '/budgets/' + id);
        toast('Budget removed', 'error');
        rbud();
    } catch (e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════
// FORMAT
// ═══════════════════════════════════════════════
function fmt(v) { return CUR + parseFloat(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
function dstr(d) { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════
function rdash() {
    const all = ALL_TXN;
    const inc = all.filter(t => t.type === 'income');
    const exp = all.filter(t => t.type === 'expense');
    const tI = inc.reduce((s, t) => s + t.amount, 0);
    const tE = exp.reduce((s, t) => s + t.amount, 0);
    const bal = tI - tE;

    document.getElementById('d-bal').textContent = fmt(bal);
    document.getElementById('d-inc').textContent = fmt(tI);
    document.getElementById('d-exp').textContent = fmt(tE);
    document.getElementById('d-inc-c').textContent = `${inc.length} transaction${inc.length !== 1 ? 's' : ''}`;
    document.getElementById('d-exp-c').textContent = `${exp.length} transaction${exp.length !== 1 ? 's' : ''}`;
    document.getElementById('d-bal').style.color = bal < 0 ? 'var(--danger)' : bal > 0 ? 'var(--income)' : 'var(--text)';
    document.getElementById('d-mchip').textContent = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    rMon(all); rCat(exp);
    const rl = document.getElementById('recent-list');
    const recent = all.slice(0, 6);
    rl.innerHTML = recent.length ? recent.map(thtml).join('') : `<div class="es"><i class="fa fa-receipt"></i><p>No transactions yet!</p></div>`;
}

function thtml(t) {
    const c = gc(t.category); const sgn = t.type === 'income' ? '+' : '-';
    return `<div class="ti">
    <div class="tci" style="background:${c.color}22;color:${c.color};font-size:.95rem;">${c.icon}</div>
    <div class="tif"><div class="tn">${esc(t.note)}</div><div class="tm">${c.name} · ${dstr(t.date)}</div></div>
    <div class="tam ${t.type}">${sgn}${fmt(t.amount)}</div>
    <div class="tac">
      <button class="ib e" onclick="openModal('${t.type}',${t.id})"><i class="fa fa-pen"></i></button>
      <button class="ib d" onclick="delTxn(${t.id})"><i class="fa fa-trash"></i></button>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════
function cclrs() {
    const dk = document.documentElement.getAttribute('data-theme') === 'dark';
    return { grid: dk ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)', text: dk ? '#9a97a8' : '#6b6560', inc: '#52b788', exp: '#e57373' };
}
function dch(id) { if (CHARTS[id]) { CHARTS[id].destroy(); delete CHARTS[id]; } }
function l6m() {
    const m = []; const n = new Date();
    for (let i = 5; i >= 0; i--) { const d = new Date(n.getFullYear(), n.getMonth() - i, 1); m.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); }
    return m;
}
function rMon(all) {
    dch('m'); const c = cclrs(); const ms = l6m();
    const iD = ms.map(m => all.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
    const eD = ms.map(m => all.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
    const lb = ms.map(m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleString('default', { month: 'short' }); });
    CHARTS['m'] = new Chart(document.getElementById('monthlyChart'), {
        type: 'bar',
        data: {
            labels: lb, datasets: [
                { label: 'Income', data: iD, backgroundColor: c.inc + '99', borderColor: c.inc, borderWidth: 1.5, borderRadius: 5 },
                { label: 'Expense', data: eD, backgroundColor: c.exp + '99', borderColor: c.exp, borderWidth: 1.5, borderRadius: 5 },
            ]
        },
        options: {
            responsive: true, plugins: { legend: { labels: { color: c.text, font: { family: 'DM Sans' } } } },
            scales: { x: { grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { color: c.grid }, ticks: { color: c.text, callback: v => CUR + v } } }
        }
    });
}
function rCat(exp) {
    dch('c'); const c = cclrs();
    const cm = {}; exp.forEach(t => { cm[t.category] = (cm[t.category] || 0) + t.amount; });
    const s = Object.entries(cm).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!s.length) return;
    const cats = s.map(([n]) => gc(n));
    CHARTS['c'] = new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: { labels: s.map(([n]) => n), datasets: [{ data: s.map(([, v]) => v), backgroundColor: cats.map(c => c.color + 'cc'), borderColor: cats.map(c => c.color), borderWidth: 2 }] },
        options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: c.text, font: { family: 'DM Sans' }, boxWidth: 11, padding: 7 } } } }
    });
}
function updChartTheme() {
    if (!CU) return;
    const all = ALL_TXN;
    if (document.getElementById('page-dashboard').classList.contains('active')) { rMon(all); rCat(all.filter(t => t.type === 'expense')); }
    if (document.getElementById('page-reports').classList.contains('active')) rrep();
}

// ═══════════════════════════════════════════════
// TRANSACTIONS PAGE
// ═══════════════════════════════════════════════
function rtxn() {
    const all = ALL_TXN;
    const cats = [...new Set(all.map(t => t.category))];
    document.getElementById('tf-cat').innerHTML = '<option value="">All Categories</option>' + cats.map(r => `<option value="${esc(r)}">${gc(r).icon} ${esc(r)}</option>`).join('');
    const months = [...new Set(all.map(r => r.date.slice(0, 7)))].sort().reverse();
    document.getElementById('tf-month').innerHTML = '<option value="">All Months</option>' + months.map(m => { const [y, mo] = m.split('-'); return `<option value="${m}">${new Date(y, mo - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</option>`; }).join('');
    applyF();
}
function applyF() {
    const s = document.getElementById('ts').value.toLowerCase();
    const tp = document.getElementById('tf-type').value;
    const ct = document.getElementById('tf-cat').value;
    const mn = document.getElementById('tf-month').value;
    let txns = ALL_TXN;
    if (tp) txns = txns.filter(t => t.type === tp);
    if (ct) txns = txns.filter(t => t.category === ct);
    if (mn) txns = txns.filter(t => t.date.startsWith(mn));
    if (s) txns = txns.filter(t => t.note.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    const body = document.getElementById('ttb');
    if (!txns.length) { body.innerHTML = `<div class="es"><i class="fa fa-inbox"></i><p>No transactions found.</p></div>`; return; }
    body.innerHTML = txns.map(t => {
        const c = gc(t.category); const sgn = t.type === 'income' ? '+' : '-';
        return `<div class="tr2">
      <div class="cd"><div class="tci" style="background:${c.color}22;color:${c.color};">${c.icon}</div>
        <div style="min-width:0"><div style="font-weight:500;font-size:.83rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t.note)}</div><div style="font-size:.7rem;color:var(--text3)">#${t.id}</div></div></div>
      <span class="col-cat" style="font-size:.8rem;color:var(--text2)">${c.icon} ${esc(t.category)}</span>
      <span class="col-type"><span class="badge ${t.type}">${t.type}</span></span>
      <span class="col-date" style="font-size:.8rem;color:var(--text2)">${dstr(t.date)}</span>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
        <span class="tam ${t.type}" style="font-size:.86rem">${sgn}${fmt(t.amount)}</span>
        <div style="display:flex;gap:3px">
          <button class="ib e" onclick="openModal('${t.type}',${t.id})"><i class="fa fa-pen"></i></button>
          <button class="ib d" onclick="delTxn(${t.id})"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    </div>`;
    }).join('');
}
['ts', 'tf-type', 'tf-cat', 'tf-month'].forEach(id => {
    document.getElementById(id).addEventListener('input', applyF);
    document.getElementById(id).addEventListener('change', applyF);
});
document.getElementById('cf-btn').addEventListener('click', () => {
    ['ts', 'tf-type', 'tf-cat', 'tf-month'].forEach(id => document.getElementById(id).value = '');
    applyF();
});

// ═══════════════════════════════════════════════
// BUDGET
// ═══════════════════════════════════════════════
async function rbud() {
    const now = new Date();
    const ms = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('bml').textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const sel = document.getElementById('bc-sel');
    sel.innerHTML = CATS.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
    const grid = document.getElementById('bgrid');
    grid.innerHTML = `<div class="es" style="grid-column:1/-1"><i class="fa fa-spinner fa-spin"></i><p>Loading…</p></div>`;
    try {
        const buds = await api('GET', '/budgets');
        if (!buds.length) { grid.innerHTML = `<div class="es" style="grid-column:1/-1"><i class="fa fa-bullseye"></i><p>No budgets set. Add one above!</p></div>`; return; }
        const txns = ALL_TXN;
        grid.innerHTML = buds.map(b => {
            const c = gc(b.category);
            const sp = txns.filter(t => t.type === 'expense' && t.category === b.category && t.date.startsWith(ms)).reduce((s, t) => s + t.amount, 0);
            const pct = Math.min(100, (sp / b.monthly_limit) * 100);
            const bc = pct >= 90 ? 'over' : pct >= 70 ? 'warn' : 'safe';
            const rem = b.monthly_limit - sp;
            const st = pct >= 100 ? `⚠️ Over by ${fmt(Math.abs(rem))}` : pct >= 70 ? `⚠️ ${fmt(rem)} left` : `✅ ${fmt(rem)} left`;
            return `<div class="bca">
        <div class="bch">
          <div class="l">
            <div class="tci" style="background:${c.color}22;color:${c.color};font-size:.95rem;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${c.icon}</div>
            <div><div class="cl2">${c.name}</div><div class="cs2">Limit: ${fmt(b.monthly_limit)}</div></div>
          </div>
          <button class="ib d" onclick="delBud(${b.id})"><i class="fa fa-trash"></i></button>
        </div>
        <div class="pw"><div class="pb ${bc}" style="width:${pct}%"></div></div>
        <div class="bm"><span>${st}</span><span class="bb">${fmt(sp)} / ${fmt(b.monthly_limit)}</span></div>
      </div>`;
        }).join('');
    } catch (e) { grid.innerHTML = `<div class="es" style="grid-column:1/-1"><i class="fa fa-circle-exclamation"></i><p>${e.message}</p></div>`; }
}
document.getElementById('sb-btn').addEventListener('click', async () => {
    const c = document.getElementById('bc-sel').value;
    const l = parseFloat(document.getElementById('bl-inp').value);
    if (!l || l <= 0) { toast('Enter a valid limit', 'error'); return; }
    try {
        await api('POST', '/budgets', { category: c, monthly_limit: l });
        document.getElementById('bl-inp').value = '';
        toast('Budget saved!', 'success'); rbud();
    } catch (e) { toast(e.message, 'error'); }
});

// ═══════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════
function rrep() {
    const all = ALL_TXN;
    rTrend(all); rCatB(all.filter(t => t.type === 'expense'));
    rTopC(all.filter(t => t.type === 'expense')); rMonSum(all);
}
function rTrend(all) {
    dch('t'); const c = cclrs(); const ms = l6m();
    const iD = ms.map(m => all.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
    const eD = ms.map(m => all.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0));
    const lb = ms.map(m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleString('default', { month: 'short' }); });
    CHARTS['t'] = new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: lb, datasets: [
                { label: 'Income', data: iD, borderColor: c.inc, backgroundColor: c.inc + '20', fill: true, tension: .4, pointBackgroundColor: c.inc, pointRadius: 4 },
                { label: 'Expense', data: eD, borderColor: c.exp, backgroundColor: c.exp + '20', fill: true, tension: .4, pointBackgroundColor: c.exp, pointRadius: 4 },
            ]
        },
        options: {
            responsive: true, plugins: { legend: { labels: { color: c.text, font: { family: 'DM Sans' } } } },
            scales: { x: { grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { color: c.grid }, ticks: { color: c.text, callback: v => CUR + v } } }
        }
    });
}
function rCatB(exp) {
    dch('cb'); const c = cclrs();
    const cm = {}; exp.forEach(t => { cm[t.category] = (cm[t.category] || 0) + t.amount; });
    const s = Object.entries(cm).sort((a, b) => b[1] - a[1]); if (!s.length) return;
    const cats = s.map(([n]) => gc(n));
    CHARTS['cb'] = new Chart(document.getElementById('catChart'), {
        type: 'pie',
        data: { labels: s.map(([n]) => n), datasets: [{ data: s.map(([, v]) => v), backgroundColor: cats.map(c => c.color + 'cc'), borderColor: cats.map(c => c.color), borderWidth: 2 }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: c.text, font: { family: 'DM Sans' }, boxWidth: 11, padding: 7 } } } }
    });
}
function rTopC(exp) {
    const cm = {}; exp.forEach(t => { cm[t.category] = (cm[t.category] || 0) + t.amount; });
    const tot = exp.reduce((s, t) => s + t.amount, 0);
    const s = Object.entries(cm).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const el = document.getElementById('top-cats');
    if (!s.length) { el.innerHTML = `<div class="es"><i class="fa fa-chart-bar"></i><p>No expense data yet.</p></div>`; return; }
    el.innerHTML = s.map(([n, v]) => { const c = gc(n); const p = tot ? ((v / tot) * 100).toFixed(1) : 0; return `<div class="sr"><div class="sc2" style="background:${c.color}"></div><span class="sn2">${c.icon} ${n}</span><span class="sv">${fmt(v)}</span><span class="sp">${p}%</span></div>`; }).join('');
}
function rMonSum(all) {
    const ms = l6m().reverse();
    document.getElementById('mon-sum').innerHTML = ms.map(m => {
        const inc = all.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0);
        const exp = all.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0);
        const net = inc - exp; const [y, mo] = m.split('-');
        const lb = new Date(y, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
        return `<div class="sr" style="flex-direction:column;align-items:flex-start;gap:4px">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
        <span style="font-weight:600;font-size:.84rem">${lb}</span>
        <span style="font-weight:700;font-size:.84rem;color:${net >= 0 ? 'var(--income)' : 'var(--expense)'}">${net >= 0 ? '+' : ''}${fmt(net)}</span>
      </div>
      <div style="display:flex;gap:12px;font-size:.73rem;color:var(--text3)">
        <span>In:<strong style="color:var(--income)"> ${fmt(inc)}</strong></span>
        <span>Out:<strong style="color:var(--expense)"> ${fmt(exp)}</strong></span>
      </div>
    </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════
// CSV EXPORT
// ═══════════════════════════════════════════════
document.getElementById('exp-btn').addEventListener('click', () => {
    if (!ALL_TXN.length) { toast('No data to export', 'error'); return; }
    const h = ['ID', 'Type', 'Category', 'Amount', 'Description', 'Date'];
    const r = ALL_TXN.map(t => [t.id, t.type, t.category, t.amount, `"${t.note.replace(/"/g, '""')}"`, t.date]);
    const csv = [h, ...r].map(x => x.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `expenses-${UNAME.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); toast('CSV exported!', 'success');
});

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════
document.getElementById('ss-btn').addEventListener('click', async () => {
    const nm = document.getElementById('s-name').value.trim() || UNAME;
    const cu = document.getElementById('s-cur').value;
    const th = document.documentElement.getAttribute('data-theme');
    try {
        await api('PUT', '/settings', { fullname: nm, currency: cu, theme: th });
        CU.fullname = nm; CU.currency = cu; UNAME = nm; CUR = cu;
        document.getElementById('sun').textContent = UNAME;
        document.getElementById('sav').textContent = UNAME.charAt(0).toUpperCase();
        updCSym(); toast('Settings saved!', 'success'); rfAll();
    } catch (e) { toast(e.message, 'error'); }
});

document.getElementById('cpw-btn').addEventListener('click', async () => {
    const cp = document.getElementById('cp').value;
    const np = document.getElementById('np').value;
    if (!cp || !np) { toast('Fill both password fields', 'error'); return; }
    try {
        await api('PUT', '/settings/password', { current_password: cp, new_password: np });
        document.getElementById('cp').value = ''; document.getElementById('np').value = '';
        toast('Password updated!', 'success');
    } catch (e) { toast(e.message, 'error'); }
});

document.getElementById('clr-btn').addEventListener('click', async () => {
    if (!confirm('Delete ALL your transactions and budgets?')) return;
    if (!confirm('This cannot be undone. Confirm?')) return;
    try {
        await api('DELETE', '/transactions'); await api('DELETE', '/budgets');
        toast('All data cleared', 'error'); await rfAll();
    } catch (e) { toast(e.message, 'error'); }
});

document.getElementById('del-acc-btn').addEventListener('click', async () => {
    const pw = prompt('Enter your password to confirm account deletion:');
    if (!pw) return;
    try {
        await api('DELETE', '/account', { password: pw });
        toast('Account deleted', 'error');
        setTimeout(doLogout, 1000);
    } catch (e) { toast(e.message, 'error'); }
});

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function updCSym() { document.querySelectorAll('.csym').forEach(e => e.textContent = CUR); }
function popChips() {
    document.getElementById('cat-chips').innerHTML = CATS.map(c =>
        `<div class="chip" style="border-color:${c.color}44;color:${c.color}">${c.icon} ${c.name}</div>`
    ).join('');
}
function popCatSelects() {
    const o = CATS.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
    ['txn-cat', 'bc-sel'].forEach(id => { const e = document.getElementById(id); if (e) e.innerHTML = o; });
}

// ═══════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════
function toast(m, t = 'success') {
    const c = document.getElementById('tc');
    const el = document.createElement('div'); el.className = `toast ${t}`;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    el.innerHTML = `<i class="fa ${icons[t] || 'fa-circle-info'}"></i> ${m}`;
    c.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(16px)'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 2500);
}

// ═══════════════════════════════════════════════
// KEYBOARD
// ═══════════════════════════════════════════════
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.getElementById('txn-modal').classList.contains('open')) document.getElementById('msave').click();
        else if (!CU) { if (document.getElementById('form-login').classList.contains('active')) doLogin(); else doRegister(); }
    }
});
['login-u', 'login-p'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));
['reg-n', 'reg-u', 'reg-p', 'reg-c'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); }));

// ═══════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════
restoreSession();
