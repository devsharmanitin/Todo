import { Toaster } from 'react-hot-toast';
import React from 'react';
import LoginSVG from '../../assets/images/login.svg'; // Assuming you have this SVG import
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, error, dispatch } = useAuth();
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }


    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await login(formData);

        console.log("Resposne:- ", response);

        if( response.requires_verification ) {
            navigate("/verify/profile");
        } else {
            dispatch({ type: 'VERIFIED', payload: true, requires_verification: false });
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
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-check-icon lucide-mail-check w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" />
                            </svg>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700`}
                                placeholder="Enter Email Address"
                            />
                        </div>

                        {/* Password Input Field */}
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700`}
                                placeholder="Enter Password"
                            />
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
                    <p className="text-gray-700 mt-3 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-poppins text-red-500">
                            Sign Up
                        </Link>
                    </p>
                </div>
                <div className="bg-white flex justify-center rounded-lg">
                    <img src={LoginSVG} className="w-min" alt="Login Illustration" />
                </div>
            </div>
        </div>
    );
};

export default Login;