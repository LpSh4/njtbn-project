import { createContext, useState, useEffect } from "react";
import { checkAuth } from "../api/authApi";
import { api } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await api.post("/users/logout");
        } catch (e) {
            console.log("Logout error:", e);
        }
        setUser(null);
        localStorage.removeItem("user");
    };

    const isAuth = !!user;
    const role = user?.role;

    useEffect(() => {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setLoading(false);
        } else {
            const checkSession = async () => {
                try {
                    const res = await checkAuth();
                    if (res?.data?.data) setUser(res.data.data);
                } catch (e) {
                    console.log("No active session");
                } finally {
                    setLoading(false);
                }
            };
            checkSession();
        }
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, role, isAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};