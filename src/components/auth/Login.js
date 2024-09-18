import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare data to send
        const userData = { username, password };

        // Get API url
        const API_URL = process.env.REACT_APP_API_URL;

        // Handle form submission here
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
                alert(`Welcome, ${result.user.first_name} ${result.user.last_name}!`);

                // Sotre user data in localStorage
                const userToStore = {
                    first_name: result.user.first_name,
                    last_name: result.user.last_name,
                    username: result.user.username,
                    role: result.user.role,
                    active: result.user.active,
                };

                localStorage.setItem('user', JSON.stringify(userToStore));

                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occured. Please try again.");
        }
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
