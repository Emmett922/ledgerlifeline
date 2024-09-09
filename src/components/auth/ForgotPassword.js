import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/ForgotPassword.css";

const ForgotPassword = () => {
    const content = (
        <section className="forgotPassword">
            <div className="forgot-password-container">
                <form id="forgotPasswordForm" action="/" method="POST">
                    <h2>Forgot Password</h2>
                    <div className="forgot-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="forgot-input-group">
                        <label htmlFor="userID">Username</label>
                        <input
                            type="text"
                            id="userID"
                            name="userID"
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="forgot-input-group">
                        <label htmlFor="securityQuestion1">
                            Security Question: What is your mother's maiden name?
                        </label>
                        <input
                            type="text"
                            id="securityQuestion1"
                            name="securityQuestion1"
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
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <div className="forgot-input-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" className="forgot-submit-btn">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
    return content;
};

export default ForgotPassword;
