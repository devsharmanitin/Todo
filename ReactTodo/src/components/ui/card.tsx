import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Party from '../../assets/images/party.svg';

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



    return (
        <div className={`border border-gray-200 rounded-lg py-4 px-3 relative font-poppins ${className}`} >
            <div className="flex items-center justify-between">
                {/* Circle */}
                <div
                    className={`w-5 h-5 border-2 rounded-full mt-1 flex-shrink-0 absolute left-3 top-3`}
                    style={{ borderColor: circleColor }}
                ></div>

                {/* Ellipsis Icon */}
                <div className="w-5 h-5 text-gray-500 absolute right-5">
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
                </div>
            </div>

            <div className="flex items-center space-x-4 px-6">
                <div className="flex-1">
                    <h2 className="text-gray-700 mb-3 font-bold">{title}</h2>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
                {image && (
                    <div className="w-15 h-15 md:w-20 md:w-20 rounded-lg mt-2">
                        <img
                            src={'http://localhost:8000/storage/' + image}
                            alt="task"
                            className="w-full rounded-lg object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { //  Explicitly define the event type
                                (e.target as HTMLImageElement).onerror = null; // Type assertion
                                (e.target as HTMLImageElement).src = Party; // Type assertion
                            }}
                        />
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default TaskCard;
