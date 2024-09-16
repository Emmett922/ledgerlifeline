import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const API_URL = process.env.REACT_APP_API_URL;

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

        // Handle form submission
        try {
            const response = await fetch(
                `${API_URL}/users/user-by-username?username=${encodeURIComponent(username)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Gather the result
            const result = await response.json();

            // If non error is returned, setUser with the gathered user
            // Else, alert the user with the error message
            if (response.ok && result.email === email) {
                setUser(result);
                const fetchedSecurityQuestion = result.securityQuestion.question;
                setSecurityQuestion(fetchedSecurityQuestion);
                setStep(2); // Move to step 2
            } else {
                alert("Incorrect username or email!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occured. Please try again.");
        }
    };
    const handleSubmitStep2 = (event) => {
        event.preventDefault();

        if (user.securityQuestion.answer === securityAnswer) {
            setStep(3);
        } else {
            alert("Incorrect answer!");
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
                alert(`${result.message}` || "Error!");
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
