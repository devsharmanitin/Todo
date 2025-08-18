import React, { useEffect, useState } from 'react';
import DragDropUploader from '../ui/DragDropUploader';
import { useAuth } from '../../context/AuthContext';

interface EditTaskProps {
    id: number;
}

const EditTaskForm = ({ id }: EditTaskProps) => {
    const { authenticatedRequest } = useAuth();

    const [TaskData, setTaskData] = useState<any>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await authenticatedRequest('/tasks/' + id, {
                    method: "GET",
                });
                if (!response.success) {
                    console.log("Error:", response.message);
                    return;
                }

                const task = response.data.task;
                setTaskData(task);

                // pre-fill form state
                setTitle(task.title || "");
                setDescription(task.description || "");
                setDate(task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "");
                setSelectedPriority(task.priority?.id || null);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error fetching task details:", error.message);
                } else {
                    console.error(error);
                }
            }
        };

        fetchTaskDetails();
    }, [id, authenticatedRequest]);

    const handleTaskSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("due_date", date);
            if (selectedPriority) {
                formData.append("priority_id", selectedPriority.toString());
            }
            if (image) {
                formData.append("image", image);
            }

            const response = await authenticatedRequest('/tasks/update/' + id, {
                body: formData,
            });

            if (!response.success) {
                console.error("Error updating task:", response.message);
            } else {
                console.log("Task updated successfully!");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error updating task:", error.message);
            } else {
                console.error(error);
            }
        }
    };

    return (
        <form className="flex space-x-4" onSubmit={handleTaskSubmission}>
            <div className="space-y-4 flex-1">
                {/* Title */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="title" className="text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Date */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-gray-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        id="date"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Priority */}
                <legend className="text-gray-700 text-base mb-2">Priority</legend>
                <div className="flex flex-row space-x-4">
                    {TaskData?.priority && (
                        <div key={TaskData.priority.id} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`priority-${TaskData.priority.id}`}
                                name="task-priority"
                                value={TaskData.priority.id}
                                checked={selectedPriority === TaskData.priority.id}
                                onChange={() => setSelectedPriority(TaskData.priority.id)}
                                className="appearance-none border border-gray-300 p-2 rounded-full focus:outline-none focus:border-transparent cursor-pointer"
                                style={{
                                    backgroundColor: TaskData.priority.color_code,
                                }}
                            />
                            <label
                                htmlFor={`priority-${TaskData.priority.id}`}
                                className="text-gray-700 text-sm cursor-pointer"
                            >
                                {TaskData.priority.title}
                            </label>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="description" className="text-gray-700">Message</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y min-h-[100px]"
                        placeholder="Enter task description here..."
                        rows={4}
                    />
                </div>

                {/* Submit */}
                <div className="flex flex-col space-y-2">
                    <button
                        type="submit"
                        className="w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-drafting-compass">
                            <path d="m12.99 6.74 1.93 3.44" />
                            <path d="M19.136 12a10 10 0 0 1-14.271 0" />
                            <path d="m21 21-2.16-3.84" />
                            <path d="m3 21 8.02-14.26" />
                            <circle cx="12" cy="5" r="2" />
                        </svg>
                        <span className="text-xs md:text-sm">Update Information</span>
                    </button>
                </div>
            </div>

            {/* Image Uploader */}
            <div className="space-y-4">
                <DragDropUploader
                    onFilesSelected={(files) => {
                        if (files.length > 0) {
                            setImage(files[0]); // only first file
                        }
                    }}
                    width="200px"
                    height="200px"
                />
            </div>
        </form>
    );
};

export default EditTaskForm;
