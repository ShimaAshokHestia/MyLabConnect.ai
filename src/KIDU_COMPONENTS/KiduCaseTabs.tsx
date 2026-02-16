import React from 'react';
import { Nav } from 'react-bootstrap';
import '../Styles/KiduStyles/Castabs.css';
import type { CaseTabsProps } from '../Types/Dashboards.types';

/**
 * Reusable CaseTabs Component
 * 
 * A tabbed navigation component for filtering cases by status.
 * 
 * Features:
 * - Icon + label display
 * - Badge counts
 * - Active state highlighting
 * - Fully responsive
 * - Smooth animations
 * 
 * @param tabs - Array of tab configurations
 * @param activeTab - Currently active tab ID
 * @param onTabChange - Callback when tab is changed
 * @param className - Additional CSS classes
 */
const CaseTabs: React.FC<CaseTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`case-tabs-container ${className}`}>
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(selectedKey) => {
          if (selectedKey) onTabChange(selectedKey);
        }}
        className="case-tabs-nav"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Nav.Item key={tab.id} className="case-tabs-item">
              <Nav.Link
                eventKey={tab.id}
                className={`case-tabs-link ${isActive ? 'active' : ''}`}
              >
                <div className="case-tabs-content">
                  <Icon className="case-tabs-icon" size={16} />
                  <span className="case-tabs-label">{tab.label}</span>
                  {tab.count !== null && tab.count !== undefined && (
                    <span
                      className={`case-tabs-badge ${
                        isActive ? 'badge-active' : 'badge-inactive'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
  );
};

export default CaseTabs;