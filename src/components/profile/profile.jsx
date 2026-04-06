import "./profile.scss"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {ProfileUser} from "../ProfileHeader/profileUser.jsx";
export const Profile = () => {
    const { role } = useContext(AuthContext);

    const userData =
        role === "employer"
            ? {
                name: "Компания ООО",
                job: "Работодатель",
                date: "2020-01-01",
            }
            : {
                name: "John",
                job: "Frontend developer",
                date: "2000-05-10",
            };

    return (
        <section className="profile">
            <ProfileUser data={userData} />
        </section>
    );
};