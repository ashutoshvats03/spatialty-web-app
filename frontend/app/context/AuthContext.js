"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await axios.post("http://127.0.0.1:8000/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;

                    // Save new access token
                    localStorage.setItem("token", access);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
                    setUser(JSON.parse(localStorage.getItem("user")));
                    alert("refresh token successful");
                } catch (error) {
                    console.log("Error refreshing token:", error);
                    logout(); // Log out user if refresh fails
                }
            }
            // Stop loading regardless of success or failure
        };

        initializeAuth();
        setLoading(true); 
    }, []);

    

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", {
                username,
                password,
            });

            const { access, refresh, user, data } = response.data;
            // Store tokens in localStorage
            localStorage.setItem("data", JSON.stringify(data))
            localStorage.setItem("token", access);
            localStorage.setItem("refreshToken", refresh);
            localStorage.setItem("user", JSON.stringify(user));
            setLoading(true);
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
        // setLoading(false);
        setUsers(null);
        router.push("/");
    };

    const admin = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/adminLogin/", {
                username,
                password,
            });

            const { users, access, refresh, user } = response.data;
            // Store tokens in localStorage
            localStorage.setItem("users", JSON.stringify(users))
            localStorage.setItem("token", access);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("refreshToken", refresh);

            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            setUsers(users);
            setUser(user);
            // setLoading(false);
            router.push("/adminDashboard");
        } catch (error) {
            console.log("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <AuthContext.Provider value={{ user,loading,login, users,  login, logout, admin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
