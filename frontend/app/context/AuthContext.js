"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
            const response = await axios.get("http://127.0.0.1:8000/dashboard/", );
            setUser(response.data.user);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", {
                username,
                password,
            });

            const { access, refresh, user, data } = response.data;
            // Store tokens in localStorage
            localStorage.setItem("data", JSON.stringify(data));
            console.log(JSON.parse(localStorage.getItem("data")));
            localStorage.setItem("token", access);
            localStorage.setItem("refreshToken", refresh);

            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            setUser(user);
            router.push("/");
        } catch (error) {
            console.log("Error logging in:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("data");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
