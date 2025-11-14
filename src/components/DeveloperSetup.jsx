import { useEffect, useState } from "react";
import "../styles/ProfileSetup.css";

export default function DeveloperSetup({ isOpen, onClose, onComplete }) {
	const [formData, setFormData] = useState({
		username: "",
		telephone: "",
		bio: "",
		skills: "",
		githubUrl: "",
		linkedinUrl: "",
		portfolioUrl: "",
	});

	useEffect(() => {
		if (!isOpen) {
			setFormData({
				username: "",
				telephone: "",
				bio: "",
				skills: "",
				githubUrl: "",
				linkedinUrl: "",
				portfolioUrl: "",
			});
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
		if (!formData.username.trim()) {
			alert("Username is required!");
			return;
		}
		if (!formData.telephone.trim()) {
			alert("Telephone number is required!");
			return;
		}
		console.log("Developer Profile Setup:", formData);
		onComplete?.(formData);
	};

	const handleSkipForNow = () => {
		if (!formData.username.trim() || !formData.telephone.trim()) {
			alert("Username and telephone number are required before continuing!");
			return;
		}
		console.log("Skipping profile setup with username and telephone:", {
			username: formData.username,
			telephone: formData.telephone,
		});
		onComplete?.({ username: formData.username, telephone: formData.telephone });
	};

	return (
		<div className="profile-setup-overlay" onClick={onClose}>
			<div className="profile-setup-modal" onClick={(event) => event.stopPropagation()}>
				<div className="profile-setup-content">
					<h2 className="profile-setup-title">Complete Your Developer Profile</h2>
					<p className="profile-setup-subtitle">
						Username and telephone are required. Other fields can be updated later.
					</p>
					<form className="profile-setup-form" onSubmit={handleSubmit}>
						<div className="input-group">
							<input
								type="text"
								id="username"
								name="username"
								placeholder="Username *"
								value={formData.username}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="input-group">
							<input
								type="tel"
								id="telephone"
								name="telephone"
								placeholder="Telephone Number *"
								value={formData.telephone}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="input-group">
							<textarea
								id="bio"
								name="bio"
								placeholder="Bio (Tell us about yourself)"
								value={formData.bio}
								onChange={handleChange}
								rows="2"
								className="setup-textarea"
							/>
						</div>
						<div className="input-group">
							<input
								type="text"
								id="skills"
								name="skills"
								placeholder="Skills (e.g., React, Node.js, Python)"
								value={formData.skills}
								onChange={handleChange}
							/>
						</div>
						<div className="input-group">
							<input
								type="url"
								id="githubUrl"
								name="githubUrl"
								placeholder="GitHub URL"
								value={formData.githubUrl}
								onChange={handleChange}
							/>
						</div>
						<div className="input-group">
							<input
								type="url"
								id="linkedinUrl"
								name="linkedinUrl"
								placeholder="LinkedIn URL"
								value={formData.linkedinUrl}
								onChange={handleChange}
							/>
						</div>
						<div className="input-group">
							<input
								type="url"
								id="portfolioUrl"
								name="portfolioUrl"
								placeholder="Portfolio URL (Optional)"
								value={formData.portfolioUrl}
								onChange={handleChange}
							/>
						</div>
						<div className="setup-actions">
							<button type="submit" className="setup-complete-btn">
								COMPLETE SETUP
							</button>
							<button
								type="button"
								onClick={handleSkipForNow}
								className="setup-skip-btn"
							>
								Continue Setup Later
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
