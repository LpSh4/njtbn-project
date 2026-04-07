import { createContext, useState, useEffect } from "react";
import { checkAuth } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        console.log("USER CHANGED:", user);
    }, [user]);

    const [loading, setLoading] = useState(true);

    const login = (userData) => {
        if (typeof userData === "function") {
            setUser(prev => userData(prev));
        } else {
            setUser(userData);
        }
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


                if (res?.data?.data) {
                    setUser(res.data.data);
                    console.log("AUTOLOGIN OK:", res.data.data);
                }

            } catch (e) {
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