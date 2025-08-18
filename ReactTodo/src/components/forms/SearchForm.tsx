import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [queryResults, setQueryResults] = useState<any[]>([]);
    const { authenticatedRequest } = useAuth();

    useEffect(() => {
        if (query.length >= 3) {
            const fetchQueryData = async () => {
                try {
                    const response = await authenticatedRequest(`/tasks?query=${query}`);
                    
                    if (response.success !== true) {
                        throw new Error("Failed to fetch data");
                    }

                    setQueryResults(response.data.tasks);
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        toast.error("An unexpected error occurred while fetching data.");
                    }
                }
            };

            fetchQueryData();
        } else {
            setQueryResults([]); // reset when query is too short
        }
    }, [query, authenticatedRequest]);

    const handleSearchQuery = (e: React.MouseEvent<HTMLLIElement>) => {
        const taskId = e.currentTarget.getAttribute('data-id');
        if (taskId) {
            // Navigate to the task details page or perform any action with the task ID
            navigate('/task/' + taskId);
            setQuery(""); // Clear the search input after selection
        }
    };

    return (
        <div className="relative w-full md:w-auto text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-search w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </svg>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                placeholder="Search your task here.."
            />

            {/* Optional: Show results */}
            {queryResults.length > 0 && (
                <ul className="absolute bg-white border mt-2 rounded-lg w-full md:w-64 shadow-lg max-h-60 overflow-y-auto z-10">
                    {queryResults.map((task) => (
                        <li data-id={task.id} onClick={handleSearchQuery} key={task.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            {task.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchForm;