import { useState } from "react";
import "./styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log("Form submitted with:", {
            email,
            securityAnswer,
            newPassword,
            confirmNewPassword,
        });
    };

    // Check if passwords match
    const passwordMatch = newPassword === confirmNewPassword;

    // Check if all fields are filled
    const isButtonDisabled = !(
        email &&
        securityAnswer &&
        newPassword &&
        confirmNewPassword &&
        isPasswordValid &&
        passwordMatch
    );

    const content = (
        <section className="forgotPassword">
            <div className="forgot-password-container">
                <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                    <h2>Forgot Password</h2>
                    <div className="forgot-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="forgot-input-group">
                        <label htmlFor="securityAnswer">
                            Security Question: Gathered from the database
                        </label>
                        <input
                            type="text"
                            id="securityAnswer"
                            name="securityAnswer"
                            value={securityAnswer}
                            onChange={handleInputChange}
                            required
                            placeholder="Answer"
                        />
                    </div>
                    <div className="forgot-input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your new password"
                            className={newPassword ? (isPasswordValid ? "valid" : "invalid") : ""}
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
                                - Continas a special character
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
                            onFocus={(event) => event.target.select()} // Selects entire value of field on focus
                            required
                            placeholder="Confirm new password"
                            disabled={!isPasswordValid} // Disable until password is filled
                            // If user input does not match password, set classname to mismatch
                            // Else, set classname to match
                            className={
                                confirmNewPassword ? (passwordMatch ? "match" : "mismatch") : ""
                            }
                        />
                        {confirmNewPassword && ( // Status message for confirmNewPassword
                            <p
                                className={`password-message ${
                                    passwordMatch ? "match" : "mismatch"
                                }`}
                            >
                                {passwordMatch ? "Matches password" : "Does not match password"}
                            </p>
                        )}
                    </div>
                    <button type="submit" className="forgot-submit-btn" disabled={isButtonDisabled}>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
    return content;
};

export default ForgotPassword;
