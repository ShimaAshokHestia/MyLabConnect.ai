import React, { useState } from "react";
import { Nav, Navbar, Container, Collapse } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { BsGridFill, BsGearFill, BsCashStack, BsNewspaper, BsBarChart, BsChevronDown, BsBag, BsTicketPerforated } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import AuthService from "../../Services/Auth.services";
import KiduLogoutModal from "../../Components/KiduLogoutModal";
import "../Style/Sidebar.css"

const Sidebar: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleMenuToggle = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const settingsSubMenu = [
    { label: "Branches", path: "/dashboard/settings/branch-list" },
    { label: "Category", path: "/dashboard/settings/category-list" },
    { label: "Circles", path: "/dashboard/settings/circle-list" },
    { label: "Company", path: "/dashboard/settings/company-list" },
    { label: "Designation", path: "/dashboard/settings/designation-list" },
    { label: "Month", path: "/dashboard/settings/month-list" },
    { label: "Report Engine", path: "/dashboard/settings/reportEngine-list" },
    { label: "Report Type", path: "/dashboard/settings/reportType-list" },
    { label: "States", path: "/dashboard/settings/state-list" },
    { label: "Status", path: "/dashboard/settings/status-list" },
    { label: "Users", path: "/dashboard/settings/user-list" },
    { label: "User Types", path: "/dashboard/settings/usertype-list" },
    { label: "Year", path: "/dashboard/settings/yearMaster-list" }
  ];

  const contribSubMenu = [
    { label: "Account Direct Entry", path: "/dashboard/contributions/accountDirectEntry-list" },
    { label: "Direct Pay", path: "/dashboard/contributions/directpayment-list" },
    { label: "Member", path: "/dashboard/contributions/member-list" },
    { label: "Monthly Contributions", path: "/dashboard/contributions/monthlyContribution-list" }
  ];

  const claimsSubMenu = [
    { label: "Death Claims", path: "/dashboard/claims/deathclaims-list" },
    { label: "Refund", path: "/dashboard/claims/refundcontribution-list" }
  ];

  const cmsSubMenu = [
    { label: "Attachments", path: "/dashboard/cms/attachments-list" },
    { label: "Contact Messages", path: "/dashboard/cms/contactmessage-list" },
    { label: "Daily News", path: "/dashboard/cms/dailynews-list" },
    // { label: "Main Page", path: "/dashboard/cms/mainpage-list" },
    { label: "Managing Committee", path: "/dashboard/cms/manage-committe-list" },
    { label: "Public Page", path: "/dashboard/cms/publicpage-list" },
    { label: "Quotes", path: "/dashboard/cms/dayquote-list" }
  ];

  const navigate = useNavigate();
  // const handleLogout = () => {
  //   // AuthService.logout();
  //   navigate("/");
  // };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };


  return (
    <>
      {/* Sidebar for medium+ screens */}
      <div
        className="d-none d-md-flex flex-column align-items-center py-2 position-fixed"
        style={{
          width: hovered ? "220px" : "70px",
          minHeight: "100vh",
          backgroundColor: "#0f2a44",
          transition: "width 0.3s",
          zIndex: 1000,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Profile section */}
        <div className="profile-section text-center mb-1">
          {hovered ? (
            <p className="mt-2 text-warning fw-bold" style={{ fontSize: "15px" }}>
              Admin Portal
            </p>

          ) : (
            <p className="fw-bolder fs-6 text-white">
              <span style={{ fontSize: "10px" }}></span>
            </p>
          )}
          {/* <img
            src="https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            alt="profile"
            className="rounded-circle mb-2"
            style={{
              width: hovered ? "80px" : "45px",
              height: hovered ? "80px" : "45px",
              border: "2px solid white",
              transition: "all 0.3s",
              objectFit: "cover",
            }}
          /> */}

        </div>

        <div
          style={{
            flex: 1,
            width: "100%",
            maxHeight: "calc(100vh - 150px)",
            overflowY: hovered ? "auto" : "hidden",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "#c0d5d6ff transparent",
          }}
          className="admin-sidebar-scroll"
        >
          {/* Navigation items */}
          <Nav className="flex-column gap-1 w-100">
            {/* Dashboard Menu */}
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 mx-auto ${hovered ? "ps-2 pe-3" : "justify-content-center"} rounded mt-1 ${isActive ? "bg-warning" : ""}`
              }
              style={{
                fontSize: "14px",
                textDecoration: "none",
                padding: "5px 0",
                width: hovered ? "85%" : "45px",
                transition: "width 0.3s"
              }}
            >
              {({ isActive }) => (
                <>
                  <BsGridFill
                    className={isActive ? "text-white" : "text-white"}
                    style={{ fontSize: "20px", minWidth: "20px" }}
                  />
                  {hovered && (
                    <span className={`fw-bold flex-grow-1 ${isActive ? "text-white" : "text-white"}`}>
                      Dashboard
                    </span>
                  )}
                </>
              )}
            </NavLink>


            {/* Settings Menu */}
            <div>
              <div
                className={`d-flex align-items-center gap-2 w-100 ${hovered ? "ps-4 pe-3" : "justify-content-center"} rounded mt-2`}
                style={{ fontSize: "14px", textDecoration: "none", cursor: "pointer", padding: "8px 0" }}
                onClick={() => handleMenuToggle('settings')}
              >
                <BsGearFill className="text-white" style={{ fontSize: "20px", minWidth: "20px" }} />
                {hovered && (
                  <>
                    <span className="text-white fw-bold flex-grow-1">Settings</span>
                    <BsChevronDown
                      className="text-white"
                      style={{
                        transition: "transform 0.3s",
                        transform: openMenu === 'settings' ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </>
                )}
              </div>

              <Collapse in={openMenu === 'settings' && hovered}>
                <div className="flex-column text-light mt-2">
                  {settingsSubMenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `d-flex align-items-center gap-2 p-2 ms-4 me-3 mb-1 ${isActive ? "bg-warning text-white rounded" : "text-white"}`
                      }
                      style={{ fontSize: "13px", textDecoration: "none" }}
                    >
                      <span className="fw-bold">{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              </Collapse>
            </div>

            {/* Contributions Menu */}
            <div>
              <div
                className={`d-flex align-items-center gap-2 w-100 ${hovered ? "ps-4 pe-3" : "justify-content-center"} rounded mt-2`}
                style={{ fontSize: "14px", textDecoration: "none", cursor: "pointer", padding: "8px 0" }}
                onClick={() => handleMenuToggle('contributions')}
              >
                <BsCashStack className="text-white" style={{ fontSize: "20px", minWidth: "20px" }} />
                {hovered && (
                  <>
                    <span className="text-white fw-bold flex-grow-1">Contributions</span>
                    <BsChevronDown
                      className="text-white"
                      style={{
                        transition: "transform 0.3s",
                        transform: openMenu === 'contributions' ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </>
                )}
              </div>

              <Collapse in={openMenu === 'contributions' && hovered}>
                <div className="flex-column text-light mt-2">
                  {contribSubMenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `d-block p-2 ms-4 me-3 mb-1 ${isActive ? "bg-warning text-white rounded" : "text-white"}`
                      }
                      style={{ fontSize: "13px", textDecoration: "none" }}
                    >
                      <span className="fw-bold">{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              </Collapse>
            </div>

            {/* Claims Menu */}
            <div>
              <div
                className={`d-flex align-items-center gap-2 w-100 ${hovered ? "ps-4 pe-3" : "justify-content-center"} rounded mt-2`}
                style={{ fontSize: "14px", textDecoration: "none", cursor: "pointer", padding: "8px 0" }}
                onClick={() => handleMenuToggle('claims')}
              >
                <FaFileInvoice className="text-white" style={{ fontSize: "20px", minWidth: "20px" }} />
                {hovered && (
                  <>
                    <span className="text-white fw-bold flex-grow-1">Claims</span>
                    <BsChevronDown
                      className="text-white"
                      style={{
                        transition: "transform 0.3s",
                        transform: openMenu === 'claims' ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </>
                )}
              </div>

              <Collapse in={openMenu === 'claims' && hovered}>
                <div className="flex-column text-light mt-2">
                  {claimsSubMenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `d-block p-2 ms-4 me-3 mb-1 ${isActive ? "bg-warning text-white rounded" : "text-white"}`
                      }
                      style={{ fontSize: "13px", textDecoration: "none" }}
                    >
                      <span className="fw-bold">{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              </Collapse>
            </div>

            {/* CMS Menu */}
            <div>
              <div
                className={`d-flex align-items-center gap-2 w-100 ${hovered ? "ps-4 pe-3" : "justify-content-center"} rounded mt-2`}
                style={{ fontSize: "14px", textDecoration: "none", cursor: "pointer", padding: "8px 0" }}
                onClick={() => handleMenuToggle('cms')}
              >
                <BsNewspaper className="text-white" style={{ fontSize: "20px", minWidth: "20px" }} />
                {hovered && (
                  <>
                    <span className="text-white fw-bold flex-grow-1">CMS</span>
                    <BsChevronDown
                      className="text-white"
                      style={{
                        transition: "transform 0.3s",
                        transform: openMenu === 'cms' ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </>
                )}
              </div>

              <Collapse in={openMenu === 'cms' && hovered}>
                <div className="flex-column text-light mt-2">
                  {cmsSubMenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      className={({ isActive }) =>
                        `d-block p-2 ms-4 me-3 mb-1 ${isActive ? "bg-warning text-white rounded" : "text-white"}`
                      }
                      style={{ fontSize: "13px", textDecoration: "none" }}
                    >
                      <span className="fw-bold">{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              </Collapse>
            </div>

            {/* Reports Menu */}
            <NavLink
              to="/dashboard/report-list"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 mx-1 ${hovered ? "ps-3 pe-3" : "justify-content-center"} rounded mt-2 ${isActive ? "bg-warning" : ""}`
              }
              style={{ fontSize: "14px", textDecoration: "none", padding: "8px 0" }}
            >
              {({ isActive }) => (
                <>
                  <BsBarChart
                    className={isActive ? "text-white" : "text-white"}
                    style={{ fontSize: "20px", minWidth: "20px" }}
                  />
                  {hovered && (
                    <span className={`fw-bold flex-grow-1 ${isActive ? "text-white" : "text-white"}`}>
                      Reports
                    </span>
                  )}
                </>
              )}
            </NavLink>

            {/* Support Tickets Menu */}
            <NavLink
              to="/dashboard/supportTickets-list"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 mx-1 ${hovered ? "ps-3 pe-3" : "justify-content-center"} rounded mt-2 ${isActive ? "bg-warning" : ""}`
              }
              style={{ fontSize: "14px", textDecoration: "none", padding: "8px 0" }}
            >
              {({ isActive }) => (
                <>
                  <BsTicketPerforated
                    className={isActive ? "text-white" : "text-white"}
                    style={{ fontSize: "20px", minWidth: "20px" }}
                  />
                  {hovered && (
                    <span className={`fw-bold flex-grow-1 ${isActive ? "text-white" : "text-white"}`}>
                      Support Tickets
                    </span>
                  )}
                </>
              )}
            </NavLink>


            {/* Customers Menu */}
            {/* <NavLink
              to="/dashboard/customer-list"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 mx-1 ${hovered ? "ps-3 pe-3" : "justify-content-center"} rounded mt-2 ${isActive ? "bg-warning" : ""}`
              }
              style={{ fontSize: "13px", textDecoration: "none", padding: "8px 0" }}
            >
              {({ isActive }) => (
                <>
                  <BsPeople
                    className={isActive ? "text-white" : "text-white"}
                    style={{ fontSize: "20px", minWidth: "20px" }}
                  />
                  {hovered && (
                    <span className={`fw-bold flex-grow-1 ${isActive ? "text-white" : "text-white"}`}>
                      Customers
                    </span>
                  )}
                </>
              )}
            </NavLink> */}

            {/* Approval Menu */}
            <NavLink
              to="/dashboard/approval"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 mx-1 ${hovered ? "ps-3 pe-3" : "justify-content-center"} rounded mt-2 ${isActive ? "bg-warning" : ""}`
              }
              style={{ fontSize: "14px", textDecoration: "none", padding: "8px 0" }}
            >
              {({ isActive }) => (
                <>
                  <BsBag
                    className={isActive ? "text-white" : "text-white"}
                    style={{ fontSize: "20px", minWidth: "20px" }}
                  />
                  {hovered && (
                    <span className={`fw-bold flex-grow-1 ${isActive ? "text-white" : "text-white"}`}>
                      Approval
                    </span>
                  )}
                </>
              )}
            </NavLink>

            {/* Logout */}
            <p
              onClick={handleLogout}
              className="d-flex align-items-center justify-content-center p-2 text-white mt-5 mx-3 rounded fw-bold"
              style={{
                fontSize: "13px",
                textDecoration: "none",
                backgroundColor: "#3d5272ff",
                cursor: "pointer",
              }}
            >
              <BiLogOut style={{ fontSize: "20px", color: "red" }} />
              {hovered && <span className="ms-2 text-danger">Logout</span>}
            </p>
          </Nav>
        </div>
      </div>

      {/* Bottom navbar for small screens */}
      <Navbar
        fixed="bottom"
        expand="md"
        className="d-md-none"
        style={{ backgroundColor: "#1B3763" }}
      >
        <Container fluid className="justify-content-around">
          <NavLink
            to="/dashboard"
            className="d-flex flex-column align-items-center text-decoration-none"
            style={{ fontSize: "10px" }}
          >
            {({ isActive }) => (
              <>
                <BsGridFill className={isActive ? "text-warning" : "text-white"} />
                <span className={`fw-bold ${isActive ? "text-warning" : "text-white"}`} style={{ fontSize: "10px" }}>
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
          <div
            className="d-flex flex-column align-items-center text-white"
            style={{ fontSize: "10px", cursor: "pointer" }}
            onClick={() => handleMenuToggle('settings')}
          >
            <BsGearFill />
            <span className="fw-bold" style={{ fontSize: "10px" }}>Settings</span>
          </div>
          <div
            className="d-flex flex-column align-items-center text-white"
            style={{ fontSize: "10px", cursor: "pointer" }}
            onClick={() => handleMenuToggle('contributions')}
          >
            <BsCashStack />
            <span className="fw-bold" style={{ fontSize: "10px" }}>Contributions</span>
          </div>
          <div
            className="d-flex flex-column align-items-center text-white"
            style={{ fontSize: "10px", cursor: "pointer" }}
            onClick={() => handleMenuToggle('claims')}
          >
            <FaFileInvoice />
            <span className="fw-bold" style={{ fontSize: "10px" }}>Claims</span>
          </div>
          <div
            className="d-flex flex-column align-items-center text-white"
            style={{ fontSize: "10px", cursor: "pointer" }}
            onClick={() => handleMenuToggle('cms')}
          >
            <BsNewspaper />
            <span className="fw-bold" style={{ fontSize: "10px" }}>CMS</span>
          </div>
        </Container>
      </Navbar>

      {/* Inline minimal WebKit scrollbar styles */}
      <style>
        {`
          .admin-sidebar-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .admin-sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 6px;
          }
          .admin-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>
      <KiduLogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

    </>
  );
};

export default Sidebar;