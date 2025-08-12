import React from "react";

import GridContainer from "../ui/gridcontainer";
import Profile from "../../assets/images/profile.svg";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UserProfile: React.FC = () => {
    const { user, authenticatedRequest } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleFormSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await authenticatedRequest("/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.success) {
                console.log(response);
                toast.success("Profile updated successfully");
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.log("error profile");
            toast.error(error instanceof Error ? error.message : "An error occurred");
        }
    };

    return (
        <GridContainer className="md:mt-0 grid md:grid-cols-1">
            <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-demi">Account Information</h2>

                <div className="flex items-center space-x-3 mb-6 font-poppins">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img className="w-full h-full object-cover" alt="Profile" src={Profile} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">{formData.name}</h2>
                        <p className="text-red-500 text-sm">{formData.email}</p>
                    </div>
                </div>

                <form onSubmit={handleFormSubmission} className="space-y-4">
                    {["name", "username", "email", "phone", "address", "city", "state", "country"].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="text-gray-700 capitalize font-poppins">
                                {field.replace("_", " ")}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                id={field}
                                value={(formData as any)[field]}
                                onChange={handleChange}
                                disabled={field === "username" ? true : false}
                                className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 font-inter"
                            />
                        </div>
                    ))}

                    <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Update Information
                    </button>
                </form>
            </div>
        </GridContainer>
    );
};

export default UserProfile;