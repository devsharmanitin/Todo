import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Party from '../../assets/images/party.svg';
import Modal from './modal';
import EditTaskForm from '../forms/EditTaskForm';
import { Link } from 'react-router-dom';

interface TaskCardProps {
    id: number;
    title: string;
    description: string;
    status: StatusProps;
    statusColor: string;
    priority?: PriorityProps;
    priorityColor?: string;
    date?: string;
    image?: string;
    circleColor?: string;
    className?: string;
    category?: CategoryProps
}

interface PriorityProps {
    id: number,
    title: string,
    color_code?: string
}

interface StatusProps {
    id: number,
    title: string,
    color_code?: string
}

interface CategoryProps {
    id: number,
    title: string,
    color_code?: string
}


const TaskCard: React.FC<TaskCardProps> = ({
    id,
    title,
    description,
    status,
    statusColor,
    priority,
    priorityColor,
    date,
    image,
    circleColor = 'gray',
    className = '',
}) => {

    const { user, hasSpecificPermission } = useAuth();
    const [showMetaBox, setShowMetaBox] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditModal = (e: React.MouseEvent) => {
        setIsEditModalOpen(true);
    }



    return (
        <>
            <div className={`border border-gray-200 rounded-lg py-4 px-3 relative font-poppins mb-5 ${className}`} >
                <div className="flex items-center justify-between">
                    {/* Circle */}
                    <div
                        className={`w-5 h-5 border-2 rounded-full mt-1 flex-shrink-0 absolute left-3 top-3`}
                        style={{ borderColor: circleColor }}
                    ></div>

                    {/* Ellipsis Icon */}
                    <div className="w-5 h-5 text-gray-500 absolute right-5 z-20 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowMetaBox(!showMetaBox);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-ellipsis"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                        <div className={`absolute right-5 top-0 mt-2 w-48 bg-white shadow-lg z-10 border border-gray-300 rounded-lg group-hover:block ${showMetaBox === true ? 'block' : 'hidden'}`}>
                            <ul className="py-1">
                                {
                                    hasSpecificPermission(Number(id), "can_edit", user) && (
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleEditModal}>Edit</li>
                                    )
                                }
                                {
                                    hasSpecificPermission(Number(id), "can_delete", user) && (
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                    )
                                }
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Details</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Link key={id} to={`/task/${id}`}>
                    <div className="flex items-center space-x-4 px-6">
                        <div className="flex-1">
                            <h2 className="text-gray-700 mb-3 font-bold">{title}</h2>
                            <p className="text-gray-500 text-sm">{description}</p>
                        </div>
                        {image && (
                            <div className="w-15 h-15 md:w-15 md:w-15 rounded-lg mt-2">
                                <img
                                    src={'http://localhost:8000/storage/' + image}
                                    alt="task"
                                    className="rounded-lg object-cover"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { //  Explicitly define the event type
                                        (e.target as HTMLImageElement).onerror = null; // Type assertion
                                        (e.target as HTMLImageElement).src = Party; // Type assertion
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Link>

                <div className="flex flex-wrap justify-between items-center mt-3 px-4 space-y-2 md:space-y-0 md:flex-nowrap">
                    {priority && (
                        <p className="text-xs text-gray-500">
                            Priority: <span style={{ color: priorityColor }}>{priority.title}</span>
                        </p>
                    )}
                    <p className="text-xs text-gray-500">
                        Status: <span style={{ color: statusColor }}>{status.title}</span>
                    </p>
                    {date && (
                        <p className="text-xs text-gray-500">
                            Created On: <span className="text-gray-400">{date}</span>
                        </p>
                    )}
                </div>
            </div >


            {
                isEditModalOpen && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
                        <EditTaskForm id={id} />
                    </Modal>
                )
            }

        </>

    );
};

export default TaskCard;
