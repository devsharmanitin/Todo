import React, { useEffect, useState } from "react";
import StatusForm from "../forms/statusform";
import CategoryForm from "../forms/categoryform";
import PriorityForm from "../forms/priorityform";
import Modal from "../ui/modal";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";


interface CategoryOptionProps {
    id: number;
    title: string;
    color_code: string
}


const Categories = () => {
    const { authenticatedRequest } = useAuth();
    const [isOpenStatusModal, setOpenStatusModal] = useState<boolean>(false);
    const [isOpenCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
    const [isOpenPriorityModal, setOpenPriorityModal] = useState<boolean>(false);

    const [Priorities, SetPriorities] = useState<CategoryOptionProps[]>([]);
    const [Categories, SetCategories] = useState<CategoryOptionProps[]>([]);
    const [Statuses, Setstatuses] = useState<CategoryOptionProps[]>([]);

    useEffect(() => {
        const fetchPriorityData = async () => {
            try {
                const response = await authenticatedRequest("/priorities");
                if (!response.success === true) {
                    toast.error(response.message);
                    return;
                }
                toast.success(response.message);
                SetPriorities(response.data.priorities);
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
        fetchPriorityData();
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await authenticatedRequest("/categories");
                if (!response.success === true) {
                    toast.error(response.message);
                    return;
                }
                toast.success(response.message);
                SetCategories(response.data.categories);
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
        fetchCategoryData();
    }, []);

    useEffect(() => {
        const fetchStatusData = async () => {
            try {
                const response = await authenticatedRequest("/statuses");
                if (!response.success === true) {
                    toast.error(response.message);
                    return;
                }
                toast.success(response.message);
                console.log("response.data.statuses:- ", response.data.statuses);
                Setstatuses(response.data.statuses)
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
        fetchStatusData();
    }, []);

    return (
        <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">
            <div className="flex flex-col md:flex-row justify-between mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-demi">Task Categories</h2>
                <div className="flex flex-col md:flex-row space-x-1">
                    <button className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-plus-icon lucide-badge-plus text-red-500"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><line x1="12" x2="12" y1="8" y2="16" /><line x1="8" x2="16" y1="12" y2="12" /></svg><span className="text-sm text-gray-700 font-demi">Add Category</span></button>
                    <button className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-step-back-icon lucide-step-back text-red-500"><path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" /><path d="M21 20V4" /></svg><span className="text-sm text-gray-700 font-demi">Go Back</span></button>
                </div>
            </div>

            <div className="flex flex-col mb-10">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 font-demi">Task Status</h2>
                    <div className="flex flex-col md:flex-row space-x-1">
                        <button onClick={() => setOpenStatusModal(true)} className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus text-red-500"><path d="M5 12h14" /><path d="M12 5v14" /></svg><span className="text-sm text-gray-700 font-demi">Add Task Status</span></button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-3xl">
                    <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden text-gray-500 font-poppins" >
                        <thead className="bg-gray-100 font-demi text-gray-500">
                            <tr>
                                <th className="px-4 py-2 border-b border border-gray-300">SN</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Task Status</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Statuses && Statuses.length > 0 ? (
                                Statuses.map((status, index) => (
                                    <tr key={status.id}>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {status.title}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            <div className="flex gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => setOpenStatusModal(true)}
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-pencil">
                                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                                        <path d="m15 5 4 4" />
                                                    </svg>
                                                    <span className="text-red-500">Edit</span>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-trash">
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                    <span className="text-red-500">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                        No statuses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isOpenStatusModal} onClose={() => setOpenStatusModal(false)} title="Add Task Status">
                    <StatusForm></StatusForm>
                </Modal>

            </div>

            <div className="flex flex-col mb-10">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 font-demi">Task Priority</h2>
                    <div className="flex flex-col md:flex-row space-x-1">
                        <button onClick={() => setOpenPriorityModal(true)} className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus text-red-500"><path d="M5 12h14" /><path d="M12 5v14" /></svg><span className="text-sm text-gray-700 font-demi">Add Task Priority</span></button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-3xl">
                    <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden text-gray-500 font-poppins" >
                        <thead className="bg-gray-100 font-demi">
                            <tr>
                                <th className="px-4 py-2 border-b border border-gray-300">SN</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Task Priority</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Priorities && Priorities.length > 0 ? (
                                Priorities.map((priority, index) => (
                                    <tr key={priority.id}>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {priority.title}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            <div className="flex gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => setOpenPriorityModal(true)}
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-pencil">
                                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                                        <path d="m15 5 4 4" />
                                                    </svg>
                                                    <span className="text-red-500">Edit</span>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-trash">
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                    <span className="text-red-500">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                        No Priority found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isOpenPriorityModal} onClose={() => setOpenPriorityModal(false)} title="Add Task Priority">
                    <PriorityForm></PriorityForm>
                </Modal>

            </div>

            <div className="flex flex-col mb-10">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 font-demi">Task Categories</h2>
                    <div className="flex flex-col md:flex-row space-x-1">
                        <button onClick={() => setOpenCategoryModal(true)} className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus text-red-500"><path d="M5 12h14" /><path d="M12 5v14" /></svg><span className="text-sm text-gray-700 font-demi">Add Task Category</span></button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-3xl">
                    <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden text-gray-500 font-poppins" >
                        <thead className="bg-gray-100 font-demi">
                            <tr>
                                <th className="px-4 py-2 border-b border border-gray-300">SN</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Task Category</th>
                                <th className="px-4 py-2 border-b border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Categories && Categories.length > 0 ? (
                                Categories.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            {category.title}
                                        </td>
                                        <td className="px-4 py-2 border-t border border-gray-300">
                                            <div className="flex gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => setOpenCategoryModal(true)}
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-pencil">
                                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                                        <path d="m15 5 4 4" />
                                                    </svg>
                                                    <span className="text-red-500">Edit</span>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    className="bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-trash">
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                    <span className="text-red-500">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                        No Category found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isOpenCategoryModal} onClose={() => setOpenCategoryModal(false)} title="Add Task Category">
                    <CategoryForm></CategoryForm>
                </Modal>

            </div>


        </div>
    );

}

export default Categories;