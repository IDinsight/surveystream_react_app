import { Routes, Route } from "react-router-dom";
import Login from "../modules/Auth";
import LandingPage from "../modules/LandingPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;