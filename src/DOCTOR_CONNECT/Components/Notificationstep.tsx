import React from 'react';
import '../Styles/Notificationstep.css';

export interface NotificationRow {
  event: string;
  email: boolean;
  text: boolean;
  push: boolean;
}

interface NotificationsStepProps {
  rows: NotificationRow[];
  onChange: (rows: NotificationRow[]) => void;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  'Case Shipped': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-3 7h8m0 0l-3-3m3 3l-3 3"/>
      <rect x="9" y="11" width="14" height="10" rx="2" ry="2"/>
    </svg>
  ),
  'Case on Hold': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>
    </svg>
  ),
  'Messaging Module': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  'Scan Validation': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  'Ticket Status Update': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

const CHANNEL_ICONS = {
  email: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  text: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  push: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`notif-toggle ${checked ? 'on' : 'off'}`}
    onClick={() => onChange(!checked)}
  >
    <span className="notif-toggle-thumb" />
  </button>
);

const NotificationsStep: React.FC<NotificationsStepProps> = ({ rows, onChange }) => {
  const toggleChannel = (rowIndex: number, channel: 'email' | 'text' | 'push') => {
    const updated = rows.map((row, i) =>
      i === rowIndex ? { ...row, [channel]: !row[channel] } : row
    );
    onChange(updated);
  };

  const allOn = (channel: 'email' | 'text' | 'push') => rows.every((r) => r[channel]);

  const toggleAll = (channel: 'email' | 'text' | 'push') => {
    const target = !allOn(channel);
    onChange(rows.map((r) => ({ ...r, [channel]: target })));
  };

  return (
    <div className="notif-step animate-step">
      <div className="notif-info-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>Choose how you'd like to be notified for each event type.</span>
      </div>

      <div className="notif-table-wrap">
        <table className="notif-table">
          <thead>
            <tr>
              <th className="notif-th-event">Event</th>
              {(['email', 'text', 'push'] as const).map((ch) => (
                <th key={ch} className="notif-th-channel">
                  <div className="notif-ch-header">
                    <span className="notif-ch-icon">{CHANNEL_ICONS[ch]}</span>
                    <span className="notif-ch-label">{ch.charAt(0).toUpperCase() + ch.slice(1)}</span>
                    <button
                      className={`notif-all-toggle ${allOn(ch) ? 'all-on' : ''}`}
                      title={`Toggle all ${ch}`}
                      onClick={() => toggleAll(ch)}
                    >
                      All
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.event} className="notif-row">
                <td className="notif-td-event">
                  <div className="notif-event-cell">
                    <span className="notif-event-icon">{EVENT_ICONS[row.event]}</span>
                    <span className="notif-event-name">{row.event}</span>
                  </div>
                </td>
                {(['email', 'text', 'push'] as const).map((ch) => (
                  <td key={ch} className="notif-td-toggle">
                    <ToggleSwitch
                      checked={row[ch]}
                      onChange={() => toggleChannel(i, ch)}
                      label={`${row.event} ${ch}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsStep;