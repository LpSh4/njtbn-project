import { useNavigate, useLocation } from "react-router-dom";
import "./PostViewProfile.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostViewProfile = ({ data, type }) => {
    const navigate = useNavigate();
    const location = useLocation();


    if (!data) return <div className="postview-profile">Loading...</div>;


    const isSpecialist = type === "resume" || data.role === "specialist";

    const displayName = isSpecialist
        ? `${data.name || ""} ${data.surname || ""}`.trim() || "Candidate"
        : (data.companyName || data.company || data.name || "Company Name");


    const contactLabel = isSpecialist ? "Status" : "Manager";
    const contactValue = isSpecialist ? (data.status || "Open to work") : (data.name || "Employer");


    const userId = isSpecialist
        ? (data.specialistId || data.specialistid || data.userId || data.authorId)
        : (data.managerId || data.managerid || data.authorId || data.userId);

    console.log("НАЙДЕННЫЙ ID ДЛЯ ПЕРЕХОДА:", userId);
    console.log("ПЕРЕХОД В ПРОФИЛЬ. ID автора:", userId, "Весь объект:", data);
    const isProfilePage = location.pathname.includes("/profile");

    const handleCheckProfile = () => {
        if (userId) navigate(`/profile/${userId}`);
    };

    return (
        <section className="postview-profile">
            <div className="postview-profile__info">
                <img src={Ellipse} alt="Avatar" />
                <div>
                    <p className="postview-profile__title">{displayName}</p>
                    <p className="postview-profile__city">{data.city || "Region not specified"}</p>
                </div>
            </div>

            <div className="postview-profile__content">
                {}
                <p>{contactLabel}: {contactValue}</p>

                {data.phone && <p>Phone: {data.phone}</p>}

                {data.email && <p>Email: {data.email}</p>}

                {}
                {!isSpecialist && (data.companyWebsite || data.website) ? (
                    <p>
                        <a href={(data.companyWebsite || data.website).startsWith('http')
                            ? (data.companyWebsite || data.website)
                            : `https://${data.companyWebsite || data.website}`}
                           target="_blank"
                           rel="noreferrer"
                           className="profile-link">
                            Visit Website
                        </a>
                    </p>
                ) : null}
            </div>

            {!isProfilePage && userId && (
                <button className="btn" onClick={handleCheckProfile}>
                    check profile
                </button>
            )}
        </section>
    );
};