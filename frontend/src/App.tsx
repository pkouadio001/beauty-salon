import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import LoginRegistration from "./pages/LoginRegistration.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginRegistration />} />
                <Route path="/customer/Dashboard" element={<CustomerDashboard />} />
                <Route path="/employee/Dashboard" element={<EmployeeDashboard />} />
                <Route path="/admin/Dashboard" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;