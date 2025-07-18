import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/dashboard/index.tsx';
import Login from './components/auth/login';
import Register from './components/auth/register';
import MainLayout from './layouts/MainLayout.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import MyTasks from './components/features/mytasks.tsx';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>

                {/* Routes with Header and Sidebar */}
                <Route element={<MainLayout />} >
                    <Route path="/" element={<Home />} ></Route>
                    <Route path="/my-tasks" element={<MyTasks />} ></Route>
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