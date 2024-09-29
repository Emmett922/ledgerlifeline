import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import Users from "./components/admin/Users";
import Dashboard from "./components/home/Dashboard";
import AcceptRequest from "./components/splash/AcceptRequest";
import Accounts from "./components/home/Accounts";
import ChartOfAccounts from "./components/home/ChartOfAccounts";

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
            case "/accounts":
                document.title = "Accounts - Ledger Lifeline";
                break;
            case "/chart-of-accounts":
                document.title = "Accounts - Ledger Lifeline";
                break;
            default:
                document.title = "Ledger Lifeline";
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
                <Route path="accounts" element={<Accounts />} />
                <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
            </Route>
        </Routes>
    );
}

export default App;
