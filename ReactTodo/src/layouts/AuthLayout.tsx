import React from "react";
import { Outlet } from "react-router-dom";


const AuthLayout = () => {
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">

                <Outlet /> {/* Auth pages like Login and Register will be rendered here */}
            </div>
        </>
    );
}

export default AuthLayout;