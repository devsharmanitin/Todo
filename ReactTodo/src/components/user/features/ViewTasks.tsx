import GridContainer from "../../ui/gridcontainer";
import Party from "../../../assets/images/party.svg";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import Modal from "../../ui/modal";
import Lucy from "../../../assets/images/lucy.svg";



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

interface User {
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
    status: StatusProps;
    status_color: string; // Assuming your backend provides colors or you map them
    priority: PriorityProps;
    priority_color: string; // Assuming your backend provides colors or you map them
    date: string;
    image: string | null;
    completed_at?: string; // Optional, for completed tasks
}

interface TaskSpecificPermission {
    task_id: number;
    task_title: string;
    permissions: {
        can_view: boolean;
        can_edit: boolean;
        can_delete: boolean;
        can_invite: boolean;
    };
}


function ViewTask() {
    const navigate = useNavigate();
    const { authenticatedRequest, hasSpecificPermission } = useAuth();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { id } = useParams();
    const [TaskData, setTaskData] = useState<ITask | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);

    useEffect(() => {
        const fetchtaskData = async () => {
            try {
                const response = await authenticatedRequest(`/tasks/${id}`);
                if (!response.success) {
                    toast.error('Something went wrong');
                    return;
                }
                setTaskData(response.data.task);
                console.log("TaskData", response.data.task);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Caught an unknown error type:');
                }
            }
        }
        fetchtaskData();

        const fetchUser = async () => {
            try {
                const response = await authenticatedRequest('/users');
                if (!response.success) {
                    toast.error('Failed to fetch users');
                    return;
                }
                setUsers(response.data);
                // Handle user data if needed
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Caught an unknown error type:');
                }
            }
        }
        fetchUser();
    }, [id]);


    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();

        const confirmed = window.confirm("Do you want to delete the Task?");
        if (!confirmed) return; // stop if user cancels

        try {
            const response = await authenticatedRequest(`/tasks/delete/${id}`, {
                method: 'DELETE'
            });

            if (response?.success) {
                toast.success("Task deleted successfully.");
                navigate('/index');
            } else {
                toast.error(response?.message || "Failed to delete the task.");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    const handlePermissionChange = (
        taskId: number,
        userId: number,
        permission: keyof TaskSpecificPermission["permissions"],
        isChecked: boolean
    ) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => {
                if (u.id !== userId) return u;

                const updatedSpecific = [...(u.permissions?.specific || [])];
                const existing = updatedSpecific.find((p) => p.task_id === taskId);


                if (isChecked) {
                    console.log("i check");
                    if (existing) {
                        existing.permissions[permission] = true;
                    } else {
                        console.log("i check");
                        updatedSpecific.push({
                            task_id: taskId,
                            task_title: "", // optional
                            permissions: {
                                can_view: false,
                                can_edit: false,
                                can_delete: false,
                                can_invite: false,
                                [permission]: true, // set only the one checked
                            },
                        });
                    }
                } else {
                    if (existing) {
                        existing.permissions[permission] = false;
                    }
                }



                return {
                    ...u,
                    permissions: {
                        ...u.permissions,
                        specific: updatedSpecific,
                    },
                };

            })
        );
    };

    const handleMemberInvite = async (userId: number) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        try {
            const response = await authenticatedRequest(`/tasks/${id}/invite`, {
                method: "POST",
                body: JSON.stringify({
                    task_id: id,
                    user_id: user.id,
                    permissions: user.permissions || [],
                }),
            });

            if (response.success) {
                toast.success(`Invite sent to ${user.name}`);
            } else {
                toast.error(response?.message || "Failed to send invite");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error sending invite");
        }
    };

    const handleMemberUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value.trim();

        if (email.length < 3) {
            setSearchResults([]);
            return;
        }

        // filter your global user list (say allUsers)
        const matches = users.filter((user) =>
            user.email.toLowerCase().includes(email.toLowerCase())
        );

        setSearchResults(matches);
    };

    // when user clicks from dropdown
    const handleSelectUser = (selectedUser: any) => {
        // check if already in users
        const alreadyExists = users.some((u) => u.id === selectedUser.id);

        if (!alreadyExists) {
            setUsers((prev) => [...prev, selectedUser]);
        }

        // clear search results after selection
        setSearchResults([]);
    };

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
                            <p className='text-xs text-gray-500 mb-2'>Priority: <span className='text-red-500'>{TaskData?.priority.title}</span></p>
                            <p className='text-xs text-gray-500 mb-2'>Status: <span className='text-green-400'>{TaskData?.status.title}</span></p>
                            <p className='text-xs text-gray-500 mb-2'>Completed: <span className='text-gray-400'>2 Days ago</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-3 mt-3 ">
                        <p className='text-gray-500 text-sm'>
                            {TaskData?.description}
                        </p>

                    </div>
                    <div className="flex justify-end space-x-2 items-center mb-4 mt-10 font-demi">
                        <button onClick={handleDelete} className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                        <button className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                        </button>
                        <button onClick={() => setIsOpenModal(true)} className='bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus-icon lucide-user-plus w-5 h-5 md:w-6 md:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                            <span className='text-xs md:text-sm'>Invite</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Invitation Modal */}

            {isOpenModal && (
                <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="Send an Invite to a New Member">
                    <div className="space-y-4">
                        <h3 className="text-xl">Email</h3>
                        <div className="flex items-center md:space-x-4 justify-start flex md:flex-row flex-col items-center space-x-4 relative">
                            <input type="text" id="invite-member" onChange={handleMemberUser} placeholder="Enter email address" className="w-full p-2 border border-gray-300 rounded-lg" />
                            {searchResults.length > 0 && (
                                <ul className="absolute bg-white border mt-20 border-gray-300 rounded-lg w-full md:w-64 shadow-lg max-h-60 overflow-y-auto z-10">
                                    {searchResults.map((user) => (

                                        <li
                                            key={user.id}
                                            data-id={user.id}
                                            onClick={() => handleSelectUser(user)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {user.name} ({user.email})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <h3 className="text-xl">Members</h3>
                        <ul className="space-y-4">
                            {users.map((user) => (
                                console.log("User Permissions", user.permissions),
                                <li key={user.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-5">
                                            <img
                                                className="w-10 h-10 border border-red-500 rounded-full object-cover"
                                                src={user.image || Lucy}
                                                alt={`${user.name} Avatar`}
                                            />
                                            <div className="flex flex-col">
                                                <h3>{user.name}</h3>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Permissions */}
                                        <div className="flex space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`can_view_${user.id}`}
                                                    checked={hasSpecificPermission(Number(id), "can_view", user)}
                                                    onChange={(e) =>
                                                        handlePermissionChange(Number(id), user.id, "can_view", e.target.checked)
                                                    }
                                                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                                                    value="can_edit"
                                                />
                                                <span className="text-sm">Can View</span>
                                            </label>

                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`can_view_${user.id}`}
                                                    checked={hasSpecificPermission(Number(id), "can_edit", user)}
                                                    onChange={(e) =>
                                                        handlePermissionChange(Number(id), user.id, "can_edit", e.target.checked)
                                                    }
                                                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                                                    value="can_edit"
                                                />
                                                <span className="text-sm">Can Edit</span>
                                            </label>

                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`can_delete_${user.id}`}
                                                    checked={hasSpecificPermission(Number(id), "can_delete", user)}
                                                    onChange={(e) =>
                                                        handlePermissionChange(Number(id), user.id, "can_delete", e.target.checked)
                                                    }
                                                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                                                    value="can_delete"
                                                />
                                                <span className="text-sm">Can Delete</span>
                                            </label>
                                        </div>

                                        <button
                                            className="bg-red-500 text-white px-4 py-2 w-max rounded text-nowrap"
                                            onClick={() => handleMemberInvite(user.id)}
                                        >
                                            Send Invite
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </Modal>
            )}
            {/* End Invitation Modal */}
        </GridContainer >
    )
}


export default ViewTask;