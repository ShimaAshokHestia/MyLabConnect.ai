import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaUsers, FaMoneyBillWave, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KiduSearchBar from "../../Components/KiduSearchBar";
import KiduLoader from "../../Components/KiduLoader";

import { useYear } from "./YearContext";
import Charts from "./Charts";
import ProgressBar from "./ProgressBar";
import DashBoardCards from "../Pages/Dashboard/DashBoardCards";

interface CardData {
  title: string;
  value: number;
  change: number;
  color: string;
  route: string;
  icon: React.ReactNode;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedYear } = useYear();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);

        // Mock data for Canara Bank Union - Replace with actual API call
        // Example: const response = await DashboardService.getDashboard(selectedYear);

        const mockData: CardData[] = [
          {
            title: "Total Members",
            value: 5850,
            change: 8.5,
            color: "#0f2a55",
            route: "/dashboard/contributions/member/member-list",
            icon: <FaUsers />
          },
          {
            title: "Active Contributions",
            value: 4920,
            change: 12.3,
            color: "#28a745",
            route: "/dashboard/contributions",
            icon: <FaMoneyBillWave />
          },
          {
            title: "Total Claims (Year)",
            value: 187,
            change: -5.2,
            color: "#ff9800",
            route: "/dashboard/claims",
            icon: <FaHandHoldingUsd />
          },
          {
            title: "Collection (₹L)",
            value: 785,
            change: 15.7,
            color: "#17a2b8",
            route: "/dashboard/collections",
            icon: <FaChartLine />
          },
        ];

        setCards(mockData);

        // Uncomment when you have the actual service
        // if (response?.isSuccess && response?.value) {
        //   setCards(response.value);
        // } else {
        //   toast.error("Failed to load dashboard data.");
        // }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [selectedYear]);

  const handleSearch = async (term: string) => {
    if (!term) {
      toast.error("Please enter a search term.");
      return;
    }

    try {
      // TODO: Replace with your actual search service call
      // Example: const response = await SearchService.search(term);

      toast.info(`Searching for: ${term}`);

      // Uncomment and modify when you have the actual service
      // if (response.isSuccess && response.value) {
      //   const item = response.value;
      //   navigate(`/dashboard/details/${item.id}`);
      //   toast.success(`Item found!`);
      // } else {
      //   toast.error("No results found.");
      // }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Error performing search.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column p-3">
        {/* Search + Quick Actions Button */}
        <div className="d-flex justify-content-between flex-column flex-md-row align-items-stretch">
          <KiduSearchBar onSearch={handleSearch} />
        </div>
        {/* Dashboard Cards */}
        <Container fluid className="mt-3 px-0">
          <Row className="g-3 justify-content-start mb-2">
            <h6 className="fw-semibold mb-3 text-start" style={{ color: "#0f2a55" }}>
              Dashboard Overview
            </h6>
            <Row className="mt-1 mb-2">
              {loading ? (
                <KiduLoader />
              ) : (
                cards.map((card, idx) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                    <DashBoardCards
                      title={card.title}
                      value={card.value}
                      change={card.change}
                      icon={card.icon}
                      onClick={() => navigate(card.route)}
                    />
                  </Col>
                ))
              )}
            </Row>
            <hr className="mx-4" />
            <h6 className="fw-semibold mb-3 text-start" style={{ color: "#0f2a55" }}>
              Performance & Activities
            </h6>
            <ProgressBar />
            <hr className="mx-4" />
            <h6 className="fw-semibold mb-2 text-start" style={{ color: "#0f2a55" }}>
              Analytics & Reports
            </h6>
            <Charts />
          </Row>
        </Container>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default HomePage;