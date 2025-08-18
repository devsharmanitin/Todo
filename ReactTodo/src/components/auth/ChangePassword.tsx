import React from "react";

import GridContainer from "../ui/GridContainer";
import Profile from "../../assets/images/profile.svg";

const ChangePassword: React.FC = () => {

    const handleFormSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted");
    }
    
    return (
        <GridContainer className="md:mt-0 grid md:grid-cols-1">
            <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4 font-demi">
                    <h2 className="relative text-2xl font-semibold text-gray-800 before:absolute before:bottom-0 before:w-20 before:h-[3px] before:bg-red-500 before:content-['']">Change Password</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-start items-center space-x-3 mb-6">
                        <div className="w-24 h-24 rounded-full bg-white overflow-hidden">
                            <img className="w-full h-full object-cover" alt="Profile" src={Profile} />
                        </div>
                        <div className="text-normal text-start font-outfit font-poppins text-bold text-xl">
                            <h2 className="font-semibold text-gray-900">Sundar Gurung</h2>
                            <p className="text-red-500 text-sm">sundargurung580@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="mt-10 rounded-lg border border-gray-300 p-4 font-outfit">
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="currentPassword" className="text-gray-700">Current Password</label>
                            <input type="password" id="currentPassword" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="newPassword" className="text-gray-700">New Password</label>
                            <input type="password" id="newPassword" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</label>
                            <input type="password" id="confirmPassword" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <button onClick={(e) => handleFormSubmission(e)} className='w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drafting-compass-icon lucide-drafting-compass"><path d="m12.99 6.74 1.93 3.44"/><path d="M19.136 12a10 10 0 0 1-14.271 0"/><path d="m21 21-2.16-3.84"/><path d="m3 21 8.02-14.26"/><circle cx="12" cy="5" r="2"/></svg>
                                <span className='text-xs md:text-sm'>Update Password</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </GridContainer >
    )
}

export default ChangePassword;