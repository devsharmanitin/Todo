import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Profile from '../../assets/images/profile.svg';

// 1. Define the props interface to accept the setSidebarOpen function
interface SidebarProps {
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

// 2. Convert to a standard React FC component and accept props
const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen }) => {
    return (
        // The outer div now handles the full height and background
        <div className="w-64 h-full bg-[#FFFFFF] text-white relative">

            {/* 3. Add a mobile-only close button */}
            <button
                className="md:hidden absolute top-4 right-4 text-white p-1 rounded-full z-20"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <div className="bg-[#FFFFFF] h-full">
                {/* The red background part */}
                <div className="relative mt-10 bg-red-500 rounded-t-lg h-full">
                    <div className="px-6 pb-6">

                        {/* Profile Section */}
                        <div className="flex justify-center space-x-3 mb-6">
                            <div className="w-24 h-24 rounded-full bg-white overflow-hidden absolute -top-10">
                                <img
                                    className="w-full h-full object-cover"
                                    src={Profile}
                                    alt="Profile"
                                />
                            </div>
                            <div className="text-normal text-center mt-20 font-outfit">
                                <h2 className="font-semibold text-white">Sundar Gurung</h2>
                                <p className="text-red-100 text-sm">sundargurung580@gmail.com</p>
                            </div>
                        </div>

                        {/* Navigation Section */}
                        <nav className="space-y-1 flex flex-col justify-start min-w-[200px] mt-10 font-poppins">
                            <div className="bg-white text-red-500 rounded-lg p-3">
                                <div className="flex items-center space-x-5">
                                    <div className="w-6 h-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
                                            <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-sm">Dashboard</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-5 text-red-100 rounded-lg p-3 hover:bg-white hover:bg-opacity-75 hover:text-red-500 cursor-pointer">
                                <div className="w-6 h-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                                    </svg>
                                </div>
                                <span className="font-medium text-sm">Vital Task</span>
                            </div>
                            {/* ... other nav items ... */}
                            <div className="flex items-center space-x-5 text-red-100 rounded-lg p-3 hover:bg-white hover:bg-opacity-75 hover:text-red-500 cursor-pointer">
                                <div className="w-6 h-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                                        <path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    </svg>
                                </div>
                                <span className="font-medium text-sm">Logout</span>
                            </div>
                        </nav>

                    </div>
                </div>
            </div>
        </div>
    );
}

// 4. Ensure the export is default and component name is capitalized
export default Sidebar;