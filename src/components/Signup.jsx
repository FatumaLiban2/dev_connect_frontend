import { useEffect, useState } from "react";
import "../styles/Authentication.css";
import authIllustration from "../assets/authlogo.png";

export default function SignupModal({ isOpen, onClose, onSwitchToSignin }) {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		terms: false,
	});

	useEffect(() => {
		if (!isOpen) {
			setFormData({ username: "", email: "", password: "", terms: false });
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleChange = (event) => {
		const { name, type, checked, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!formData.terms) {
			alert("You must accept the Terms & Condition.");
			return;
		}
		console.log("Signing Up with:", formData);
		alert(`Welcome, ${formData.username}! Check the console for the submitted data.`);
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
							<h2>Join &amp; Connect the Fastest Growing Online Community</h2>
							<form className="auth-form" onSubmit={handleSubmit}>
								<div className="input-group">
									<input
										type="text"
										id="username"
										name="username"
										placeholder="Username"
										value={formData.username}
										onChange={handleChange}
										required
									/>
								</div>
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
									<label className="checkbox-container">
										<input
											type="checkbox"
											name="terms"
											checked={formData.terms}
											onChange={handleChange}
										/>
										Accept the Terms &amp; Condition
									</label>
								</div>
								<button type="submit" className="auth-submit-btn">
									SIGN UP
								</button>
							</form>
							<p className="auth-redirect">
								I have an Account?
								<button type="button" onClick={onSwitchToSignin} className="auth-link-btn">
									SIGN IN
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
