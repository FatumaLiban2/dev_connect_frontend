import { useState } from "react";
import "../styles/CreateProjectModal.css";

export default function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
	const [formData, setFormData] = useState({
		title: "",
		budget: "",
		timeline: "",
		description: "",
		files: [],
	});

	if (!isOpen) {
		return null;
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, files: Array.from(e.target.files) });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Create project object with additional metadata
		const newProject = {
			id: Date.now(),
			...formData,
			status: "available", // available, in-progress, completed
			createdAt: new Date().toISOString(),
			assignedDeveloper: null,
		};

		onCreateProject?.(newProject);
		
		// Reset form
		setFormData({
			title: "",
			budget: "",
			timeline: "",
			description: "",
			files: [],
		});
		
		onClose();
	};

	const handleCancel = () => {
		// Reset form
		setFormData({
			title: "",
			budget: "",
			timeline: "",
			description: "",
			files: [],
		});
		onClose();
	};

	return (
		<div className="create-project-overlay" onClick={handleCancel}>
			<div className="create-project-modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>Create New Project</h2>
					<p className="modal-subtitle">Fill in the details for your new project</p>
				</div>

				<form onSubmit={handleSubmit} className="project-form">
					<div className="form-group">
						<label htmlFor="title">Project Title *</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							placeholder="Enter project name"
							required
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label htmlFor="budget">Budget Range *</label>
							<input
								type="text"
								id="budget"
								name="budget"
								value={formData.budget}
								onChange={handleChange}
								placeholder="e.g., $500 - $2000"
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="timeline">Timeline *</label>
							<input
								type="text"
								id="timeline"
								name="timeline"
								value={formData.timeline}
								onChange={handleChange}
								placeholder="e.g., 2-4 weeks"
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="description">Project Description *</label>
						<textarea
							id="description"
							name="description"
							rows="4"
							value={formData.description}
							onChange={handleChange}
							placeholder="Describe your project in detail"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="files">Upload Files (Optional)</label>
						<input
							type="file"
							id="files"
							multiple
							onChange={handleFileChange}
							className="file-input"
						/>
						{formData.files.length > 0 && (
							<ul className="file-list">
								{formData.files.map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						)}
					</div>

					<div className="modal-actions">
						<button type="button" onClick={handleCancel} className="cancel-btn">
							Cancel
						</button>
						<button type="submit" className="create-btn">
							Create Project
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
