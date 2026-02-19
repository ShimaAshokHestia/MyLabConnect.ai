import { Route } from "react-router-dom";
import DSOmasterList from "../Pages/Master/List";

export const adminConnectRoutes = (

<Route path="masters/master-list" element={<DSOmasterList/>}/>
);

export const getadminConnectRoutes = () => adminConnectRoutes