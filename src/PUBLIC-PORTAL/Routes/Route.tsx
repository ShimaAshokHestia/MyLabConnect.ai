// PUBLIC-PORTAL/Routes/Route.tsx
// IMPORTANT: This component should NOT contain <Routes> or <Router>
// It's just a collection of Route definitions to be used in the main AppRoutes

//import { Route } from 'react-router-dom';
// import PublicLayout from '../Layout/Layout';
// import ContactUs from '../Pages/ContactUs';
// import Downloads from '../Pages/Downloads';
// import Rules from '../Pages/Rules';
// import AboutUs from '../Pages/AboutUs';
// import Home from '../Pages/Home';
// import News from '../Pages/NewPage';
// import Claims from '../Pages/Claims';
// import PrivacyPolicy from '../Pages/PrivacyPolicy';
// import ManagingCommitteePublic from '../Pages/ManagingCommittee';

export const publicRoutes = (
  <>
    {/* Public routes with layout */}
    {/* <Route path="/" element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="downloads" element={<Downloads />} />
      <Route path="about-us" element={<AboutUs />} />
      <Route path="managing-committee" element={<ManagingCommitteePublic />} />
      <Route path="rules" element={<Rules />} />
      <Route path="claims" element={<Claims />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="news" element={<News />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} /> */}
    {/* </Route> */}
  </>
);

// Alternative: Export as function
export const getPublicRoutes = () => publicRoutes;