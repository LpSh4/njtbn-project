import "./profile.scss"
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {ProfileUser} from "../ProfileHeader/profileUser.jsx";
import {ProfileDescriptions} from "../ProfileDescritions/profileDescriptions.jsx";
import {ProfileProfession} from "../ProfileProfession/ProfileProfession.jsx";
import {ProfileBasicInfo} from "../ProfileBasicInfo/ProfileBasicInfo.jsx";

export const ProfileRedirect = () => {
    const { role, loading, isAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!isAuth) {
            navigate("/");
            return;
        }

        if (role === "employer") {
            navigate("/profileEmployer");
        } else if (role === "specialist") {
            navigate("/profileSpecialist");
        } else {
            navigate("/");
        }

    }, [role, loading, isAuth]);

    return (
        <>
        <section className="profile">
            <div className="profile__content">
                <ProfileUser></ProfileUser>
                <ProfileDescriptions></ProfileDescriptions>
                <ProfileProfession></ProfileProfession>


            </div>

            <div className="profile__content">
                <ProfileBasicInfo>

                </ProfileBasicInfo>
            </div>
        </section>
        </>
    )
};

export default ProfileRedirect;