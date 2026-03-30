<div align="center">

<!-- ANIMATED HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1b4332,50:2d6a4f,100:52b788&height=220&section=header&text=SmartExpense&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=💸%20Your%20Money.%20Your%20Rules.%20Your%20Dashboard.&descSize=18&descAlignY=55&descAlign=50" width="100%" />

<!-- BADGES -->
<p>
  <img src="https://img.shields.io/badge/version-2.0.0-52b788?style=for-the-badge&logo=semver&logoColor=white" />
  <img src="https://img.shields.io/badge/node-%3E%3D22.0-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge&logo=opensourceinitiative&logoColor=white" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/made%20with-❤️-red?style=for-the-badge" />
</p>

<!-- TYPING SVG -->
<a href="#">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=52B788&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Track+Every+Rupee+%F0%9F%92%B0;Visualize+Your+Spending+%F0%9F%93%8A" alt="Typing SVG" />
</a>

<br/>
<br/>

<!-- QUICK LINKS -->
<p>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/🚀-Quick_Start-2d6a4f?style=flat-square" /></a>
  <a href="#-features"><img src="https://img.shields.io/badge/✨-Features-40916c?style=flat-square" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/🛠️-Tech_Stack-1b4332?style=flat-square" /></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/🏗️-Architecture-264653?style=flat-square" /></a>
  <a href="#-contributing"><img src="https://img.shields.io/badge/🤝-Contributing-52b788?style=flat-square" /></a>
</p>

</div>

---

## 🤔 What is SmartExpense?

> **SmartExpense** is a sleek, full-stack personal finance manager that runs entirely on your machine. No cloud. No subscriptions. No data harvesting. Just **you** and **your money** — organized beautifully.

Built with **Node.js** and **native SQLite**, it gives you enterprise-grade expense tracking with a UI that slaps. Think of it as your personal CFO — minus the salary. 💅

<div align="center">
  <table>
    <tr>
      <td align="center">🔐</td>
      <td><strong>Multi-User Auth</strong><br/>Secure login with hashed passwords</td>
      <td align="center">📊</td>
      <td><strong>Real-time Charts</strong><br/>Interactive Chart.js dashboards</td>
    </tr>
    <tr>
      <td align="center">🎯</td>
      <td><strong>Budget Tracking</strong><br/>Category-wise monthly limits</td>
      <td align="center">🌗</td>
      <td><strong>Dark/Light Mode</strong><br/>Easy on the eyes, always</td>
    </tr>
    <tr>
      <td align="center">📱</td>
      <td><strong>Fully Responsive</strong><br/>Desktop, tablet, mobile</td>
      <td align="center">💾</td>
      <td><strong>100% Offline</strong><br/>Your data never leaves your PC</td>
    </tr>
  </table>
</div>

---

## 🚀 Quick Start

Get up and running in **under 60 seconds** ⚡

```bash
# 1. Clone the repo
git clone https://github.com/your-username/smartexpense.git
cd smartexpense

# 2. Install dependencies
npm install

# 3. Launch the app
npm start

For Direct run click: StartApp.vbs
```

Then open **[http://localhost:3001](http://localhost:3001)** in your browser and you're golden 🎉

> [!NOTE]
> **Requires Node.js v22+** (uses the built-in `node:sqlite` module — no external DB drivers needed!)

> [!TIP]
> First time? Register a new account on the auth screen. Your data lives in `expense.db` right next to `server.js`.

---

## ✨ Features

<div align="center">

### 📋 The Full Package

</div>

<table>
  <tr>
    <th>🏠 Dashboard</th>
    <th>💳 Transactions</th>
    <th>🎯 Budget Planner</th>
  </tr>
  <tr>
    <td>
      • Net balance overview<br/>
      • Income vs expense cards<br/>
      • Monthly bar chart<br/>
      • Category doughnut chart<br/>
      • Recent transactions feed
    </td>
    <td>
      • Full CRUD operations<br/>
      • Search & multi-filter<br/>
      • Filter by type/category/month<br/>
      • Edit & delete inline<br/>
      • Real-time total updates
    </td>
    <td>
      • Set per-category limits<br/>
      • Visual progress bars<br/>
      • Over-budget alerts ⚠️<br/>
      • Current month tracking<br/>
      • One-click budget removal
    </td>
  </tr>
  <tr>
    <th>📈 Reports & Analytics</th>
    <th>⚙️ Settings</th>
    <th>🔐 Authentication</th>
  </tr>
  <tr>
    <td>
      • 6-month trend line chart<br/>
      • Category pie breakdown<br/>
      • Top spending categories<br/>
      • Monthly summary table<br/>
      • CSV export 📥
    </td>
    <td>
      • Profile customization<br/>
      • Multi-currency support (₹$€£¥)<br/>
      • Theme toggle (dark/light)<br/>
      • Password change<br/>
      • Account & data deletion
    </td>
    <td>
      • Secure registration<br/>
      • Session-based login<br/>
      • Password hashing (SHA-256 + salt)<br/>
      • Username availability check<br/>
      • Password strength meter
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why? |
|:---:|:---|:---|
| <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js&logoColor=white" /> | **Node.js + Express** | Fast, minimal, battle-tested |
| <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" /> | **node:sqlite (native)** | Zero-config, file-based, blazing fast |
| <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-E34F26?style=flat-square&logo=html5&logoColor=white" /> | **Vanilla Stack** | No frameworks, no bloat, pure speed |
| <img src="https://img.shields.io/badge/Charts-Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" /> | **Chart.js 4** | Beautiful, responsive data visualization |
| <img src="https://img.shields.io/badge/Icons-Font%20Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white" /> | **Font Awesome 6** | 2000+ crispy icons |
| <img src="https://img.shields.io/badge/Fonts-Google%20Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white" /> | **Syne + DM Sans** | Modern, clean typography |
| <img src="https://img.shields.io/badge/Auth-express--session-000000?style=flat-square&logo=express&logoColor=white" /> | **express-session** | Secure cookie-based sessions |

</div>

---

## 🏗️ Architecture

```
smartexpense/
│
├── 📄 server.js              # Express server + API routes + SQLite setup
├── 📄 package.json            # Dependencies & scripts
├── 📄 expense.db              # SQLite database (auto-created)
│
└── 📁 public/                 # Static frontend assets
    ├── 📄 index.html          # Single-page application shell
    ├── 📁 css/
    │   └── 🎨 style.css      # Complete design system + responsive styles
    └── 📁 js/
        └── ⚡ app.js          # Client-side logic, charts, state management
```

<details>
<summary><strong>🗄️ Database Schema (click to expand)</strong></summary>

```sql
┌─────────────────────────────────────────────────────┐
│  USERS                                              │
├─────────────────────────────────────────────────────┤
│  id            INTEGER PRIMARY KEY AUTOINCREMENT    │
│  fullname      TEXT NOT NULL                        │
│  username      TEXT UNIQUE NOT NULL                 │
│  password_hash TEXT NOT NULL                        │
│  salt          TEXT NOT NULL                        │
│  currency      TEXT DEFAULT '₹'                    │
│  theme         TEXT DEFAULT 'light'                 │
│  created_at    TEXT DEFAULT datetime('now')         │
└──────────────┬──────────────────────────────────────┘
               │ 1:N
┌──────────────▼──────────────────────────────────────┐
│  TRANSACTIONS                                       │
├─────────────────────────────────────────────────────┤
│  id         INTEGER PRIMARY KEY AUTOINCREMENT       │
│  user_id    INTEGER FK → users(id) ON DELETE CASCADE│
│  type       TEXT CHECK('income' | 'expense')        │
│  category   TEXT NOT NULL                           │
│  amount     REAL NOT NULL                           │
│  note       TEXT DEFAULT ''                         │
│  date       TEXT NOT NULL                           │
│  created_at TEXT DEFAULT datetime('now')            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  BUDGETS                                            │
├─────────────────────────────────────────────────────┤
│  id            INTEGER PRIMARY KEY AUTOINCREMENT    │
│  user_id       INTEGER FK → users(id)               │
│  category      TEXT NOT NULL                        │
│  monthly_limit REAL NOT NULL                        │
│  UNIQUE(user_id, category)                          │
└─────────────────────────────────────────────────────┘
```

</details>

<details>
<summary><strong>🔌 API Endpoints (click to expand)</strong></summary>

| Method | Endpoint | Auth? | Description |
|:---:|:---|:---:|:---|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Sign in |
| `POST` | `/api/auth/logout` | ❌ | Sign out |
| `GET` | `/api/auth/check/:username` | ❌ | Check username availability |
| `GET` | `/api/me` | ✅ | Get current user profile |
| `GET` | `/api/transactions` | ✅ | List all user transactions |
| `POST` | `/api/transactions` | ✅ | Create transaction |
| `PUT` | `/api/transactions/:id` | ✅ | Update transaction |
| `DELETE` | `/api/transactions/:id` | ✅ | Delete transaction |
| `DELETE` | `/api/transactions` | ✅ | Clear all transactions |
| `GET` | `/api/budgets` | ✅ | List all budgets |
| `POST` | `/api/budgets` | ✅ | Create/update budget |
| `DELETE` | `/api/budgets/:id` | ✅ | Delete budget |
| `DELETE` | `/api/budgets` | ✅ | Clear all budgets |
| `PUT` | `/api/settings` | ✅ | Update profile settings |
| `PUT` | `/api/settings/password` | ✅ | Change password |
| `DELETE` | `/api/account` | ✅ | Delete account permanently |

</details>

---

## 🎨 UI Vibes

<div align="center">

| 🌞 Light Mode | 🌙 Dark Mode |
|:---:|:---:|
| Clean, warm, earthy tones | Deep navy + mint accents |
| `#f5f4f0` background | `#0f1117` background |
| `#2d6a4f` primary accent | `#52b788` primary accent |

</div>

### 🧩 Design System Highlights

- **Typography**: `Syne` (headings) + `DM Sans` (body) — Google Fonts
- **Border Radius**: `14px` cards, `8px` buttons — soft & modern
- **Animations**: Fade-up page transitions, hover micro-interactions
- **Color Palette**: Nature-inspired greens with danger reds
- **Responsive**: Sidebar collapses to hamburger menu on mobile

---

## 📦 Categories

SmartExpense ships with **13 pre-configured categories** to get you started instantly:

<div align="center">

| | Category | | Category | | Category |
|:---:|:---|:---:|:---|:---:|:---|
| 🍔 | Food & Dining | 🚗 | Transport | 🛍️ | Shopping |
| 🎬 | Entertainment | 💊 | Health | ⚡ | Bills & Utils |
| 📚 | Education | ✈️ | Travel | 🏠 | Rent |
| 💼 | Salary | 💻 | Freelance | 📈 | Investment |
| 📦 | Other | | | | |

</div>

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---:|:---|
| `Esc` | Close modals |
| `Ctrl + Enter` | Submit form (login/register/save transaction) |
| `Enter` | Quick submit on auth fields |

---

## 🛡️ Security

> Your data stays on **YOUR machine**. Period.

- 🔒 **Passwords** are hashed with `SHA-256` + unique per-user salt
- 🍪 **Sessions** use `httpOnly` cookies with 7-day expiry
- 🛑 **Every API call** is scoped to the authenticated user's ID
- 💾 **Database** is a local `expense.db` file — no cloud, no telemetry
- 🗑️ **CASCADE deletes** ensure clean data removal when accounts are deleted

---

## 🗺️ Roadmap

<div align="center">

| Status | Feature |
|:---:|:---|
| ✅ | Multi-user authentication |
| ✅ | Full CRUD transactions |
| ✅ | Budget tracking with alerts |
| ✅ | Interactive charts & reports |
| ✅ | CSV export |
| ✅ | Dark/Light theme |
| ✅ | Multi-currency support |
| 🔜 | Recurring transactions |
| 🔜 | PDF report generation |
| 🔜 | Data import from CSV |
| 🔜 | PWA support (install as app) |
| 🔜 | Financial goal tracking |

</div>

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated** 🙏

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

> [!IMPORTANT]
> Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

```
MIT License — do whatever you want, just give credit 🤙
```

---

## 💖 Support

If SmartExpense helped you manage your money better, consider:

<div align="center">

⭐ **Star this repo** — it means a lot!

🐛 **Found a bug?** [Open an issue](../../issues)

💡 **Have an idea?** [Start a discussion](../../discussions)

</div>

---

<div align="center">

<!-- FOOTER WAVE -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1b4332,50:2d6a4f,100:52b788&height=120&section=footer" width="100%" />

<p>
  <strong>Built with 💚 by the SmartExpense Team</strong>
</p>

<p>
  <sub>✨ If you made it this far, you're a real one. Go track those expenses! ✨</sub>
</p>

<!-- VISITOR COUNTER -->
<img src="https://komarev.com/ghpvc/?username=smartexpense&label=repo%20views&color=2d6a4f&style=flat-square" />

</div>