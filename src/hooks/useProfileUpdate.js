import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../api/authApi";
export const useProfileUpdate = () => {
    const { setUser } = useContext(AuthContext);

    const updateProfile = async (data) => {
        try {
            const res = await updateUser(data);
            if (res.status === 204 || res.status === 200) {


                setUser((prevUser) => {
                    const nextUser = { ...prevUser, ...data };
                    localStorage.setItem("user", JSON.stringify(nextUser));
                    return nextUser;
                });

                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return { updateProfile };
};