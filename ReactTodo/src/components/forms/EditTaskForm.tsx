import React, { useEffect, useState } from 'react';
import DragDropUploader from '../ui/dragdropuploader';
import { useAuth } from '../../context/AuthContext';

interface EditTaskProps {
    id: number;
}

const EditTaskForm = ({ id }: EditTaskProps) => {
    const { authenticatedRequest } = useAuth();
    console.log("EDIT ID:- ", id);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const [priorities, setPriorities] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch lists
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [priRes, catRes, staRes] = await Promise.all([
                    authenticatedRequest("/priorities"),
                    authenticatedRequest("/categories"),
                    authenticatedRequest("/statuses"),
                ]);

                if (priRes.success) setPriorities(priRes.data.priorities || []);
                if (catRes.success) setCategories(catRes.data.categories || []);
                if (staRes.success) setStatuses(staRes.data.statuses || []);
            } catch (err) {
                console.error("Error fetching options:", err);
            }
        };

        fetchOptions();
    }, [authenticatedRequest]);

    // Fetch task details
    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                setLoading(true);
                const response = await authenticatedRequest("/tasks/" + id, {
                    method: "GET",
                });

                if (!response.success) {
                    console.log("Error:", response.message);
                    return;
                }

                const task = response.data.task;
                console.log("Fetched task details:", task);

                setTitle(task.title || "");
                setDescription(task.description || "");
                setDate(
                    task.due_date
                        ? new Date(task.due_date).toISOString().split("T")[0]
                        : ""
                );
                setSelectedPriority(task.priority?.id ?? null);
                setSelectedCategory(task.category?.id ?? null);
                setSelectedStatus(task.status?.id ?? null);

                // ✅ Direct log from API values
                console.log("Task details set:", {
                    Cat: task.category?.id,
                    pri: task.priority?.id,
                    sta: task.status?.id,
                });
            } catch (error) {
                console.error("Error fetching task details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetails();
    }, [id, authenticatedRequest]);

    // Submission
    const handleTaskSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("due_date", date);

            if (selectedPriority)
                formData.append("priority_id", selectedPriority.toString());
            if (selectedCategory)
                formData.append("category_id", selectedCategory.toString());
            if (selectedStatus)
                formData.append("status_id", selectedStatus.toString());
            if (image) formData.append("image", image);

            const response = await authenticatedRequest("/tasks/update/" + id, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    // Do NOT set 'Content-Type': browser handles it when using FormData
                },
                body: formData,
            });

            if (!response.success) {
                console.error("Error updating task:", response.message);
            } else {
                console.log("Task updated successfully!");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    if (loading) return <p>Loading task details...</p>;

    return (
        <form className="flex space-x-4" onSubmit={handleTaskSubmission}>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[80vh] pr-2">
                {/* Title */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="title" className="text-gray-700">
                        Title
                    </label>
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
                    <label htmlFor="date" className="text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        id="date"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Priority */}
                <fieldset>
                    <legend className="text-gray-700 text-base mb-2">Priority</legend>
                    <div className="flex flex-row flex-wrap gap-4">
                        {priorities.map((priority) => (
                            <label
                                key={priority.id}
                                htmlFor={`priority-${priority.id}`}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    id={`priority-${priority.id}`}
                                    name="task-priority"
                                    value={priority.id}
                                    checked={selectedPriority === priority.id}
                                    onChange={() => setSelectedPriority(priority.id)}
                                    className="hidden"
                                />
                                <span
                                    className={`w-4 h-4 rounded-full border`}
                                    style={{
                                        backgroundColor:
                                            selectedPriority === priority.id
                                                ? priority.color_code || "#ef4444"
                                                : "transparent",
                                        borderColor: priority.color_code || "#ef4444",
                                    }}
                                />
                                <span className="text-gray-700 text-sm">{priority.title}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Category */}
                <fieldset>
                    <legend className="text-gray-700 text-base mb-2">Category</legend>
                    <div className="flex flex-row flex-wrap gap-4">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                htmlFor={`category-${category.id}`}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    id={`category-${category.id}`}
                                    name="task-category"
                                    value={category.id}
                                    checked={selectedCategory === category.id}
                                    onChange={() => setSelectedCategory(category.id)}
                                    className="hidden"
                                />
                                <span
                                    className={`w-4 h-4 rounded-full border`}
                                    style={{
                                        backgroundColor:
                                            selectedCategory === category.id
                                                ? category.color_code || "#3b82f6"
                                                : "transparent",
                                        borderColor: category.color_code || "#3b82f6",
                                    }}
                                />
                                <span className="text-gray-700 text-sm">{category.title}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Status */}
                <fieldset>
                    <legend className="text-gray-700 text-base mb-2">Status</legend>
                    <div className="flex flex-row flex-wrap gap-4">
                        {statuses.map((status) => (
                            <label
                                key={status.id}
                                htmlFor={`status-${status.id}`}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    id={`status-${status.id}`}
                                    name="task-status"
                                    value={status.id}
                                    checked={selectedStatus === status.id}
                                    onChange={() => setSelectedStatus(status.id)}
                                    className="hidden"
                                />
                                <span
                                    className={`w-4 h-4 rounded-full border`}
                                    style={{
                                        backgroundColor:
                                            selectedStatus === status.id
                                                ? status.color_code || "#10b981"
                                                : "transparent",
                                        borderColor: status.color_code || "#10b981",
                                    }}
                                />
                                <span className="text-gray-700 text-sm">{status.title}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Description */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="description" className="text-gray-700">
                        Message
                    </label>
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
                        <span className="text-xs md:text-sm">Update Information</span>
                    </button>
                </div>
            </div>

            {/* Image Uploader */}
            <div className="space-y-4">
                <DragDropUploader
                    onFilesSelected={(files) => {
                        if (files.length > 0) setImage(files[0]);
                    }}
                    width="200px"
                    height="200px"
                />
            </div>
        </form>
    );
};

export default EditTaskForm;
