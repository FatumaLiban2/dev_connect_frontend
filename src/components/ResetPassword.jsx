import { useEffect, useState } from "react";
import "../styles/Authentication.css";

export default function ResetPasswordModal({ isOpen, onClose, onSwitchToSignin }) {
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [email, setEmail] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setCurrentStep(1);
			setEmail("");
			setVerificationCode("");
			setNewPassword("");
			setConfirmPassword("");
			setErrorMessage("");
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const clearError = () => {
		setErrorMessage("");
	};

	const handleClose = () => {
		setCurrentStep(1);
		setEmail("");
		setVerificationCode("");
		setNewPassword("");
		setConfirmPassword("");
		setErrorMessage("");
		onClose?.();
	};

	const handleSendResetCode = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		clearError();

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(email)) {
			setErrorMessage("Please enter a valid email address");
			setIsLoading(false);
			return;
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setCurrentStep(2);
		} catch (error) {
			setErrorMessage("Failed to send reset code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		clearError();

		if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
			setErrorMessage("Please enter a valid 6-digit code");
			setIsLoading(false);
			return;
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setCurrentStep(3);
		} catch (error) {
			setErrorMessage("Invalid verification code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		clearError();

		if (newPassword.length < 8) {
			setErrorMessage("Password must be at least 8 characters long");
			setIsLoading(false);
			return;
		}

		if (newPassword !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			alert("Password reset successful! Please sign in with your new password.");
			onSwitchToSignin?.();
		} catch (error) {
			setErrorMessage("Failed to reset password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = async () => {
		setIsLoading(true);
		clearError();
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Verification code resent to your email!");
		} catch (error) {
			setErrorMessage("Failed to resend code");
		} finally {
			setIsLoading(false);
		}
	};

	const renderEmailStep = () => (
		<div className="auth-form-wrapper">
			<h2>Reset Your Password</h2>
			<p style={{ color: "#6b7280", marginBottom: "24px" }}>
				Enter your email address and reset your password.
			</p>
			<form className="auth-form" onSubmit={handleSendResetCode}>
				<div className="input-group">
					<input
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							clearError();
						}}
						required
						disabled={isLoading}
					/>
				</div>
				{errorMessage && (
					<p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
						{errorMessage}
					</p>
				)}
				<button type="submit" className="auth-submit-btn" disabled={isLoading}>
					{isLoading ? "SENDING..." : "SEND VERIFICATION CODE"}
				</button>
			</form>
			<p className="auth-redirect">
				Remember your password?
				<button type="button" onClick={onSwitchToSignin} className="auth-link-btn">
					SIGN IN
				</button>
			</p>
		</div>
	);

	const renderCodeStep = () => (
		<div className="auth-form-wrapper">
			<h2>Enter Verification Code</h2>
			<p style={{ color: "#6b7280", marginBottom: "24px" }}>
				We&apos;ve sent a 6-digit code to <strong>{email}</strong>. Please check your email.
			</p>
			<form className="auth-form" onSubmit={handleVerifyCode}>
				<div className="input-group">
					<input
						type="text"
						placeholder="000000"
						value={verificationCode}
						onChange={(event) => {
							setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
							clearError();
						}}
						maxLength="6"
						required
						disabled={isLoading}
						style={{ textAlign: "center", fontSize: "20px", letterSpacing: "8px", fontWeight: "bold" }}
					/>
				</div>
				{errorMessage && (
					<p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
						{errorMessage}
					</p>
				)}
				<button type="submit" className="auth-submit-btn" disabled={isLoading}>
					{isLoading ? "VERIFYING..." : "VERIFY CODE"}
				</button>
				<div style={{ textAlign: "center", marginTop: "16px" }}>
					<button type="button" onClick={handleResendCode} className="auth-link-btn" disabled={isLoading}>
						Didn&apos;t receive the code? Resend
					</button>
				</div>
			</form>
			<p className="auth-redirect">
				Want to try a different email?
				<button type="button" onClick={() => setCurrentStep(1)} className="auth-link-btn">
					GO BACK
				</button>
			</p>
		</div>
	);

	const renderPasswordStep = () => (
		<div className="auth-form-wrapper">
			<h2>Create New Password</h2>
			<p style={{ color: "#6b7280", marginBottom: "24px" }}>
				Your email has been verified. Please create a new secure password.
			</p>
			<form className="auth-form" onSubmit={handleResetPassword}>
				<div className="input-group">
					<input
						type="password"
						placeholder="New Password"
						value={newPassword}
						onChange={(event) => {
							setNewPassword(event.target.value);
							clearError();
						}}
						required
						disabled={isLoading}
					/>
				</div>
				<div className="input-group">
					<input
						type="password"
						placeholder="Confirm New Password"
						value={confirmPassword}
						onChange={(event) => {
							setConfirmPassword(event.target.value);
							clearError();
						}}
						required
						disabled={isLoading}
					/>
				</div>
				{errorMessage && (
					<p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
						{errorMessage}
					</p>
				)}
				<p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
					Password must be at least 8 characters long
				</p>
				<button type="submit" className="auth-submit-btn" disabled={isLoading}>
					{isLoading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
				</button>
			</form>
		</div>
	);

	return (
		<div className="auth-modal-overlay" onClick={handleClose}>
			<div className="auth-page-container" onClick={(event) => event.stopPropagation()}>
				<div className="auth-card" style={{ maxWidth: "500px", margin: "0 auto", position: "relative" }}>
					<button type="button" className="auth-modal-close" onClick={handleClose}>
						×
					</button>
					<div className="auth-right-panel" style={{ flex: "none", width: "100%" }}>
						{currentStep === 1 && renderEmailStep()}
						{currentStep === 2 && renderCodeStep()}
						{currentStep === 3 && renderPasswordStep()}
					</div>
				</div>
			</div>
		</div>
	);
}
