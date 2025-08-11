import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/user/dashboard/Index.tsx';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import MyTasks from './components/user/features/MyTasks.tsx';
import ViewTask from './components/user/features/ViewTasks.tsx';
import VitalTasks from './components/user/features/VitalTasks.tsx';
import ChangePassword from './components/auth/ChangePassword.tsx';
import UserProfile from './components/user/profile.tsx';
import { ProtectedRoute } from './routes/ProtectedRoutes.tsx';
import PublicRoute from './routes/PublicRoutes.tsx';
import './App.css';
import LoginOTP from './components/auth/Otp.tsx';

function App() {
    return (
        <Routes>

            {/* Routes with Header and Sidebar */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />} >
                    <Route path="/" element={<Home />} ></Route>
                    <Route path="/my-tasks" element={<MyTasks />} ></Route>
                    <Route path="/vital-tasks" element={<VitalTasks />} ></Route>
                    <Route path="/view-task/:id" element={<ViewTask />} ></Route>
                    <Route path="/profile" element={<UserProfile />} ></Route>
                    <Route path="/change-password" element={<ChangePassword />} ></Route>
                </Route>
            </Route>

            {/* Route without Authentication */}

            <Route element={<AuthLayout />} >
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} ></Route>
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} ></Route>
                <Route path="/verify/profile" element={<PublicRoute><LoginOTP /></PublicRoute>} ></Route>
            </Route>


        </Routes>
    )

}

export default App;