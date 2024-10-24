import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import Users from "./components/admin/Users";
import Dashboard from "./components/home/Dashboard";
import AcceptRequest from "./components/splash/AcceptRequest";
import ChartOfAccounts from "./components/home/ChartOfAccounts";
import EventLogs from "./components/home/EventLogs";
import AccountLedger from "./components/home/AccountLedger";
import Help from "./components/home/Help";
import Journalize from './components/home/Journalize';
import IncomeStatement from "./components/home/IncomeStatement";
import TrialBalance from "./components/home/TrialBalance";
import BalanceSheet from "./components/home/BalanceSheet";

function App() {
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                document.title = "Login - Ledger Lifeline";
                break;
            case "/register":
                document.title = "Register - Ledger Lifeline";
                break;
            case "/forgot-password":
                document.title = "Forgot Password - Ledger Lifeline";
                break;
            case "/users":
                document.title = "Users - Ledger Lifeline";
                break;
            case "/dashboard":
                document.title = "Dashboard - Ledger Lifeline";
                break;
            case "/accept-request":
                document.title = "Accept User Request - Ledger Lifeline";
                break;
            case "/chart-of-accounts":
                document.title = "Chart of Accounts - Ledger Lifeline";
                break;
            case "/event-logs":
                document.title = "Event Logs - Ledger Lifeline";
                break;
            case "/account-ledger":
                document.title = "Account Ledger - Ledger Lifeline";
                break;
            case "/help":
                document.title = "Help - Ledger Lifeline";
                break;
            case "/journalize":
                document.title = "Journalize - Ledger Lifeline";
                break;
            case "/income-statement":
                document.title = "Income Statement - Ledger Lifeline";
                break;
            case "/trial-balance":
                document.title = "Trial Balance - Ledger Lifeline";
                break;
            case "/balance-sheet":
                document.title = "Balance Sheet - Ledger Lifeline";
                break;
            default:
                document.title = "Ledger Lifeline";
        }

        if (location.pathname === "/register") {
            document.body.classList.add("overflow-auto");
        } else {
            document.body.classList.remove("overflow-auto");
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="users" element={<Users />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="accept-request/:username" element={<AcceptRequest />} />
                <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
                <Route path="event-logs" element={<EventLogs />} />
                <Route path="account-ledger" element={<AccountLedger />} />
                <Route path="help" element={<Help />} />
                <Route path="journalize" element={<Journalize />} />
                <Route path="income-statement" element={<IncomeStatement />} />
                <Route path="trial-balance" element={<TrialBalance />} />
                <Route path="balance-sheet" element={<BalanceSheet />} />
            </Route>
        </Routes>
    );
}

export default App;
