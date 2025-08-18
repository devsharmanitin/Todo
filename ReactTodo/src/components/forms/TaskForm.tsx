import React, { useState, useEffect } from 'react';
import DragDropUploader from '../ui/dragdropuploader';

interface Priority {
    id: number;
    title: string;
    color_code: string;
}

interface TaskFormProps {
    initialValues?: {
        title?: string;
        description?: string;
        date?: string;
        priorityId?: number;
        image?: File | null;
    };
    priorities: Priority[];
    onSubmit: (data: {
        title: string;
        description: string;
        date: string;
        priorityId: number;
        image: File | null;
    }) => void;
    submitLabel?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
    initialValues = {},
    priorities,
    onSubmit,
    submitLabel = "Save Task"
}) => {
    const [title, setTitle] = useState(initialValues.title || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [date, setDate] = useState(initialValues.date || "");
    const [selectedPriority, setSelectedPriority] = useState(initialValues.priorityId || 0);
    const [image, setImage] = useState<File | null>(initialValues.image || null);

    useEffect(() => {
        // If initialValues change (e.g. when editing), update state
        setTitle(initialValues.title || "");
        setDescription(initialValues.description || "");
        setDate(initialValues.date || "");
        setSelectedPriority(initialValues.priorityId || 0);
        setImage(initialValues.image || null);
    }, [initialValues]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !description || !selectedPriority) {
            return alert("All fields are required");
        }
        onSubmit({ title, description, date, priorityId: selectedPriority, image });
    };

    return (
        <form className="flex space-x-4" onSubmit={handleSubmit}>
            <div className="space-y-4 flex-1">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="title" className="text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        id="title"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-gray-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        id="date"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <legend className="text-gray-700 text-base mb-2">Priority</legend>
                <div className="flex flex-row space-x-4">
                    {priorities.map(priority => {
                        const isSelected = selectedPriority === priority.id;
                        return (
                            <div key={priority.id} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`priority-${priority.id}`}
                                    name="task-priority"
                                    value={priority.id}
                                    checked={isSelected}
                                    onChange={e => setSelectedPriority(Number(e.target.value))}
                                    className="appearance-none border border-gray-300 p-2 rounded-full focus:outline-none focus:border-transparent cursor-pointer"
                                    style={{
                                        backgroundColor: isSelected
                                            ? priority.color_code || '#ef4444'
                                            : 'transparent',
                                    }}
                                />
                                <label
                                    htmlFor={`priority-${priority.id}`}
                                    className="text-gray-700 text-sm cursor-pointer"
                                >
                                    {priority.title}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="description" className="text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y min-h-[100px]"
                        placeholder="Enter task description here..."
                        rows={4}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <button
                        type="submit"
                        className='w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drafting-compass-icon lucide-drafting-compass"><path d="m12.99 6.74 1.93 3.44" /><path d="M19.136 12a10 10 0 0 1-14.271 0" /><path d="m21 21-2.16-3.84" /><path d="m3 21 8.02-14.26" /><circle cx="12" cy="5" r="2" /></svg>
                        <span className='text-xs md:text-sm'>{submitLabel}</span>
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                <DragDropUploader onFilesSelected={files => {
                    if (files.length > 0) setImage(files[0]);
                }} width="200px" height="200px" />
            </div>
        </form>
    );
};

export default TaskForm;