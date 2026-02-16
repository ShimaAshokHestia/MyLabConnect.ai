import React from 'react';
import { Card } from 'react-bootstrap';
import '../Styles/KiduStyles/StatsCards.css';
import type { StatCardProps } from '../Types/KiduTypes/StatCard.types';

/**
 * Reusable StatCard Component
 * 
 * A beautiful, animated statistics card with:
 * - Icon display
 * - Value and title
 * - Change indicator (positive/negative/neutral)
 * - Hover effects
 * - Loading state
 * - Multiple variants
 * - Fully responsive
 * 
 * @param title - Card title/label
 * @param value - Main value to display
 * @param change - Change indicator text (e.g., "+12% from last month")
 * @param changeType - Type of change: 'positive', 'negative', or 'neutral'
 * @param icon - Lucide icon component
 * @param className - Additional CSS classes
 * @param variant - Card color variant
 * @param onClick - Optional click handler
 * @param loading - Show loading state
 */
const KiduStatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className = '',
  variant = 'default',
  onClick,
  loading = false,
}) => {
  // Combine class names
  const cardClasses = [
    'stat-card',
    `stat-card-${variant}`,
    onClick ? 'stat-card-clickable' : '',
    loading ? 'stat-card-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Change indicator classes
  const changeClasses = [
    'stat-card-change',
    changeType === 'positive' ? 'stat-card-change-positive' : '',
    changeType === 'negative' ? 'stat-card-change-negative' : '',
    changeType === 'neutral' ? 'stat-card-change-neutral' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Background Decoration */}
      <div className="stat-card-decoration" />

      <Card.Body className="stat-card-body">
        <div className="stat-card-content">
          {/* Left Side - Text Content */}
          <div className="stat-card-text">
            <p className="stat-card-title">{title}</p>
            
            {loading ? (
              <div className="stat-card-skeleton">
                <div className="skeleton-line skeleton-line-lg" />
              </div>
            ) : (
              <h3 className="stat-card-value">{value}</h3>
            )}
            
            {change && !loading && (
              <p className={changeClasses}>{change}</p>
            )}
            
            {loading && change && (
              <div className="stat-card-skeleton">
                <div className="skeleton-line skeleton-line-sm" />
              </div>
            )}
          </div>

          {/* Right Side - Icon */}
          <div className={`stat-card-icon-wrapper stat-card-icon-${variant}`}>
            <Icon className="stat-card-icon" size={24} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default KiduStatsCard;