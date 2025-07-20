import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react'; // Already imported, but good to be explicit
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    AlertCircle,
    ClipboardCheck,
    ClipboardList,
    Settings,
    LogOut,
} from 'lucide-react';
import Profile from '../../assets/images/profile.svg'; // Adjust path as needed
import toast, { Toaster } from 'react-hot-toast'; // Toaster is still useful if Sidebar has its own toasts later
import { getRequest } from '../../helpers/functions';

// Define a type for the user object that Sidebar expects
interface IUser {
    id: number;
    name: string;
    email: string;
    image: string | null;
    // Add other user properties that Sidebar needs
}

// Update SidebarProps to accept the user object
interface SidebarProps {
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    user: IUser | null; // User data will now be passed as a prop
}

interface NavItem {
    name: string;
    route: string;
    icon: React.ElementType;
}

const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen }) => { // Destructure 'user' prop
    const location = useLocation();
    const [user, SetUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true); // Loading state for fetching user data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use your actual getRequest here, or mockGetRequest for testing
                const response: any = await getRequest("/user"); // Or mockGetRequest("/dashboard");
                if (response.success) {
                    SetUser(response.user); // Set the 'data' part of the response
                    
                } else {
                    toast.error(response.message || "Something went wrong. Please try again.");
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast.error("Network error. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false after fetch completes (success or error)
            }
        };

        fetchUserData();
        
    }, []);

    console.log("userr", user); // Log the fetched user data

    // Remove the useState for userData and loading, and the useEffect that fetches user data.
    // This data is now coming from the 'user' prop.

    const navitems: NavItem[] = [
        { name: 'Dashboard', route: '/', icon: LayoutDashboard },
        { name: 'Vital Task', route: '/vital-tasks', icon: AlertCircle },
        { name: 'My Tasks', route: '/my-tasks', icon: ClipboardCheck },
        { name: 'Task Categories', route: '/task-categories', icon: ClipboardList },
        { name: 'Settings', route: '/profile', icon: Settings }, // Changed to /profile for consistency
        { name: 'Logout', route: '/logout', icon: LogOut },
    ];

    // console.log("User Data in Sidebar (from prop):", user); // Log the received user prop

    return (
        <div className="w-64 h-full bg-white text-white relative">
            <Toaster position="top-center" reverseOrder={false} /> {/* Keep Toaster for potential future toasts */}
            
            {/* Mobile-only close button */}
            <button
                className="md:hidden absolute top-4 right-4 text-white p-1 rounded-full z-20"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
            >
                <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <div className="bg-white h-full">
                {/* Red sidebar background */}
                <div className="relative mt-10 bg-red-500 rounded-t-lg h-full">
                    <div className="px-6 pb-6">

                        {/* Profile Section - Conditionally render based on 'user' prop */}
                        {user ? ( // Only render if 'user' prop is not null
                            <div className="flex justify-center space-x-3 mb-6">
                                <div className="w-24 h-24 rounded-full bg-white overflow-hidden absolute -top-10">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={user.image || Profile} // Use user.image if available, fallback to default Profile SVG
                                        alt="Profile"
                                    />
                                </div>
                                <div className="text-normal text-center mt-20 font-outfit">
                                    <h2 className="font-semibold text-white">{user.name}</h2>
                                    <p className="text-red-100 text-sm">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            // Optional: Placeholder or loading state if user prop is null (though MainLayout handles this)
                            <div className="flex justify-center flex-col items-center space-x-3 mb-6 pt-10">
                                <div className="w-24 h-24 rounded-full bg-white overflow-hidden absolute -top-10 animate-pulse">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={Profile}
                                        alt="Loading Profile"
                                    />
                                </div>
                                <div className="text-normal text-center mt-20 font-outfit">
                                    <h2 className="font-semibold text-white animate-pulse bg-red-300 h-6 w-32 rounded-md mb-2"></h2>
                                    <p className="text-red-100 text-sm animate-pulse bg-red-200 h-4 w-40 rounded-md"></p>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <nav className="space-y-1 flex flex-col justify-start min-w-[200px] mt-10 font-poppins">
                            {navitems.map((item) => {
                                const isActive = location.pathname === item.route;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.route}
                                        className={`${
                                            isActive
                                                ? 'bg-white text-red-500'
                                                : 'text-red-100 hover:bg-white hover:bg-opacity-75 hover:text-red-500'
                                        } rounded-lg p-3 flex items-center space-x-5 transition-colors duration-200`}
                                    >
                                        <div className="w-6 h-6">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;