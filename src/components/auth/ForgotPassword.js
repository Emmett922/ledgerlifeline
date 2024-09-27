import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/ForgotPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordHistory, setPasswordHistory] = useState([]);
    const [step, setStep] = useState(1);
    const API_URL = process.env.REACT_APP_API_URL;
    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    useEffect(() => {
        localStorage.setItem("failedEmailCounter", 0);
        localStorage.setItem("failedSecurityAnswer", 0);
    }, []);

    // Password validation states
    const [isPasswordValid, setIsPasswordValid] = useState("");
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        startsWithLetter: false,
        hasLetter: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    // Validate Password function
    const validatePassword = (newPassword) => {
        const minLength = newPassword.length >= 8;
        const startsWithLetter = /^[a-zA-Z]/.test(newPassword);
        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^*()<>?":{}|<>]/.test(newPassword);

        setPasswordRequirements({
            minLength,
            startsWithLetter,
            hasLetter,
            hasNumber,
            hasSpecialChar,
        });

        setIsPasswordValid(
            minLength && startsWithLetter && hasLetter && hasNumber && hasSpecialChar
        );
    };

    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "username") {
            setUsername(value);
        } else if (name === "securityAnswer") {
            setSecurityAnswer(value);
        } else if (name === "newPassword") {
            setNewPassword(value);
            // Call validatePassword whenever the password changes
            validatePassword(value);

            // Clear confirm new password if new password is cleared
            if (!value) {
                setConfirmNewPassword("");
            }
        } else if (name === "confirmNewPassword") {
            setConfirmNewPassword(value);
        }
    };

    // Handle form submissions for each step
    const handleSubmitStep1 = async (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            type: 0, // Ensure this is passed as a query parameter
        };

        try {
            const response = await fetch(
                `${API_URL}/users/user-by-username?username=${encodeURIComponent(username)}&type=${
                    userData.type
                }`, // Passing both username and type as query params
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Remove the body, GET requests shouldn't have a body
                }
            );

            const result = await response.json();

            if (response.ok && result.email === email) {
                setUser(result);
                setPasswordHistory(result.passwordHistory);
                const fetchedSecurityQuestion = result.question;
                setSecurityQuestion(fetchedSecurityQuestion);
                localStorage.setItem("failedEmailCounter", 0);
                setStep(2); // Move to step 2
            } else {
                let failedEmailCounter =
                    parseInt(localStorage.getItem("failedEmailCounter"), 10) || 0;

                failedEmailCounter++;
                localStorage.setItem("failedEmailCounter", failedEmailCounter);

                if (failedEmailCounter >= 3) {
                    // Set suspension for the user
                    const suspensionEnd = Date.now() + 24 * 60 * 60 * 1000; // 1 day
                    const updateResponse = await fetch(`${API_URL}/users/suspended`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
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
                } else {
                    toast("Incorrect username or email!", {
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
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleSubmitStep2 = async (event) => {
        event.preventDefault();

        if (user.answer === securityAnswer) {
            localStorage.setItem("failedSecurityAnswer", 0);
            setStep(3);
        } else {
            let failedSecurityAnswer =
                parseInt(localStorage.getItem("failedSecurityAnswer"), 10) || 0;

            failedSecurityAnswer++;
            localStorage.setItem("failedSecurityAnswer", failedSecurityAnswer);

            if (failedSecurityAnswer >= 3) {
                // Set suspension for the user
                const suspensionEnd = Date.now() + 24 * 60 * 60 * 1000; // 1 day
                const updateResponse = await fetch(`${API_URL}/users/suspended`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
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
            } else {
                toast("Incorrect answer!", {
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
    };
    const handleSubmitStep3 = async (event) => {
        event.preventDefault();

        // Handle form submission
        try {
            const response = await fetch(`${API_URL}/users/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    newPassword: newPassword,
                }),
            });

            const result = await response.json();

            if (response.status === 200) {
                setStep(4);
            } else {
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
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occured. Please try again.");
        }
    };

    // Check if passwords match
    const passwordMatch = newPassword === confirmNewPassword;

    // Check if all fields are filled
    const isButtonDisabled1 = !(email && username);
    const isButtonDisabled2 = !securityAnswer;
    const isButtonDisabled3 = !(newPassword && confirmNewPassword && passwordMatch);

    const content = (
        <section className="forgotPassword">
            <ToastContainer />
            <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
            <div className="img-heading"></div>
            <div className="forgot-password-container">
                {/* Step 1: Email and Username*/}
                {step === 1 && (
                    <form id="forgotPasswordForm" onSubmit={handleSubmitStep1}>
                        <h2>Forgot Password</h2>
                        <div className="forgot-input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="forgot-input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <button
                            type="submit"
                            className="forgot-submit-btn"
                            disabled={isButtonDisabled1}
                        >
                            Next
                        </button>
                    </form>
                )}

                {/* Step 2: Security Question */}
                {step === 2 && (
                    <form id="forgotPasswordForm" onSubmit={handleSubmitStep2}>
                        <h2>Security Question</h2>
                        <div className="forgot-input-group">
                            <label htmlFor="securityAnswer">
                                Security Question: {securityQuestion}
                            </label>
                            <input
                                type="text"
                                id="securityAnswer"
                                name="securityAnswer"
                                value={securityAnswer}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()}
                                required
                                placeholder="Answer"
                            />
                        </div>
                        <button
                            type="submit"
                            className="forgot-submit-btn"
                            disabled={isButtonDisabled2}
                        >
                            Next
                        </button>
                    </form>
                )}

                {/* Step 3: New Username and Password */}
                {step === 3 && (
                    <form id="forgotPasswordForm" onSubmit={handleSubmitStep3}>
                        <h2>Set New Password</h2>
                        <div className="forgot-input-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()}
                                required
                                placeholder="Enter new password"
                                className={
                                    newPassword ? (isPasswordValid ? "valid" : "invalid") : ""
                                }
                            />
                            <div className="password-requirements">
                                <p className={passwordRequirements.minLength ? "valid" : "invalid"}>
                                    - Minmum 8 characters
                                </p>
                                <p
                                    className={
                                        passwordRequirements.startsWithLetter ? "valid" : "invalid"
                                    }
                                >
                                    - Starts with a letter
                                </p>
                                <p className={passwordRequirements.hasLetter ? "valid" : "invalid"}>
                                    - Contains a letter
                                </p>
                                <p className={passwordRequirements.hasNumber ? "valid" : "invalid"}>
                                    - Contains a number
                                </p>
                                <p
                                    className={
                                        passwordRequirements.hasSpecialChar ? "valid" : "invalid"
                                    }
                                >
                                    - Contains a special character
                                </p>
                            </div>
                        </div>
                        <div className="forgot-input-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()}
                                required
                                placeholder="Confirm new password"
                                disabled={!isPasswordValid}
                                className={
                                    confirmNewPassword ? (passwordMatch ? "match" : "mismatch") : ""
                                }
                            />
                            {confirmNewPassword && (
                                <p
                                    className={`password-message ${
                                        passwordMatch ? "match" : "mismatch"
                                    }`}
                                >
                                    {passwordMatch ? "Matches password" : "Does not match password"}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="forgot-submit-btn"
                            disabled={isButtonDisabled3}
                        >
                            Submit
                        </button>
                    </form>
                )}

                {/* Step 4: Confirmation and login redirection */}
                {step === 4 && (
                    <form id="forgotPasswordForm">
                        <h2>Password Change Successful</h2>
                        <div className="forgot-input-group">
                            <p>Please try logging in with your new password.</p>
                        </div>
                        <Link to="/" className="forgot-submit-btn">
                            Login
                        </Link>
                    </form>
                )}
            </div>
        </section>
    );
    return content;
};

export default ForgotPassword;
