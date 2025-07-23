import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';
import { postRequest } from "../../helpers/functions";
import LoginSVG from '../../assets/images/login.svg'; // Assuming you have this SVG import
import { useAuth } from '../../provider/AuthProvider';
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
    const { login } = useAuth();
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState(""); // Renamed for consistency
    const [RememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    // State to hold validation errors for each field
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Function to validate individual fields
    const validateField = (fieldName: string, value: string): string => {
        switch (fieldName) {
            case 'Email':
                if (!value.trim()) return 'Email is required.';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
                return '';
            case 'Password':
                if (!value) return 'Password is required.';
                if (value.length < 6) return 'Password must be at least 6 characters.'; // Example min length
                return '';
            default:
                return '';
        }
    };

    // Handle form submission
    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        const newErrors: { [key: string]: string } = {};
        newErrors.Email = validateField('Email', Email);
        newErrors.Password = validateField('Password', Password);

        // Update errors state
        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (hasErrors) {
            toast.error("Please fill in all required fields correctly.");
            return;
        }

        const data = {
            email: Email,
            password: Password,
            rememberMe: RememberMe // Sending rememberMe state to backend
        };

        try {
            const response: any = await postRequest("/login", data); // Call your mock or actual API
            if (response.success) {
                console.log("Login successful:", response);
                login({
                    username: response.user.username,
                    email: response.user.email,
                    token: response.access_token,
                    permissions: response.user.permissions
                });

                const token = response.access_token;
                localStorage.setItem("token", token); // Store the JWT token
                toast.success(response.message || "Login successful!");
                navigate("/");

            } else {
                // Display specific error message from the backend
                toast.error(response.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Network error. Please try again later.");
        }
    };

    return (
        <div className="flex-1 p-4 md:p-10">
            {/* Toaster for displaying notifications */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-2 md:p-6 shadow-lg rounded-lg">
                <div className="p-5 md:px-10 md:py-10 font-inter">
                    <h2 className="text-gray-700 mb-5 font-demi font-bold text-3xl">Sign In</h2>
                    <form className="flex space-y-5 flex-col text-gray-700 text-sm font-poppins" onSubmit={handleSubmission}>
                        {/* Email Input Field */}
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-check-icon lucide-mail-check w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" />
                            </svg>
                            <input
                                type="email" // Changed to type="email"
                                value={Email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors(prev => ({ ...prev, Email: validateField('Email', e.target.value) }));
                                }}
                                className={`pl-10 pr-4 py-2 border ${errors.Email ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700`}
                                placeholder="Enter Email" // Changed placeholder
                            />
                            {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
                        </div>

                        {/* Password Input Field */}
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type="password"
                                value={Password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, Password: validateField('Password', e.target.value) }));
                                }}
                                className={`pl-10 pr-4 py-2 border ${errors.Password ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700`}
                                placeholder="Enter Password"
                            />
                            {errors.Password && <p className="text-red-500 text-xs mt-1">{errors.Password}</p>}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="relative w-full md:w-auto flex items-center space-x-5">
                            <input
                                type="checkbox"
                                checked={RememberMe}
                                onChange={() => setRememberMe(!RememberMe)} // Correctly toggles the state
                                className="appearance-none border border-gray-300 checked:bg-red-500 checked:border-red-500 p-2 border-gray-300 focus:outline-none focus:ring-white-400 focus:border-transparent "
                            />
                            <label htmlFor="rememberMeCheckbox" className="text-gray-500">Remember Me</label>
                        </div>

                        {/* Login Button */}
                        <div className="relative w-full md:w-auto flex items-center space-x-5">
                            <button
                                type="submit"
                                className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2">
                                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right">
                                    <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="m12 16 4-4-4-4" />
                                </svg>
                                <span className="text-xs md:text-sm">Login</span>
                            </button>
                        </div>
                    </form>
                    <p className="text-gray-700 mt-3 text-sm">Don't have an account? <a href="#" className="font-poppins text-red-500">Sign Up</a></p>
                </div>
                <div className="bg-white flex justify-center rounded-lg">
                    <img src={LoginSVG} className="w-min" alt="Login Illustration" />
                </div>
            </div>
        </div>
    );
};

export default Login;