import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../src/helpers/functions.tsx'
import Home from './components/dashboard/index.tsx';
import Login from './components/auth/login';
import Register from './components/auth/register';
import MainLayout from './layouts/MainLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import MyTasks from './components/features/mytasks.tsx';
import ViewTask from './components/features/viewtask.tsx';
import VitalTasks from './components/features/vitaltasks.tsx';
import ChangePassword from './components/auth/chnage-password.tsx';
import UserProfile from './components/user/profile.tsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>

                {/* Routes with Header and Sidebar */}
                <Route element={<MainLayout />} >
                    <Route path="/" element={<Home />} ></Route>
                    <Route path="/my-tasks" element={<MyTasks />} ></Route>
                    <Route path="/vital-tasks" element={<VitalTasks />} ></Route>
                    <Route path="/view-task" element={<ViewTask />} ></Route>
                    <Route path="/profile" element={<UserProfile />} ></Route>
                    <Route path="/change-password" element={<ChangePassword />} ></Route>
                </Route>

                {/* Route without Authentication */}
                <Route element={<AuthLayout />} >
                    <Route path="/login" element={<Login />} ></Route>
                    <Route path="/register" element={<Register />} ></Route>
                </Route>


            </Routes>
        </Router>
    )

}

export default App;