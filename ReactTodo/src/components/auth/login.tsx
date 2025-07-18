import React from "react";
import LoginSVG from '../../assets/images/login.svg';

const Login: React.FC = () => {
    return (
        <div className="flex-1 p-4 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-2 md:p-6  shadow-lg rounded-lg">
                <div className="p-5 md:px-10 md:py-10 font-inter">
                    <h2 className="text-gray-700 mb-5 font-demi font-bold text-3xl" >Sign Up</h2>
                    <form className="flex space-y-5 flex-col text-gray-700 text-sm font-poppins">
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <input type="text" className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700" placeholder="Enter Username" />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lock-icon lucide-lock w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <input type="text" className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700" placeholder="Enter Password" />
                        </div>
                        <div className="relative w-full md:w-auto flex items-center space-x-5">
                            <input type="checkbox" className="appearance-none border border-gray-300 checked:bg-red-500 checked:border-red-500 p-2 border-gray-300 focus:outline-none  focus:ring-white-400 focus:border-transparent " placeholder="Confirm Password" />
                            <label htmlFor="checkbox text-gray-500">Remember Me</label>
                        </div>
                        <div className="relative w-full md:w-auto flex items-center space-x-5">
                            <button className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-arrow-up-icon lucide-circle-arrow-up"><circle cx="12" cy="12" r="10" /><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /></svg><span className="text-xs md:text-sm">Login</span></button>
                        </div>

                    </form>
                    <p className="text-gray-700 mt-3 text-sm">Already have an account? <a href="#" className="font-poppins text-gray-500 text-red-500" >Sign In</a></p>

                </div>
                <div className="bg-white flex justify-center rounded-lg">
                    <img src={LoginSVG} className="w-min" />
                </div>
            </div>

        </div>
    );
};

export default Login;