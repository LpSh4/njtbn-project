import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../api/authApi";
import { api } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            const userData = response.data.data;

            if (userData) {
                setUser(userData);

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("userId", userData.id);

                if (userData.role === "employer") {
                    navigate("/profileEmployer");
                } else {
                    navigate("/profileSpecialist");
                }
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
        } catch (e) {
            console.log("Logout error:", e);
        }
        setUser(null);
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                try {
                    setUser(JSON.parse(cachedUser));
                } catch (e) {
                    localStorage.removeItem("user");
                }
                setLoading(false);
            }

            try {
                const res = await checkAuth();
                const userData = res?.data?.data || res?.data || res;

                if (userData) {
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("userId", userData.id);
                }
            } catch (e) {
                console.log("Session sync failed:", e);

                if (e.response?.status === 401) {
                    setUser(null);
                    localStorage.clear();
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const value = {
        user,
        setUser,
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