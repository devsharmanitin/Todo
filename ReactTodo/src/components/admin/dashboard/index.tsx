import React, { useState, useEffect } from "react";


function SuperDashboard() {
    const [users, setUsers] = useState();

    return (
            <div className="flex">
                <div className="border border-gray-300 rounded-lg">
                    <h2>Users</h2>
                    <span>4</span>
                </div>
                <div className="border border-gray-300 rounded-lg">
                    <h2>Tasks</h2>
                    <span>4</span>
                </div>
            </div>

    );
}

export default SuperDashboard;