import GridContainer from "../../ui/gridcontainer";
import Party from "../../../assets/images/party.svg";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';

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

function ViewTask() {
    const { taskID } = useParams();
    const { authenticatedRequest } = useAuth();

    const [TaskData, setTaskData] = useState<ITask | null>(null);

    useEffect( () => {
        const fetchtaskData = async () => {
            try {
                const response = await authenticatedRequest(`tasks/${taskID}`);
                if (!response.success) {
                    toast.error('Something went wrong');
                    return;
                }
                setTaskData(response.data.task);
            } catch (error: unknown) {
                if( error instanceof Error ) {
                    toast.error(error.message);
                } else {
                    toast.error('Caught an unknown error type:');
                }
            }
        }
        fetchtaskData();
    }, [taskID] )

    return (
        <GridContainer className="md:mt-0 ">
            <div className="bg-white md:p-4 rounded-3xl shadow-lg border border-gray-300 p-4">

                <div className="py-5 px-4 relative font-poppins">

                    <div className="flex items-center space-x-4">

                        <div className="w-22 h-22 rounded-lg mt-2">
                            <img src={Party} className="w-full" />
                        </div>
                        <div className="flex-1">
                            <h2 className='text-gray-700 mb-3 font-bold'>{TaskData?.title}</h2>
                            <p className='text-xs text-gray-500 mb-2'>Priority: <span className='text-red-500'>{TaskData?.priority}</span></p>
                            <p className='text-xs text-gray-500 mb-2'>Status: <span className='text-green-400'>{TaskData?.status}</span></p>
                            <p className='text-xs text-gray-500 mb-2'>Completed: <span className='text-gray-400'>2 Days ago</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-3 mt-3 ">
                        <p className='text-gray-500 text-sm'>
                            {TaskData?.description}
                        </p>

                    </div>
                    <div className="flex justify-end space-x-2 items-center mb-4 mt-10 font-demi">
                        <button className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                        <button className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </GridContainer >
    )
}


export default ViewTask;