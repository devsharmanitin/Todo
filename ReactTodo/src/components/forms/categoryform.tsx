import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";


const CategoryForm = () => {

    const { authenticatedRequest } = useAuth();

    const [title, setTitle] = useState("");


    const handleStatusSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await authenticatedRequest("/categories/create", {
                method: "POST",
                body: JSON.stringify({ title }),
            });
            if (!response.success) {
                toast.error(response.message);
            }
            toast.success(response.message);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            } else if (typeof error === 'string') {
                console.error("Error message:", error);
            } else {
                console.error("An unknown error occurred.");
            }
        }
    }

    return (
        <form className="flex space-x-4" onSubmit={(e) => handleStatusSubmission(e)}>
            <div className="space-y-4 flex-1">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="title" className="text-gray-700">Title</label>
                    <input
                        type="text" value={title} onChange={(e) => setTitle(e.target.value)} id="title" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="flex flex-col space-y-2">
                    <button className='w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drafting-compass-icon lucide-drafting-compass"><path d="m12.99 6.74 1.93 3.44" /><path d="M19.136 12a10 10 0 0 1-14.271 0" /><path d="m21 21-2.16-3.84" /><path d="m3 21 8.02-14.26" /><circle cx="12" cy="5" r="2" /></svg>
                        <span className='text-xs md:text-sm'>Submit</span>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CategoryForm;