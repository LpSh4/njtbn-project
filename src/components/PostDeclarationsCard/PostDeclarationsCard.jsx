import "./PostDeclarationsCard.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostDeclarationsCard = ({ data, type, role }) => {
    const headerTitle =
        type === "resume" && role === "employer"
            ? `${data.name} ${data.surname}`
            : data.company || "Unknown";

    return (
        <article className="declaration-card">
            <div className="declaration-card__header">
                <img src={Ellipse} alt="Logo" />
                <h3>{headerTitle}</h3>
            </div>

            <div className="declaration-card__body">
                <div className="declaration-card__text">
                    <h2>{data.profession}</h2>

                    <div className="declaration-card__description">
                        {type === "resume" && role === "employer" ? (
                            <>
                                <p>Experience: {data.experience} years</p>
                                <p>{data.experienceDescription}</p>
                                <p>Desired Salary: {data.desiredSalaryFrom}$</p>
                                <p>City: {data.city}</p>
                            </>
                        ) : (
                            <>
                                <p>Salary: {data.salaryFrom || data.salary}</p>
                                <p>{data.description}</p>
                                <p>City: {data.city}</p>
                            </>
                        )}
                    </div>
                </div>
                <button>Learn more</button>
            </div>
        </article>
    );
};