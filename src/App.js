import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";

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
            </Route>
        </Routes>
    );
}

export default App;
