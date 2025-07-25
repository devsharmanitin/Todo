import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/dashboard/Index.tsx';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import MyTasks from './components/features/MyTasks.tsx';
import ViewTask from './components/features/ViewTasks.tsx';
import VitalTasks from './components/features/VitalTasks.tsx';
import ChangePassword from './components/auth/ChangePassword.tsx';
import UserProfile from './components/user/profile.tsx';
import RequireAuth from './components/auth/RequireAuth.tsx';
import PublicRoute from './routes/PublicRoutes.tsx';
import { ApiClientProvider } from './services/apiClient.tsx';
import './App.css';

function App() {
    return (
        <ApiClientProvider>
            <Routes>

                {/* Routes with Header and Sidebar */}
                <Route element={<RequireAuth />}>
                    <Route element={<MainLayout />} >
                        <Route path="/" element={<Home />} ></Route>
                        <Route path="/my-tasks" element={<MyTasks />} ></Route>
                        <Route path="/vital-tasks" element={<VitalTasks />} ></Route>
                        <Route path="/view-task" element={<ViewTask />} ></Route>
                        <Route path="/profile" element={<UserProfile />} ></Route>
                        <Route path="/change-password" element={<ChangePassword />} ></Route>
                    </Route>
                </Route>

                {/* Route without Authentication */}

                <Route element={<AuthLayout />} >
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} ></Route>
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} ></Route>
                </Route>


            </Routes>
        </ApiClientProvider>
    )

}

export default App;