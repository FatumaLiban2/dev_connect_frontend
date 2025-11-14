import "../styles/ProjectCard.css";

export default function ProjectCard({ project }) {
	const getStatusBadge = () => {
		const statusConfig = {
			available: { label: "Available", className: "status-available" },
			"in-progress": { label: "In Progress", className: "status-in-progress" },
			completed: { label: "Completed", className: "status-completed" },
		};

		const config = statusConfig[project.status] || statusConfig.available;

		return <span className={`status-badge ${config.className}`}>{config.label}</span>;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="project-card">
			<div className="project-card-header">
				<h3 className="project-title">{project.title}</h3>
				{getStatusBadge()}
			</div>

			<p className="project-description">{project.description}</p>

			<div className="project-meta">
				<div className="meta-item">
					<span className="meta-label">Budget:</span>
					<span className="meta-value">{project.budget}</span>
				</div>
				<div className="meta-item">
					<span className="meta-label">Timeline:</span>
					<span className="meta-value">{project.timeline}</span>
				</div>
			</div>

			<div className="project-footer">
				<span className="project-date">Created: {formatDate(project.createdAt)}</span>
				{project.assignedDeveloper && (
					<span className="assigned-dev">
						Assigned to: <strong>{project.assignedDeveloper}</strong>
					</span>
				)}
			</div>

			{project.files && project.files.length > 0 && (
				<div className="project-files">
					<span className="files-label">📎 {project.files.length} file(s) attached</span>
				</div>
			)}
		</div>
	);
}
