import React, { useState, useEffect } from "react";

const BaseUrl = "http://localhost:8000/api"; // Adjust as needed


// Helper to get headers with Authorization
const getHeaders = () => ({
    "Content-Type": "application/json",
    "Accept": "multipart/form-data",
    "Authorization": "Bearer " + localStorage.getItem("token")
});

// GET request helper
export const getRequest = async (endpoint: string) => {
    return refreshAccessToken(() =>
        fetch(BaseUrl + endpoint, {
            method: "GET",
            headers: getHeaders()
        })
    ).then(async (res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    });
};

// POST request helper
export const postRequest = async (endpoint: string, data: any) => {
    return refreshAccessToken(() =>
        fetch(BaseUrl + endpoint, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
    ).then(async (res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    });
};



export const refreshToken = async (endpoint = "/auth/refresh") => {
    try {
        const response = await fetch(BaseUrl + endpoint, {
            method: "POST",
            headers: getHeaders()
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error("Failed to refresh token");
        }

        const token = data.access_token;
        localStorage.setItem("token", token);
        return token;
    } catch (error) {
        console.log("Error:- ", error);
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
        // window.location.href = "/login";

        throw error;
    }
};

const refreshAccessToken = async (originalRequest: () => Promise<Response>) => {
    const response = await originalRequest();

    if (response.status === 401) {
        const newToken = await refreshToken();
        console.log("Token Refreshed:- ", newToken);
        return await originalRequest(); // retry
    }

    return response;
};


