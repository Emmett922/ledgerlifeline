import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    useEffect(() => {
        // Check if the user is already logged in and has accidentally went to the login page
        const storedUser = localStorage.getItem("user");

        // If user is logged in, redirect to dashboard
        if (storedUser) {
            navigate("/dashboard", { replace: true });
        } else {
            // Make sure localStorage is clear for new login
            localStorage.removeItem("user");
        }

        const userCreationResult = localStorage.getItem("userCreated");
        if (userCreationResult) {
            toast(
                "User creation successful! Please wait for an admin to view your user creation request! If accepted, you will be emailed with your username and a link to login.",
                {
                    style: {
                        backgroundColor: "#333",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                    },
                    progressStyle: {
                        backgroundColor: "#2196f3", // Solid blue color for progress bar
                        backgroundImage: "none",
                    },
                    closeButton: <CustomCloseButton />,
                }
            );
            setTimeout(() => {
                localStorage.removeItem("userCreated");
            }, 500);
        }

        // Initialize failedLoginCounter if it doesn't exist
        localStorage.setItem("failedLoginCounter", 0);
    }, [navigate]);

    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare data to send
        const userData = { username, password };
        const API_URL = process.env.REACT_APP_API_URL;

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            console.log("Login Result:", result); // Log the result for debugging

            // Check if the username is correct
            if (!result.success) {
                if (result.type === 1) {
                    // Increment the failedLoginCounter if username doesn't exist
                    let failedLoginCounter =
                        parseInt(localStorage.getItem("failedLoginCounter"), 10) || 0;

                    failedLoginCounter++;
                    localStorage.setItem("failedLoginCounter", failedLoginCounter);

                    if (failedLoginCounter >= 3) {
                        // Set suspension for the user
                        const suspensionEnd = Date.now() + 24 * 60 * 60 * 1000; // 1 day
                        const updateResponse = await fetch(`${API_URL}/users/suspended`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: userData.username,
                                isSuspended: true,
                                start: Date.now(),
                                end: suspensionEnd,
                            }),
                        });

                        const updateResult = await updateResponse.json();
                        toast(`${updateResult.message}`, {
                            style: {
                                backgroundColor: "#333",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "bold",
                            },
                            progressStyle: {
                                backgroundColor: "#2196f3", // Solid blue color for progress bar
                                backgroundImage: "none",
                            },
                            closeButton: <CustomCloseButton />,
                        });
                    }
                }
                toast(`${result.message}`, {
                    style: {
                        backgroundColor: "#333",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                    },
                    progressStyle: {
                        backgroundColor: "#2196f3", // Solid blue color for progress bar
                        backgroundImage: "none",
                    },
                    closeButton: <CustomCloseButton />,
                });
                return;
            } else {
                // Successful login actions
                // Now fetch the user details including password expiration
                const userResponse = await fetch(
                    `${API_URL}/users/user-by-username?username=${username}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const userDetails = await userResponse.json();
                console.log("User Details:", userDetails); // Log user details for debugging

                if (!userResponse.ok || !userDetails) {
                    alert("Failed to retrieve user details.");
                    return;
                }

                const userToStore = {
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    username: userDetails.username,
                    role: userDetails.role,
                    email: userDetails.email,
                    active: userDetails.active,
                    passwordExpiration: userDetails.password
                        ? userDetails.password.expiresAt
                        : null,
                };

                localStorage.setItem("user", JSON.stringify(userToStore));

                // Store a success message in localStorage
                localStorage.setItem(
                    "toastMessage",
                    `Login successful! Welcome ${userDetails.username}`
                );

                // Check user status
                if (userDetails.role === "Employee" && !userDetails.active) {
                    toast(
                        "Your user creation request has not yet been accepted. Please wait for an admin to accept your user request to login.",
                        {
                            style: {
                                backgroundColor: "#333",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "bold",
                            },
                            progressStyle: {
                                backgroundColor: "#2196f3", // Solid blue color for progress bar
                                backgroundImage: "none",
                            },
                            closeButton: <CustomCloseButton />,
                        }
                    );
                    return;
                } else if (!userDetails.active) {
                    toast("Your account is currently deactivated!", {
                        style: {
                            backgroundColor: "#333",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                        },
                        progressStyle: {
                            backgroundColor: "#2196f3", // Solid blue color for progress bar
                            backgroundImage: "none",
                        },
                        closeButton: <CustomCloseButton />,
                    });
                    return;
                } else if (
                    userDetails.suspended &&
                    userDetails.suspended.start_date &&
                    userDetails.suspended.end_date
                ) {
                    const now = Date.now();
                    if (now < userDetails.suspended.end_date) {
                        alert("Your account is currently suspended. Please try again later.");
                        toast("Your account is currently suspended. Please try again later.", {
                            style: {
                                backgroundColor: "#333",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: "bold",
                            },
                            progressStyle: {
                                backgroundColor: "#2196f3", // Solid blue color for progress bar
                                backgroundImage: "none",
                            },
                            closeButton: <CustomCloseButton />,
                        });
                        return;
                    }
                }

                // Redirect to the dashboard
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Check if both username and password are filled
    const isButtonDisabled = !(username && password);

    const content = (
        <section className="login">
            <ToastContainer />
            <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
            <div className="img-heading"></div>
            <div className="login-container">
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            title="Enter username"
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
                            title="Enter password"
                            value={password}
                            onChange={handleInputChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="login-forgot">
                        <button type="submit" className="submit-btn" title="Login to application" disabled={isButtonDisabled}>
                            Login
                        </button>
                        <Link className="forgot" to="forgot-password" title="Change password">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
            <div className="actions">
                <Link className="register-link" title="Create a new user request" to="register">
                    <p>New User</p>
                </Link>
            </div>
        </section>
    );
    return content;
};

export default Login;
