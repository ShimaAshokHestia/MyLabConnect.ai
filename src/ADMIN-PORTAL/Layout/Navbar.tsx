// src/components/AdminComponents/AdminNavbar.tsx
import React, { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Container, Image, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import profile from "../Assets/Images/profile.jpg";
import { useYear } from "./YearContext";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";
import KiduYearSelector from "../../Components/KiduYearSelector";
import AuthService from "../../Services/Auth.services";
import KiduLogoutModal from "../../Components/KiduLogoutModal";
import KiduAccountsettingsModal from "../Components/KiduAccountsettingsModal";
import KiduProfileModal from "../Components/KiduProfileModal";
import KiduNavbarDropdown from "../Components/KiduNavbarDropdown";
import AdminNotificationDropdown from "../Components/KiduNotificationDropdown";
import profiledefaultImg from "../Assets/Images/profile.jpg"


const NavbarComponent: React.FC = () => {
  // const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState<string>("Username");
  const [useremail, setUseremail] = useState<string>("userEmail");
  const [profilePic, setProfilePic] = useState<string>(profile);
  const { selectedYear, setSelectedYear } = useYear();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  // Fetch username from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.userName) {
          queueMicrotask(() => {
            setUsername(parsedUser.userName);
            setUseremail(parsedUser.userEmail)
          });
        }
        if (parsedUser?.profileImageSrc) {
          setProfilePic(getFullImageUrl(parsedUser.profileImageSrc));
        }
      }
      // 🔄 LISTEN FOR CHANGES TO PROFILE PIC
      const handleProfileUpdate = () => {
        const updatedUser = localStorage.getItem("user");
        if (updatedUser) {
          const parsed = JSON.parse(updatedUser);
          setProfilePic(getFullImageUrl(parsed.profileImageSrc));
        }
      };
      window.addEventListener("profile-pic-updated", handleProfileUpdate);
      return () => {
        window.removeEventListener("profile-pic-updated", handleProfileUpdate);
      };
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);


  // const handleClose = () => setShowNotifications(false);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    console.log("Selected Year Updated Globally:", year);
  };


  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    AuthService.logout();
    navigate("/");
  };


  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className="bg-white"
        style={{
          height: "60px",
          zIndex: 999,
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <Container
          fluid
          className="d-flex shadow align-items-center justify-content-between"
          style={{
            marginLeft: window.innerWidth >= 768 ? "70px" : "0px",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Left Side */}
          <div className="d-flex align-items-center head-font">
            <p
              className="mb-0 text-dark"
              style={{
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#ec9d0aff" }}>Welcome</span>
              <br />
              {username}
            </p>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-1">
            {/* Year Dropdown */}
            <div className="me-3">
              <KiduYearSelector
                startYear={2023}
                onYearSelect={handleYearSelect}
                defaultYear={selectedYear}
              />
            </div>

            {/* Notifications */}
            {/* <BsBell
              size={20}
              className="cursor-pointer"
              onClick={handleShow}
            /> */}

            <AdminNotificationDropdown />


            {/* Profile Section */}
            <div
              className="d-flex align-items-center cursor-pointer border-none py-1 ms-3"
            >
              <Image
                src={profilePic? profilePic : profiledefaultImg}
                alt="profile"
                className="rounded-circle me-2 border border-2"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              <div className="text-end">
                {/* <p className="mb-0" style={{ color: "#787486", fontSize: "12px" }}>
                  {username}
                </p> */}
              </div>
              <BsChevronDown
                className="ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown((prev) => !prev);
                }}
              />

              {/* Dropdown */}
              <KiduNavbarDropdown
                show={showDropdown}
                onToggle={setShowDropdown}
                name={username}
                email={useremail}

                onAccountSettings={() => {
                  setShowDropdown(false);
                  setShowAccountSettings(true);
                }}

                onProfile={() => {
                  setShowDropdown(false);
                  setShowProfileModal(true);
                }}

                onLogout={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
              />
              <KiduAccountsettingsModal
                show={showAccountSettings}
                onHide={() => setShowAccountSettings(false)}
              />

              <KiduProfileModal
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
              />

            </div>

          </div>
        </Container>
      </Navbar>

      {/* Notification Offcanvas */}
      {/* <ActivityPanel show={showNotifications} handleClose={handleClose} /> */}
      <KiduLogoutModal
        show={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

    </>
  );
};

export default NavbarComponent;