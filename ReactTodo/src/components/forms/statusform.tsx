import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface StatusFormProps {
    isEdit?: boolean;
    statusToEdit?: { id: string; title: string }; // you can adjust this type
    onSuccess?: () => void; // optional callback after save
}


const StatusForm: React.FC<StatusFormProps> = ({ isEdit = false, statusToEdit, onSuccess }) => {
    const { authenticatedRequest } = useAuth();
    const [title, setTitle] = useState(statusToEdit?.title || "");

    useEffect(() => {
        if (isEdit && statusToEdit) {
            setTitle(statusToEdit.title);
        }
    }, [isEdit, statusToEdit]);

    const handleStatusSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = isEdit
                ? `/statuses/update/${statusToEdit?.id}`
                : "/statuses/create";

            const method = isEdit ? "PUT" : "POST";

            const response = await authenticatedRequest(url, {
                method,
                body: JSON.stringify({ title }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            onSuccess?.(); // optional callback (e.g., close modal or refresh list)
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            } else {
                console.error("An unknown error occurred.");
            }
        }
    };

    return (
        <form className="flex space-x-4" onSubmit={handleStatusSubmission}>
            <div className="space-y-4 flex-1">
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
                <div className="flex flex-col space-y-2">
                    <button className="w-max bg-red-500 text-gray-100 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2">
                        {isEdit ? "Update" : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StatusForm;