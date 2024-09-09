import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log("Form submitted with:", { username, password });
    };

    // Check if both username and password are filled
    const isButtonDisabled = !(username && password);

    const content = (
        <section className="login">
            <img className="logo" src="" alt="LedgerLifeline Logo" />
            <div className="login-container">
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleInputChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="login-forgot">
                        <button type="submit" className="submit-btn" disabled={isButtonDisabled}>
                            Login
                        </button>
                        <Link className="forgot" to="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
            <div className="actions">
                <Link className="register-link" to="register">
                    <p>New User</p>
                </Link>
            </div>
        </section>
    );
    return content;
};

export default Login;
