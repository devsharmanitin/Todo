import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import SearchForm from '../forms/searchform';

// 1. Update the props interface to accept 'setSidebarOpen'
interface HeaderProps {
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    return (
        <div className="bg-[#F8F8F8] border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 w-full">
            <div className="flex items-center justify-between font-demi space-x-4">

                {/* 2. Add the sidebar toggle button here */}
                <button
                    className="md:hidden p-2 rounded text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSidebarOpen(true);
                    }}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <a href="#" className="no-underline hidden md:block">
                    <h1 className="text-xl md:text-2xl font-light">
                        <span className="text-red-600">Dash</span>
                        <span className="text-gray-800">Board</span>
                    </h1>
                </a>

                <div className="flex-1 flex items-center justify-center">
                    <SearchForm></SearchForm>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="bg-red-500 text-white p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-bell w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                    </div>
                    <div className="bg-red-500 text-white p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-calendar w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                    </div>
                    <div className="text-right font-poppins">
                        <div className="text-xs md:text-sm text-gray-800 font-bold">Tuesday</div>
                        <div className="text-xs md:text-sm text-gray-800 font-book">20/06/2025</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Header;