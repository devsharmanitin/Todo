import React, { useState, useEffect } from "react";

const BaseUrl = "http://localhost:8000/api"; // Adjust as needed

// Helper to get headers with Authorization
const getHeaders = () => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
});

// GET request helper
export const getRequest = async (endpoint: string) => {
    try {
        const response = await fetch(BaseUrl + endpoint, {
            method: "GET",
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

// POST request helper
export const postRequest = async (endpoint: string, data: any) => {
    try {
        const response = await fetch(BaseUrl + endpoint, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

