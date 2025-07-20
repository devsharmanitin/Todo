import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/partials/header';
import Sidebar from '../components/partials/sidebar';


const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">

            {/* The Header component is now placed directly at the top. */}
            {/* It receives the 'setSidebarOpen' function to be able to open the sidebar. */}
            <Header setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 overflow-hidden">
                {/* This is the container for the mobile sidebar overlay */}
                <div
                    className={`fixed inset-0 z-30 bg-black bg-opacity-30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'
                        }`}
                    onClick={() => setSidebarOpen(false)} // Allow closing by clicking the overlay
                ></div>

                {/* Sidebar */}
                <div
                    className={`fixed left-0 top-0 min-h-screen w-64 bg-white shadow-lg z-40 transform transition-transform 
                                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                                md:relative md:translate-x-0 md:shadow-none`}
                >
                    {/* Pass 'setSidebarOpen' to the Sidebar so it can have a close button */}
                    <Sidebar setSidebarOpen={setSidebarOpen} />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-10 overflow-y-auto">
                    <Outlet /> {/* Child routes will be rendered here */}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;