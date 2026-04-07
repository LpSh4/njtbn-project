import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../api/authApi";

export const useProfileUpdate = () => {
    const { user, login } = useContext(AuthContext);

    const updateProfile = async (data) => {
        try {
            const payload = {
                ...data,

                phone: data.phone || user.phone,
                gender: data.gender || user.gender,
                city: data.city || user.city,
            };

            const res = await updateUser(payload);
            console.log("UPDATED USER:", res.data.data);
            login(prev => ({ ...prev, ...res.data.data }));
            console.log("CONTEXT USER:", user);
            return { success: true };

        } catch (err) {
            const responseData = err.response?.data;

            if (responseData?.errors) {
                const errors = {};
                responseData.errors.forEach((e) => {
                    errors[e.field] = e.message;
                });

                return { success: false, errors };
            }

            return { success: false };
        }
    };



    return { updateProfile };
};