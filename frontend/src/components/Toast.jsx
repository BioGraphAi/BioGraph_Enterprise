import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    info:    { borderColor: 'var(--border-strong)',  icon: <Info size={15}         color="var(--text-secondary)" /> },
    success: { borderColor: 'var(--status-success)', icon: <CheckCircle size={15}  color="var(--status-success)" /> },
    error:   { borderColor: 'var(--status-error)',   icon: <AlertCircle size={15}  color="var(--status-error)" /> },
  };

  const style = styles[type] || styles.info;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'var(--bg-elevated)',
      border: `1px solid ${style.borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '11px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      color: 'var(--text-primary)',
      zIndex: 9999,
      animation: 'slideInToast 0.25s ease-out',
      backdropFilter: 'blur(12px)',
      minWidth: '220px',
      maxWidth: '360px',
    }}>
      {style.icon}
      <span style={{ fontSize: '13px', flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          padding: '2px', display: 'flex', alignItems: 'center',
          borderRadius: '4px', transition: 'color 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={14} />
      </button>
      <style>{`
        @keyframes slideInToast {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
