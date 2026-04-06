import { createContext, useState, useEffect } from "react";
import { getMe, getUser } from "../api/authApi";

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
        const checkAuth = async () => {
            try {
                const meRes = await getMe();
                const { id, role } = meRes.data.data;

                const userRes = await getUser(id);

                login({
                    ...userRes.data.data,
                    role
                });

            } catch {
                console.log("Не авторизован");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, isAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};