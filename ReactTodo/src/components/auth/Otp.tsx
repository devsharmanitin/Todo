import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';
import LoginSVG from '../../assets/images/login.svg'; // Assuming you have this SVG import
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface FormDataType {
    otp: string;
}

const LoginOTP = () => {
    // --- State and Hooks ---
    const navigate = useNavigate();
    const { user, authenticatedRequest, dispatch } = useAuth(); // Destructuring the custom hook's function
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = React.useState<FormDataType>({
        otp: "",
    });

    // --- Event Handlers ---

    // Handles changes to the input field and updates the state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Handles form submission
    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // --- Validation ---
        // Changed condition from `null` to an empty string, which is the initial state value
        if (formData.otp === "") {
            const newErrors: { [key: string]: string } = {};
            newErrors.otp = "Please fill the OTP field.";
            setErrors(newErrors);
            return; // Stop the function if validation fails
        }
        
        // --- API Call ---
        try {
            const response = await authenticatedRequest("/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({
                    "otp": formData.otp,
                    "user_id": user?.id
                }),
            });

            if (!response.success) {
                console.log("In TRY Not");
                // Display server-side errors using toast notifications
                toast.error(response.message);
                return; // Stop execution if API call was unsuccessful
            }
            toast.success("Profile verified Successfully");
            dispatch({ type: "VERIFIED", payload: true, requires_verification: response.data.requires_verification });
            // Navigate to the dashboard or home page on successful login
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error: any) {
            // Gracefully handle network or unexpected errors
            
            toast.error(error.message || "An unexpected error occurred.");
            toast.error(error.error_code);
            
        }
    }
    
    // Placeholder function for resending the OTP
    const handleResendOtp = async () => {
        // Here you would implement the logic to resend the OTP
        try {
            const response = await authenticatedRequest("/auth/resend-otp", {
                method: "POST",
                body: JSON.stringify({
                    "user_id": user?.id
                })
            });
            if( !response.success === true ) {
                throw new Error(response.message)
            }
            dispatch({ type: "NOT_VERIFIED", payload: true });
            toast.success("OTP sent again!");
            
        } catch (error) {
            
        }
        // Example API call:
        // await authenticatedRequest("/auth/resend-otp", { method: "POST" });
    }

    // --- Component JSX ---
    return (
        <div className="flex-1 p-4 md:p-10">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-2 md:p-6 shadow-lg rounded-lg">
                <div className="p-5 md:px-10 md:py-10 font-inter">
                    <h2 className="text-gray-700 mb-5 font-demi font-bold text-3xl">Sign In</h2>
                    <form className="flex space-y-5 flex-col text-gray-700 text-sm font-poppins" onSubmit={handleSubmission}>
                        {/* Display errors from the errors state object */}
                        {Object.values(errors).map((error, index) => (
                            <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        ))}

                        <div className="relative w-full md:w-auto">
                            {/* Corrected SVG for the icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-check-icon lucide-mail-check w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" />
                            </svg>
                            <input
                                type="number"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-700`}
                                // Corrected placeholder text to be relevant to OTP
                                placeholder="Enter OTP"
                            />
                        </div>

                        {/* Login Button */}
                        <div className="relative w-full md:w-auto flex items-center space-x-5">
                            <button
                                type="submit"
                                className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right">
                                    <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="m12 16 4-4-4-4" />
                                </svg>
                                <span className="text-xs md:text-sm">Authenticate</span>
                            </button>
                        </div>
                    </form>
                    
                    <div className="flex justify-between items-center mt-3 text-sm">
                        {/* Corrected the link to point to registration and changed the text to 'Sign Up' */}
                        <p className="text-gray-700">
                            <button onClick={handleResendOtp} className="text-red-500 font-poppins">
                                Resend OTP
                            </button>
                        </p>
                        {/* Added a separate button for 'Resend OTP' to trigger a function */}
                        
                    </div>
                </div>
                <div className="bg-white flex justify-center rounded-lg">
                    <img src={LoginSVG} className="w-min" alt="Login Illustration" />
                </div>
            </div>
        </div>
    );
}

export default LoginOTP;