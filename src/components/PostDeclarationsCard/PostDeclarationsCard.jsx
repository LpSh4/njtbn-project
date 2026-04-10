import { useNavigate } from "react-router-dom";
import "./PostDeclarationsCard.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostDeclarationsCard = ({ data, type, role }) => {
    const navigate = useNavigate();

    const headerTitle =
        type === "resume"
            ? `${data.name || data.firstName || ""} ${data.surname || data.lastName || ""}`.trim()
            : data.company || "Unknown";

    const handleClick = () => {
        if (type === "resume") {
            navigate(`/resume/${data.id}`);
        } else {
            navigate(`/vacancy/${data.id}`);
        }
    };

    return (
        <article className="declaration-card">
            <div className="declaration-card__header">
                <img src={Ellipse} alt="Logo" />
                <h3>{headerTitle || "Unknown"}</h3>
            </div>

            <div className="declaration-card__body">
                <div className="declaration-card__text">
                    <h2>{data.profession || "No profession"}</h2>

                    <div className="declaration-card__description">
                        {type === "resume" ? (
                            <>
                                <p>Desired Salary: {data.desiredSalaryFrom || 0}$</p>
                                <p>Experience: {data.experience ?? 0} years</p>
                                <p>City: {data.city || "Unknown"}</p>
                                <p className="text-over">{data.experienceDescription || "No description"}</p>
                            </>
                        ) : (
                            <>
                                <p>Salary: {data.salaryFrom || data.salary || "Not specified"}</p>
                                <p>{data.description || "No description"}</p>
                                <p>City: {data.city || "Unknown"}</p>
                            </>
                        )}
                    </div>
                </div>

                <button onClick={handleClick}>Learn more</button>
            </div>
        </article>
    );
};