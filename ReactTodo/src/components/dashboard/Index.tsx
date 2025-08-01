import toast, { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';

// Import your assets and components
import Lucy from '../../assets/images/lucy.svg'; // Ensure this path is correct
import Party from '../../assets/images/party.svg'; // Ensure this path is correct
import { ProgressChart } from '../progress/Chart'; // Ensure this path is correct
import Modal from '../ui/modal'; // Ensure this path is correct
import TaskCard from '../ui/card'; // Ensure this path is correct
import GridContainer from '../ui/gridcontainer'; // Ensure this path is correct
import DragDropUploader from '../ui/dragdropuploader';
import TruncateWords from '../../services/helper.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

// Define TypeScript interfaces for better type safety and readability
interface IUser {
    id: number;
    name: string;
    email: string;
    image: string | null;
    // Add other user properties if needed
}

interface ITask {
    id: number;
    title: string;
    description: string;
    status: string;
    status_color: string; // Assuming your backend provides colors or you map them
    priority: string;
    priority_color: string; // Assuming your backend provides colors or you map them
    date: string;
    image: string | null;
    completed_at?: string; // Optional, for completed tasks
}

interface IStatusSummary {
    status_id: number;
    name: string;
    count: number;
    percentage: number;
    tasks: ITask[]; // Tasks associated with this status
}

interface IDashboardData {
    user: IUser;
    now: string;
    users: IUser[]; // List of all users/members
    today_tasks: ITask[];
    upcoming_tasks: ITask[];
    completed_tasks: ITask[];
    status_summary: IStatusSummary[];
    total_tasks: number;
}

interface iPriority {
    id: number;
    title: string;
    description: string;
    color_code: string;
}

interface iStatus {
    id: number;
    title: string;
}

interface iCategory {
    id: number;
    title: string;
}

interface ITaskData {
    priorities: iPriority[];
    statuses: iStatus[];
    categories: iCategory[];
}


function Home() {
    const { authenticatedRequest } = useAuth();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
    const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [taskdata, setTaskData] = useState<ITaskData | null>(null);
    const [refreshTasks, setRefreshTasks] = useState(false);

    const [title, setTitle] = useState("");
    const [description, handleDescriptionChange] = useState("");
    const [date, setDate] = useState("");
    const [selectedPriority, handlePriorityChange] = useState(0);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {

            const response: any = await authenticatedRequest("/dashboard");
            console.log("response", response);
            if (response.success) {
                setDashboardData(response.data); // Set the 'data' part of the response

            } else {
                toast.error(response.message || "Something went wrong. Please try again.");

            }
            setLoading(false);
        };

        const fetchTaskDate = async () => {
            const taskResponse = await authenticatedRequest("/tasks/create");
            if (taskResponse.success) {
                setTaskData(taskResponse.data);
            } else {
                toast.error(taskResponse.message || "something went wrong| please try again");
            }
        }

        fetchDashboardData();
        fetchTaskDate();

    }, [refreshTasks]); // Empty dependency array ensures this runs only once after initial render


    console.log("DD", dashboardData);
    const handleTaskSubmission = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!title || !date || !description || !selectedPriority || !image) {
            return toast.error(" Fields are required ");
        }

        var start_date = new Date();
        var formatted_date = start_date.toISOString().split('T')[0];

        try {
            const response = await authenticatedRequest('/tasks/store', {
                method: "POST",
                body: JSON.stringify({
                    "title": title,
                    "description": description,
                    "priority_id": selectedPriority,
                    "due_date": date,
                    "image[]": image,
                    "start_date": formatted_date
                }),

            });
            if (response.success === false) {
                console.log("Task Add failed:- ", response);
            }
            console.log("submission COmplete:- ", response);
            setRefreshTasks(prev => !prev);
            setIsOpenTaskModal(false);
        } catch (error) {
            console.log("Error on Task Submission:- ", error);
            setIsOpenTaskModal(false);

        }

    }

    // Display loading state
    if (loading) {
        return (
            <div className="flex-1 p-4 md:p-10 flex justify-center items-center h-screen">
                <p className="text-gray-700 text-lg">Loading dashboard data...</p>
                <Toaster position="top-center" reverseOrder={false} />
            </div>
        );
    }

    // If data failed to load and not loading, you might want to show an error message or redirect
    if (!dashboardData) {
        return (
            <div className="flex-1 p-4 md:p-10 flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Failed to load dashboard. Please try again.</p>
                <Toaster position="top-center" reverseOrder={false} />
            </div>
        );
    }


    // Now that we know dashboardData is not null, we can safely access its properties
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} /> {/* Toaster for notifications */}

            {/* main Container */}
            <div className="flex-1">

                {/* Top Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-poppins px-2 space-y-4 md:space-y-0">
                    <h1 className='text-2xl md:text-4xl text-gray-900 font-bold'>Welcome Back {dashboardData.user.name}👋</h1>
                    <div className="flex items-center space-x-4 md:space-x-10">
                        <div className="flex space-x-1">
                            {/* Display first 5 users or fewer if not enough */}
                            {dashboardData.users.slice(0, 5).map((user, i) => (
                                <a key={user.id || i} href="#" className="decoration-none w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white">
                                    <img src={user.image || Lucy} className="w-full h-full object-cover rounded-full" alt={user.name} />
                                </a>
                            ))}
                        </div>

                        <button onClick={() => setIsOpenModal(true)} className='bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus-icon lucide-user-plus w-5 h-5 md:w-6 md:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                            <span className='text-xs md:text-sm'>Invite</span>
                        </button>

                        {/* Invitation Modal */}
                        {isOpenModal && (
                            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="Send an Invite to a New Member">
                                <div className="space-y-4">
                                    <h3 className="text-xl">Email</h3>
                                    <div className="flex items-center md:space-x-4 justify-start flex md:flex-row flex-col items-center space-x-4">
                                        <input type="text" placeholder="Enter email address" className="w-full p-2 border border-gray-300 rounded-lg" />
                                        <button className="bg-red-500 text-white px-4 py-2 w-max rounded text-nowrap" >Send Invite</button>
                                    </div>
                                    <h3 className="text-xl">Members</h3>
                                    <ul className="space-y-4">
                                        {dashboardData.users.map((user) => (
                                            <li key={user.id}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-5">
                                                        <img className="w-10 h-10 border border-red-500 rounded-full object-cover" src={user.image || Lucy} alt={`${user.name} Avatar`} />
                                                        <div className="flex flex-col">
                                                            <h3>{user.name}</h3>
                                                            <p>{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <select id={`permissions-${user.id}`} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-600 block w-max p-2.5 dark:bg-red-500 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
                                                        <option value="can-edit">can edit</option>
                                                        <option value="can-delete">can delete</option>
                                                    </select>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Modal>
                        )}
                        {/* End Invitation Modal */}

                    </div>
                </div>


                {/* Data Section */}
                <GridContainer className="md:mt-10 border border-gray-300 md:p-6 shadow-lg">
                    <div className="bg-white md:p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4 font-demi">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock-icon lucide-calendar-clock text-red-500"><path d="M16 14v2.2l1.6 1" /><path d="M16 2v4" /><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M3 10h5" /><path d="M8 2v4" /><circle cx="16" cy="16" r="6" /></svg>
                                </div>
                                <span className="text-red-500">To-Do</span>
                            </div>
                            <button onClick={() => setIsOpenTaskModal(true)} className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2">
                                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus text-red-500"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                <span className="text-sm text-gray-500">Add Task</span>
                            </button>

                            {
                                isOpenTaskModal && (
                                    <Modal isOpen={isOpenTaskModal} onClose={() => setIsOpenTaskModal(false)} title="Add New Task" >
                                        <form className="flex space-x-4" onSubmit={(e) => handleTaskSubmission(e)}>
                                            <div className="space-y-4 flex-1">
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor="title" className="text-gray-700">Title</label>
                                                    <input
                                                        type="text" onChange={(e) => setTitle(e.target.value)} id="title" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor="date" className="text-gray-700">Date</label>
                                                    <input type="date" onChange={(e) => setDate(e.target.value)} id="date" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                                </div>
                                                <legend className="text-gray-700 text-base mb-2">Priority</legend> {/* Corrected label for the group */}
                                                <div className="flex flex-row space-x-4">

                                                    {taskdata?.priorities.map((priority) => (
                                                        <div key={priority.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                id={`priority-${priority.id}`}
                                                                name="task-priority"
                                                                value={priority.id}
                                                                checked={selectedPriority === priority.id}
                                                                onChange={(e) => handlePriorityChange(Number(e.target.value))}
                                                                className="appearance-none border border-gray-300 checked:bg-red-500 checked:border-red-500 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent cursor-pointer"
                                                            />
                                                            <label htmlFor={`priority-${priority.id}`} className="text-gray-700 text-sm cursor-pointer">
                                                                {priority.title}
                                                            </label>
                                                        </div>
                                                    ))}



                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor="number" className="text-gray-700">Contact Number</label>
                                                    <textarea
                                                        id="description" // Unique ID for the textarea
                                                        value={description} // Controlled component: value is tied to state
                                                        onChange={(e) => handleDescriptionChange(e.target.value)} // Update state on change
                                                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y min-h-[100px]" // Added resize-y and min-height for better UX
                                                        placeholder="Enter task description here..." // Added a placeholder
                                                        rows={4} // Initial number of rows
                                                    />
                                                </div>

                                                <div className="flex flex-col space-y-2">
                                                    <button className='w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                                                        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drafting-compass-icon lucide-drafting-compass"><path d="m12.99 6.74 1.93 3.44" /><path d="M19.136 12a10 10 0 0 1-14.271 0" /><path d="m21 21-2.16-3.84" /><path d="m3 21 8.02-14.26" /><circle cx="12" cy="5" r="2" /></svg>
                                                        <span className='text-xs md:text-sm'>Update Information</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <DragDropUploader onFilesSelected={(files) => {
                                                    if (files.length > 0) {
                                                        setImage(files[0]); // Assuming you want to handle only the first file
                                                    }
                                                }} width="200px" height="200px" />
                                            </div>
                                        </form>

                                    </Modal>
                                )
                            }

                        </div>
                        <div className="text-sm text-gray-700 mb-4 font-demi">
                            {dashboardData.now} &nbsp;
                            <span className='text-gray-500'>.Today</span>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.today_tasks.map((task) => (

                                < TaskCard
                                    key={task.id}
                                    title={task.title}
                                    description={TruncateWords(task.description, 20)}
                                    status={task.status}
                                    statusColor={task.status_color}
                                    priority={task.priority}
                                    priorityColor={task.priority_color}
                                    date={task.date}
                                    image={task.image || Party} // Fallback image if task.image is null
                                    circleColor={task.status_color} >
                                </TaskCard>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4 font-demi">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check2-icon lucide-calendar-check-2 text-red-500"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" /><path d="m16 20 2 2 4-4" /></svg>
                                    </div>
                                    <span className="text-red-500">Task Progress</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                {dashboardData.status_summary.map((summary) => (
                                    <div key={summary.status_id} className="flex justify-between items-center">
                                        <ProgressChart label={summary.name} percentage={summary.percentage} colorCode={
                                            summary.name === "Completed" ? "#05A301" :
                                                summary.name === "In Progress" ? "#0225FF" :
                                                    summary.name === "Not Started" ? "#F21E1E" : "#888888" // Default color
                                        } />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4 font-demi">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check-icon lucide-clipboard-check text-red-500"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
                                    </div>
                                    <span className="text-red-500">Completed Tasks</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {dashboardData.completed_tasks.map((task) => (
                                    <div key={task.id} className="border border-gray-200 rounded-lg py-5 px-4 relative font-poppins">
                                        <div className="flex items-center justify-between">
                                            {/* Circle */}
                                            <div className={`w-5 h-5 border-2 border-${task.status_color}-500 rounded-full mt-1 flex-shrink-0 absolute left-5 top-4`}></div>
                                            <div className="w-5 h-5 text-gray-500 absolute right-5"><svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg></div>
                                        </div>
                                        <div className="flex items-center space-x-4 px-8">
                                            <div className="flex-1">
                                                <h2 className='text-gray-700 mb-3 font-bold'>{task.title}</h2>
                                                <p className='text-gray-500 text-sm'>{task.description}</p>
                                            </div>
                                            {task.image && (
                                                <div className="w-22 h-22 rounded-lg mt-2">
                                                    <img src={task.image} className="w-full" alt={task.title} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between space-y-3 mt-3 px-8">
                                            <p className='text-xs text-gray-500'>Status: <span className={`text-${task.status_color}-400`}>{task.status}</span></p>
                                            <p className='text-xs text-gray-500'>Completed: <span className='text-gray-400'>{task.completed_at || 'N/A'}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </GridContainer >

            </div >
        </>
    );
}

export default Home;