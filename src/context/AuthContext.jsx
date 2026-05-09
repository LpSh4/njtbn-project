import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth, getUserProfile } from "../api/authApi";
import { api } from "../api/axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const refreshUser = useCallback(async () => {
        try {
            const authRes = await checkAuth();
            const authData = authRes?.data?.data || authRes?.data || authRes;

            if (authData && authData.id) {
                const profileRes = await getUserProfile(authData.id);
                const fullUserData = profileRes?.data?.data || profileRes?.data || profileRes;

                setUser(fullUserData);
                localStorage.setItem("user", JSON.stringify(fullUserData));
                localStorage.setItem("userId", fullUserData.id);
                return fullUserData;
            }
            return null;
        } catch (e) {
            console.error("Refresh user failed:", e);
            if (e.response?.status === 401) {
                logout(false);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            const userData = response.data.data;

            if (userData) {
                localStorage.setItem("userId", userData.id);

                const fullData = await refreshUser();

                const finalUser = fullData || userData;
                if (finalUser.role === "employer") {
                    navigate("/profileEmployer");
                } else {
                    navigate("/profileSpecialist");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async (shouldNavigate = true) => {
        try {
            await api.post("/users/logout");
        } catch (e) {
            console.log("Logout error:", e);
        }
        setUser(null);
        localStorage.clear();
        if (shouldNavigate) navigate('/');
    };

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = localStorage.getItem("user");
            const cachedUserId = localStorage.getItem("userId");

            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
            }

            if (cachedUserId) {
                await refreshUser();
            } else {
                setLoading(false);
            }
        };
        initAuth();
    }, [refreshUser]);

    const value = {
        user,
        setUser,
        refreshUser,
        role: user?.role,
        isAuth: !!user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div className="loader-container">
                    <div className="loader">Loading <span className="point point-1">.</span> <span className="point point-2">.</span> <span className="point point-3">.</span></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};