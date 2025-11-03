import { useEffect, useState } from "react";
import "../styles/Authentication.css";
import authIllustration from "../assets/authlogo.png";

export default function LoginModal({
	isOpen,
	onClose,
	onSwitchToSignup,
	onSwitchToForgotPassword,
	onSwitchToResetPassword,
}) {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
		if (!isOpen) {
			setFormData({ email: "", password: "" });
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Signing In with:", formData);
		alert("Welcome back! Check the console for the submitted data.");
		onClose?.();
	};

	return (
		<div className="auth-modal-overlay" onClick={onClose}>
			<div className="auth-page-container" onClick={(event) => event.stopPropagation()}>
				<button type="button" className="auth-modal-close" onClick={onClose}>
					×
				</button>
				<div className="auth-card">
					<div className="auth-left-panel">
						<div className="auth-logo">{`{•}`} DevConnect</div>
						<img
							src={authIllustration}
							alt="Community illustration"
							className="auth-illustration"
						/>
						<h1 className="auth-tagline">A Community Connecting Developers and Clients</h1>
					</div>
					<div className="auth-right-panel">
						<div className="auth-form-wrapper">
							<h2>Welcome Back!</h2>
							<form className="auth-form" onSubmit={handleSubmit}>
								<div className="input-group">
									<input
										type="email"
										id="email"
										name="email"
										placeholder="Email"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="input-group">
									<input
										type="password"
										id="password"
										name="password"
										placeholder="Password"
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="form-options">
									<button
										type="button"
										onClick={() => onSwitchToForgotPassword?.()}
										className="forgot-password"
									>
										Forgot Password?
									</button>
									{onSwitchToResetPassword && (
										<button
											type="button"
											onClick={() => onSwitchToResetPassword?.()}
											className="auth-link-btn"
											style={{ padding: 0 }}
										>
											Have a reset code?
										</button>
									)}
								</div>
								<button type="submit" className="auth-submit-btn">
									SIGN IN
								</button>
							</form>
							<p className="auth-redirect">
								Don&apos;t have an account?
								<button
									type="button"
									onClick={() => onSwitchToSignup?.()}
									className="auth-link-btn"
								>
									SIGN UP
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
