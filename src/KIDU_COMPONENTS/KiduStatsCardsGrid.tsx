import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import type { StatCardsGridProps } from '../Types/KiduTypes/StatCard.types';
import '../Styles/KiduStyles/StatsCards.css';
import KiduStatsCard from './KiduStatsCard';

/**
 * StatCardsGrid Component
 * 
 * A helper component to display multiple StatCards in a responsive grid layout.
 * Automatically adjusts columns based on screen size.
 * 
 * @param cards - Array of StatCard configurations
 * @param columns - Number of columns (1-4)
 * @param className - Additional CSS classes
 */
const KiduStatsCardsGrid: React.FC<StatCardsGridProps> = ({
  cards,
  columns = 4,
  className = '',
}) => {
  // Calculate Bootstrap column sizes
  const getColSize = () => {
    switch (columns) {
      case 1:
        return 12;
      case 2:
        return 6;
      case 3:
        return 4;
      case 4:
        return 3;
      default:
        return 3;
    }
  };

  const colSize = getColSize();

  return (
    <Container fluid className={`stat-cards-container ${className}`}>
      <Row className="g-3 g-lg-4">
        {cards.map((card, index) => (
          <Col
            key={index}
            xs={12}
            sm={columns > 2 ? 6 : colSize}
            md={columns > 3 ? 6 : colSize}
            lg={colSize}
          >
            <KiduStatsCard {...card} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KiduStatsCardsGrid;