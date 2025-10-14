import React from 'react';

const NotificationSettings = ({ notifications, onNotificationChange }) => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-bold">
          <i className="bi bi-bell text-primary me-2"></i>
          Notificações
        </h6>
        
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailNotifications"
            checked={notifications.email}
            onChange={() => onNotificationChange('email')}
          />
          <label className="form-check-label" htmlFor="emailNotifications">
            Notificações por Email
          </label>
        </div>
        
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="pushNotifications"
            checked={notifications.push}
            onChange={() => onNotificationChange('push')}
          />
          <label className="form-check-label" htmlFor="pushNotifications">
            Notificações Push
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
