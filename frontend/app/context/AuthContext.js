"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await axios.post("http://127.0.0.1:8000//token/refresh/", {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;

                    // Save new access token
                    localStorage.setItem("token", access);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

                    // Optionally fetch user data if needed
                    await fetchUserData(access);
                } catch (error) {
                    console.log("Error refreshing token:", error);
                    logout(); // Log out user if refresh fails
                }
            }
            setLoading(false); // Stop loading regardless of success or failure
        };

        initializeAuth();
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000//dashboard/", );
            setUser(response.data.user);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000//login/", {
                username,
                password,
            });

            const { access, refresh, user, data } = response.data;
            // Store tokens in localStorage
            localStorage.setItem("data", JSON.stringify(data))
            localStorage.setItem("token", access);
            localStorage.setItem("refreshToken", refresh);
            localStorage.setItem("user", JSON.stringify(user));

            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            setUser(user);
            router.push("/wayVision1");
        } catch (error) {
            console.log("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("data");
        localStorage.removeItem("user");
        localStorage.removeItem("users");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setLoading(true);
        setUsers(null);
        router.push("/");
    };

    const admin = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000//adminLogin/", {
                username,
                password,
            });

            const {users,access,user } = response.data;
            // Store tokens in localStorage
            localStorage.setItem("users", JSON.stringify(users))
            localStorage.setItem("token", access);
            localStorage.setItem("user", JSON.stringify(user));

            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            setUsers(users);
            setUser(user);
            setLoading(false);
            router.push("/adminDashboard");
        } catch (error) {
            console.log("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <AuthContext.Provider value={{ user,users, loading, login, logout,admin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
