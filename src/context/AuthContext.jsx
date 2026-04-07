import { createContext, useState, useEffect } from "react";
import { checkAuth } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const isAuth = !!user;
    const role = user?.role;

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await checkAuth();
                setUser(res.data.data); // бек возвращает юзера
                console.log("AUTOLOGIN OK:", res.data.data);
            } catch {
                console.log("Нет активной сессии");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, isAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};