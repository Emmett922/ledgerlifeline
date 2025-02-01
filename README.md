# Ledger Lifeline Frontend

Welcome to the frontend codebase of **Ledger Lifeline**, an accounting software application designed to virtualize the bookkeeping process. This repository contains the React-based frontend for managing accounting processes such as journalizing, posting entries to the ledger, generating financial statements, calculating financial ratios, and maintaining a chart of accounts. The frontend integrates seamlessly with the backend to provide a user-friendly and efficient experience.

The backend API codebase of **Ledger Lifeline** can be found [here](https://github.com/Emmett922/ledgerlifeline-api).

## Table of Contents

- [About the Application](#about-the-application)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
  - [Auth](#auth)
  - [Admin](#admin)
  - [Home](#home)

---

## About the Application

Ledger Lifeline virtualizes the bookkeeping process with a robust set of features:
- **Journalizing:** Record journal entries (regular, adjusting, and closing).
- **Ledger Posting:** Automatically post approved entries to the general ledger.
- **Financial Statements:** Generate Trial Balance, Income Statement, Balance Sheet, and Statement of Retained Earnings.
- **Chart of Accounts:** View all accounts, their balances, and activity logs.
- **Financial Ratios:** Display key ratios for accountants to analyze financial health.
- **User and Account Management:** Admin capabilities for user creation, account management, and viewing event logs.

---

## Features

### General User Features
- Login and registration with secure authentication.
- Access to the dashboard with financial ratios and pending journal entry notifications.
- Ability to view and interact with:
  - General Ledger
  - Chart of Accounts
  - Financial Statements
- Generate PDF reports for financial statements.

### Admin Features
- Manage user accounts (create, edit, suspend, deactivate).
- View user details and email users individually or collectively.
- Access to event logs for accounts, users, and login attempts.
- Track the history of expired passwords for users.

---

## Technology Stack

The application is built on the **MERN Stack**, with this frontend utilizing:
- **React.js**: For building dynamic and responsive UI components.
- **React Router**: For seamless navigation between pages.
- **Axios**: For API integration with the backend.
- **CSS Modules**: For component-level styling.

---

## Directory Structure

The frontend components are organized into subdirectories under `src/` for better maintainability and scalability:

### Auth
- **`Login.js`**: User login page with navigation to other auth pages.
- **`Register.js`**: Page for new users to register.
- **`ForgotPassword.js`**: Allows users to reset forgotten passwords.

### Admin
- **`User.js`**: Admin page for user management:
  - Create and edit users.
  - Suspend or deactivate user accounts.
  - Email users.
  - View user event logs and expired password history.

### Home
- **`AccountLedger.js`**: General ledger page showing:
  - Total balances of accounts with non-zero balances.
  - History of journal entries posted to the ledger.
- **`ChartOfAccounts.js`**: Displays the chart of accounts with balances and activity logs.
- **`Dashboard.js`**: Home page for all users:
  - Displays financial ratios for accountants.
  - Notification bar for pending journal entries.
- **`Journalize.js`**: General journal page for:
  - Recording journal entries (regular, adjusting, closing).
  - Attaching source documents.
  - Viewing a filterable history of entries by status (approved, denied, pending).
- **`EventLogs.js`**: Admin-exclusive page to view:
  - Snapshots of accounts, users, and login attempts.
- **Financial Statements**:
  - **`TrialBalance.js`**
  - **`IncomeStatement.js`**
  - **`BalanceSheet.js`**
  - **`StatRetainedEarnings.js`**
  - Each page displays the corresponding financial statement and allows PDF generation.
- **`Help.js`**: Basic help page with application information.
