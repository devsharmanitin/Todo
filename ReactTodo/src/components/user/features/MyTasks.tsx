import GridContainer from "../../ui/gridcontainer";
import TaskCard from "../../ui/card";
import Party from "../../../assets/images/party.svg";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TruncateWords from "../../../services/helper.tsx"


interface PriorityProps {
    id: number,
    title: string,
    color_code: string
}

interface StatusProps {
    id: number,
    title: string,
    color_code: string
}

interface CategoryProps {
    id: number,
    title: string,
    color_code: string
}

interface TaskProps {
    id: number;
    title: string;
    description: string;
    status: StatusProps;
    status_color: string; // Assuming your backend provides colors or you map them
    priority: PriorityProps;
    priority_color: string; // Assuming your backend provides colors or you map them
    date: string;
    image: string | null;
    completed_at?: string;
}

function MyTasks() {
    const { authenticatedRequest } = useAuth();
    const [Tasks, SetTasks] = useState<TaskProps[]>([]);
    const [SingleTask, SetSingleTask] = useState<TaskProps | null>(null);

    useEffect(() => {
        const fetchUsertasks = async () => {
            try {
                const response = await authenticatedRequest('/tasks');
                if (!response.success) {
                    toast.error('Something went wrong');
                    return;
                }
                SetTasks(response.data.tasks || []);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Caught an unknown error type');
                }
            }
        };

        fetchUsertasks();
    }, []);

    const handleTaskView = (id: number) => {
        const task = Tasks.find((t) => t.id === id);
        if (task) {
            SetSingleTask(task);
        }
    };

    return (
        <GridContainer className="md:mt-0 ">
            {/* All Tasks */}
            <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4 font-demi">
                    <h2 className="relative text-2xl font-semibold text-gray-800 before:absolute before:bottom-0 before:w-20 before:h-[3px] before:bg-red-500 before:content-['']">
                        My Tasks
                    </h2>
                </div>
                <div className="space-y-4">
                    {Tasks.map((task) => (
                        <div key={task.id} onClick={() => handleTaskView(task.id)} className="cursor-pointer">
                            <TaskCard
                                id={task.id}
                                title={task.title}
                                description={TruncateWords(task.description, 20)}
                                status={task.status}
                                statusColor={task.status.color_code}
                                priority={task.priority}
                                priorityColor={task.priority.color_code}
                                date={task.date}
                                image={task.image || Party}
                                circleColor={task.status_color}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Single Task Details */}
            <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">
                {SingleTask && (
                    <div className="py-5 px-4 relative font-poppins">
                        <div className="flex items-center space-x-4">
                            <div className="w-22 h-22 rounded-lg mt-2">
                                <img
                                    src={`http://localhost:8000/storage/${SingleTask.image}`}
                                    onError={(e) => {
                                        e.currentTarget.src = Party;
                                    }}
                                    className="w-full"
                                    alt={SingleTask.title}
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-gray-700 mb-3 font-bold">{SingleTask.title}</h2>
                                <p className="text-xs text-gray-500 mb-2">
                                    Priority: <span className="text-red-500">{SingleTask.priority.title}</span>
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    Status: <span className="text-green-400">{SingleTask.status.title}</span>
                                </p>
                                {SingleTask.completed_at && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        Completed: <span className="text-gray-400">{SingleTask.completed_at}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between space-y-3 mt-3">
                            <p className="text-gray-500 text-sm">{SingleTask.description}</p>
                        </div>

                        <div className="flex justify-end space-x-2 items-center mb-4 mt-10 font-demi">
                            <button className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2">
                                {/* Trash Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                            <button className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2">
                                {/* Edit Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GridContainer>
    );
}

export default MyTasks;