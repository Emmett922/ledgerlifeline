import { useState } from "react";
import "./styles/Register.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [dob, setDOB] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");

    // Password validation states
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        startsWithLetter: false,
        hasLetter: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    // Validate Password function
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const startsWithLetter = /^[a-zA-Z]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^*()<>?":{}|<>]/.test(password);

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
        if (name === "firstName") {
            setFirstName(value);
        } else if (name === "lastName") {
            setLastName(value);
        } else if (name === "address") {
            setAddress(value);
        } else if (name === "dob") {
            setDOB(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
            // Call validatePassword whenever the password changes
            validatePassword(value);

            // Clear confirm password if password is cleared
            if (!value) {
                setConfirmPassword("");
            }
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else if (name === "securityQuestion") {
            setSecurityQuestion(value);
            if (value === "") {
                // Clear answer if no question is selected
                setSecurityAnswer("");
            }
        } else if (name === "securityAnswer") {
            setSecurityAnswer(value);
        }
    };

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log("Form submitted with:", {
            firstName,
            lastName,
            address,
            dob,
            email,
            password,
            confirmPassword,
            securityQuestion,
            securityAnswer,
        });
    };

    // Check if passwords match
    const passwordMatch = password === confirmPassword;

    // Check if all fields are filled
    const isButtonDisabled = !(
        firstName &&
        lastName &&
        address &&
        dob &&
        email &&
        password &&
        confirmPassword &&
        passwordMatch &&
        isPasswordValid &&
        securityQuestion &&
        securityAnswer
    );

    const content = (
        <section className="register">
            <img className="logo" src="" alt="LedgerLifeline Logo" />
            <div className="register-page-container">
                <form id="registerForm" onSubmit={handleSubmit}>
                    <h2>Create New Account</h2>
                    <div className="register-input-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={address}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your address"
                        />
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={dob}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter password"
                            className={password ? (isPasswordValid ? "valid" : "invalid") : ""}
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
                    <div className="register-input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            onFocus={(event) => event.target.select()} // Selects entire value of field on focus
                            required
                            placeholder="Confirm password"
                            disabled={!isPasswordValid} // Disable until password is filled
                            // If user input does not match password, set classname to mismatch
                            // Else, set classname to match
                            className={
                                confirmPassword ? (passwordMatch ? "match" : "mismatch") : ""
                            }
                        />
                        {confirmPassword && ( // Status message for confirmPassowrd
                            <p
                                className={`password-message ${
                                    passwordMatch ? "match" : "mismatch"
                                }`}
                            >
                                {passwordMatch ? "Matches password" : "Does not match password"}
                            </p>
                        )}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="securityQuestion">Security Question</label>
                        <select
                            id="securityQuestion"
                            name="securityQuestion"
                            value={securityQuestion}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a security question</option>
                            <option value="What is your mother's maiden name?">
                                What is your mother's maiden name?
                            </option>
                            <option value="What was the name of your first pet?">
                                What was the name of your first pet?
                            </option>
                            <option value="What was the name of your elementary school?">
                                What was the name of your elementary school?
                            </option>
                            <option value="What is your favorite book?">
                                What is your favorite book?
                            </option>
                        </select>
                    </div>
                    {securityQuestion && (
                        <div className="register-input-group">
                            <label htmlFor="securityAnswer">Answer</label>
                            <input
                                type="text"
                                id="securityAnswer"
                                name="securityAnswer"
                                value={securityAnswer}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter answer to security question"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="register-submit-btn"
                        disabled={isButtonDisabled}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
    return content;
};

export default Register;
