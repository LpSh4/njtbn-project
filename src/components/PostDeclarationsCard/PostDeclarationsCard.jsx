import { useNavigate } from "react-router-dom";
import "./PostDeclarationsCard.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostDeclarationsCard = ({ data, type }) => {
    const navigate = useNavigate();


    const headerTitle = type === "resume"
        ? `${data.name || ""} ${data.surname || ""}`.trim()
        : (data.companyName || data.company || data.name);

    const handleClick = () => {
        console.log("Данные карточки:", data); 
        const path = type === "resume" ? "resume" : "vacancy";
        navigate(`/${path}/${data.id}`);
    };

    return (
        <article className="declaration-card">
            <div className="declaration-card__header">
                <img src={Ellipse} alt="Logo" />
                {}
                <h3>{headerTitle || (type === "resume" ? "Candidate" : "Company")}</h3>
            </div>

            <div className="declaration-card__body">
                <div className="declaration-card__text">
                    <h2>{data.profession || "No profession"}</h2>

                    <div className="declaration-card__description">
                        {type === "resume" ? (
                            <>
                                {}
                                {data.desiredSalaryFrom > 0 && <p>Desired Salary: {data.desiredSalaryFrom}$</p>}
                                <p>Experience: {data.experience || 0} years</p>
                                {data.city && <p>City: {data.city}</p>}
                                {data.experienceDescription && (
                                    <p className="text-over">{data.experienceDescription}</p>
                                )}
                            </>
                        ) : (
                            <>
                                {}
                                {(data.salaryFrom || data.salary) ? (
                                    <p>Salary: {data.salaryFrom || data.salary}$</p>
                                ) : (
                                    <p>Salary: Negotiable</p>
                                )}
                                {data.description && <p className="text-over">{data.description}</p>}
                                {data.city && <p>City: {data.city}</p>}
                            </>
                        )}
                    </div>
                </div>

                <button onClick={handleClick}>Learn more</button>
            </div>
        </article>
    );
};