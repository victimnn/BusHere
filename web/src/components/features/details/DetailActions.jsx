import React from 'react';

function DetailActions({ title = 'Ações', description, actions = [] }) {
	return (
		<section className="card border-0">
			<div className="card-header bg-transparent">
				<h5 className="card-title mb-0">{title}</h5>
				{description && (
					<p className="text-muted small mb-0">{description}</p>
				)}
			</div>
			<div className="card-body d-flex flex-wrap gap-2">
				{actions.map((action, index) => (
					<button
						key={index}
						type="button"
						className={`btn ${action.variant ?? 'btn-primary'}`}
						onClick={action.onClick}
					>
						{action.icon && <i className={`bi ${action.icon} me-1`}></i>}
						{action.text}
					</button>
				))}
			</div>
		</section>
	);
}

export default DetailActions;


