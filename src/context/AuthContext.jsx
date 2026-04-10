import { createContext, useState, useEffect, useCallback } from "react";
import { checkAuth } from "../api/authApi";
import { api } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback((userData) => {
        const data = typeof userData === "function" ? userData(user) : userData;

        if (data) {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            // CRITICAL: Ensure userId is stored for checkAuth to work
            if (data.id || data._id) {
                localStorage.setItem("userId", data.id || data._id);
            }
        }
    }, [user]);

    const logout = async () => {
        try { await api.post("/users/logout"); } catch (e) { console.log(e); }
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    };

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
                // We set loading false so the app renders immediately with cached data
                setLoading(false);
            }

            try {
                const res = await checkAuth();
                // Extract data based on your API structure
                const userData = res?.data?.data || res?.data || res;

                if (userData) {
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("userId", userData.id || userData._id);
                }
            } catch (e) {
                console.log("Session sync failed:", e);
                // Only logout if we don't have a cache and the request failed
                if (!cachedUser) {
                    setUser(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("userId");
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const value = {
        user,
        role: user?.role,
        isAuth: !!user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div className="loader">Loading...</div>}
        </AuthContext.Provider>
    );
};