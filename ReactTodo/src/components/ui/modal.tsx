import type { ReactNode, FC } from 'react';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode,
    title?: string;
}


const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {

    if (!isOpen) {
        return null;
    }

    return (
        <>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {/* Modal container */}
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-6 relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 font-demi">
                        {title && <h2 className="relative text-2xl font-semibold text-gray-800 before:absolute before:bottom-0 before:w-40 before:h-[3px] before:bg-red-500 before:content-['']">{title}</h2>}
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-red-500 text-red-300 text-4xl leading-none focus:outline-none"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Body */}
                    <div className="text-gray-700 mb-4 rounded-lg p-3 border border-gray-400 font-inter">
                        {children}
                    </div>


                </div>
            </div>

        </>
    )

}



export default Modal;