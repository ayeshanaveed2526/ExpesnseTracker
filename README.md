# FinPulse — Premium Personal Finance & Budget Tracker

FinPulse is an elegant, lightning-fast, and professional personal finance hub built with React 19, Tailwind CSS v4, and Chart.js. It features glassmorphic widgets, interactive cash flow charts, category budget thresholds, transaction ledger searches, and local backups.

---

## ✨ Key Standout Features

### 🤖 FinPulse AI Coach & Advisor
* **Interactive Conversational AI**: A floating chat assistant drawer that analyzes your transaction patterns and budgets directly in the browser (100% private, client-side execution).
* **Detailed Spending Insights**: Ask the AI coach to *"Analyze my spending"* to get a real-time breakdown of your income, expenditures, and category percentages.
* **Affordability Calculator**: Ask *"Can I afford to buy a laptop for Rs. 40,000?"* and the coach will cross-reference your net balance and savings target, presenting a risk-assessment ratio.
* **Budget Tracker integration**: Flags when you are nearing or exceeding limits and outputs tailored suggestions (e.g. food expenditure reductions).

### 📈 Real-Time Financial Health Score
* **Dynamic Grading**: Calculates an overall score from 0-100 and assigns a letter grade (`A+` to `D`) indicating financial health.
* **Smart Scoring Metrics**:
  * **Cash Flow Health**: Evaluates income-to-spending ratios.
  * **Budget Discipline**: Penalizes score for each category budget threshold broken.
  * **Savings Rate**: Evaluates progress against your monthly savings target.

### 👤 Profile Name Customization & Onboarding
* **Interactive Onboarding Modal**: Greets new users on initial load with a glassmorphic onboarding modal to set their profile name.
* **Personalized Dashboard Greeting**: Greets you dynamically in the main header (e.g., `Hi, John 👋`).
* **Manageable in Settings**: Edit or change your name at any time from the preferences hub.

### 📋 Interactive Budget Limits Manager (CRUD)
* **Start Clean**: The app loads with **no pre-existing mock budget limits or expenses**, giving you a clean slate.
* **Add & Delete Budget Limits**: Configure limits for individual categories (`Food`, `Transport`, `Housing`) and remove them when no longer required.
* **Visual Warning Meters**: Color-coded progress meters update dynamically (🟢 **On Track**, 🟡 **Near Limit** at 80%, 🔴 **Over Budget**).

### 📅 Stable Date Sorting & Parsing
* **Standardized ISO Dates**: Stored in robust `YYYY-MM-DD` formats to eliminate cross-browser date-parsing bugs and timezone shifts.
* **Stable Tie-Breakers**: Oldest and Newest sorting orders now utilize transaction creation timestamps (`id`) as secondary tie-breakers for flawless chronological listing.

### ☀️ Polished Theme Adaptability (Dark/Light Modes)
* Fully optimized light mode using CSS variable mappings (`bg-surface`, `bg-surface-bright`, `border-main`) to prevent input text color clashes and ensure high-contrast readability.

---

## 🛠️ Architecture & Modules

The project is structured logically around decoupled widgets:

- **[App.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/App.jsx)**: Main orchestration component handling layout, background blooms, onboarding triggers, and state configurations.
- **[AiCoach.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/AiCoach.jsx)**: Implements the floating AI conversational chatbot and Financial Health Score gauge.
- **[Summary.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/Summary.jsx)**: Render engine for balance, spending, and savings indicators.
- **[ExpenseChart.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/ExpenseChart.jsx)**: Handles chart.js tabs for category distributions and cash flow trends.
- **[Budgets.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/Budgets.jsx)**: Manages budget creation, editing, deletion, and threshold warning states.
- **[Transactions.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/Transactions.jsx)**: Coordinates searching, sorting, filters, and CSV downloads.
- **[ExpenseItem.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/ExpenseItem.jsx)**: Formats list entries, badges, category config colors, and delete actions.
- **[ExpenseForm.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/ExpenseForm.jsx)**: Modernized transaction entry overlay with inputs and validation.
- **[Settings.jsx](file:///c:/Users/PMLS/Desktop/expense-tracker/src/components/Settings.jsx)**: Coordinates preference switches, JSON backup files, and database wipes.
- **[index.css](file:///c:/Users/PMLS/Desktop/expense-tracker/src/index.css)**: Custom animations, core styles, and smooth scrollbar layout tokens.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Development Server
Run the local hot-reload environment:
```bash
npm run dev
```

### 3. Production Compilation
Compile code into optimized production assets:
```bash
npm run build
```

### 4. Code Quality & Lint Checks
Perform quality assurance static code review:
```bash
npm run lint
```